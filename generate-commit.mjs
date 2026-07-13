import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';

const commitMsgFile = process.argv[2];
const geminiKey = process.env.GEMINI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

if (!geminiKey) {
	console.error("❌ GEMINI_API_KEY environment variable is missing.");
	process.exit(1);
}

async function generateCommitMessage() {
	const stagedFiles = execSync('git diff --cached --name-only').toString().trim().split('\n');
	if (!stagedFiles.length || stagedFiles[0] === '') process.exit(0);

	// 1. Detect Stack and Scope Dynamically
	let scope = 'root';

	const isWeb = stagedFiles.some(f => f.includes('client/') || f.includes('server/') || f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.js'));
	const isPython = stagedFiles.some(f => f.endsWith('.py'));
	const touchesDocs = stagedFiles.some(f => f.endsWith('.md') || f.startsWith('documents/'));
	const touchesEnv = stagedFiles.some(f => f === 'requirements.txt' || f === 'package.json' || f.endsWith('.env'));

	if (isWeb && !isPython) {
		const touchesClient = stagedFiles.some(f => f.includes('client/') || f.includes('components/'));
		const touchesServer = stagedFiles.some(f => f.includes('server/') || f.includes('api/'));
		if (touchesClient && touchesServer) scope = 'fullstack';
		else if (touchesClient) scope = 'client';
		else if (touchesServer) scope = 'server';
		else if (touchesDocs) scope = 'docs';
		else if (touchesEnv) scope = 'env';
	}
	else if (isPython) {
		const touchesTools = stagedFiles.some(f => f.includes('tool') || f.includes('search'));
		const touchesAgent = stagedFiles.some(f => f.includes('agent') || f.includes('loop') || f.includes('main.py'));
		if (touchesAgent && touchesTools) scope = 'agent-orchestration';
		else if (touchesAgent) scope = 'agent';
		else if (touchesTools) scope = 'tools';
		else if (touchesDocs) scope = 'docs';
		else if (touchesEnv) scope = 'env';
		else scope = 'core';
	}
	else {
		if (touchesDocs) scope = 'docs';
		else if (touchesEnv) scope = 'env';
	}

	// 2. Filter out Web, Python, and all local Workflow Tooling clutter
	let diff = '';
	try {
		diff = execSync(
			'git diff --cached -- . ' +
			'":(exclude).venv/*" ' +
			'":(exclude)__pycache__/*" ' +
			'":(exclude)node_modules/*" ' +
			'":(exclude)package-lock.json" ' +
			'":(exclude).husky/*" ' +
			'":(exclude)*generate-commit*" ' +
			'":(exclude)*readme-generator*" ' +
			'":(exclude)*pr-description*"'
		).toString().trim();
	} catch (err) {
		diff = execSync('git diff --cached').toString().trim();
	}

	if (!diff) diff = execSync('git diff --cached').toString().trim();
	if (diff.length > 8000) diff = diff.substring(0, 8000) + "\n...[diff truncated]";

	let customRules = '';
	try { customRules = fs.readFileSync('.ai-commit-rules.txt', 'utf8'); }
	catch (err) { customRules = 'No additional custom rules provided.'; }

	const prompt = `
	You are an expert developer. Read the following git diff and write a Conventional Commit message.

	Core Rules:
	1. Start the subject line with exactly one relevant Gitmoji (e.g., ✨, 🐛, ♻️, 📝, 📦).
	2. Use a conventional type (feat, fix, chore, refactor, style, docs, test).
	3. You MUST use this exact scope: (${scope}).
	4. Format: Subject line, followed by a blank line, followed by a bulleted body (if the diff warrants detailed explanation).

	Custom Project Rules (Follow these strictly):
	${customRules}

	Git Diff:
	${diff}
	`;

	// 3. Primary Request: Gemini
	try {
		console.log(`🤖 Asking Gemini to analyze your changes...`);
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000);

		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={geminiKey}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
			signal: controller.signal
		});

		clearTimeout(timeoutId);
		const data = await response.json();
		if (data.error) throw new Error(data.error.message);

		let aiMessage = data.candidates[0].content.parts[0].text.trim().replace(/^```\w*\n|\n```$/g, '');
		if (commitMsgFile) {
			fs.writeFileSync(commitMsgFile, aiMessage + "\n\n" + fs.readFileSync(commitMsgFile, 'utf8'));
		}
		console.log(`✅ Success (via Gemini)!`);

	} catch (primaryErr) {
		console.warn(`⚠️ Gemini API failed. Trying Groq fallback...`);

		// 4. Secondary Request: Groq
		if (groqKey) {
			try {
				const fallbackController = new AbortController();
				const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 15000);

				const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
					body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.2 }),
					signal: fallbackController.signal
				});

				clearTimeout(fallbackTimeoutId);
				const data = await response.json();
				if (data.error) throw new Error(data.error.message);

				let aiMessage = data.choices[0].message.content.trim().replace(/^```\w*\n|\n```$/g, '');
				if (commitMsgFile) {
					fs.writeFileSync(commitMsgFile, aiMessage + "\n\n" + fs.readFileSync(commitMsgFile, 'utf8'));
				}
				console.log(`✅ Success (via Groq)!`);
				return;
			} catch (secondaryErr) { console.error("❌ Groq fallback failed."); }
		}

		// 5. Offline Fallback
		console.error("\n🚨 Using offline fallback.");
		let type = 'chore';
		if (stagedFiles.some(f => f.includes('test') || f.includes('pytest'))) type = 'test';
		else if (stagedFiles.some(f => f.endsWith('.py') || f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.tsx'))) type = 'feat';
		else if (stagedFiles.some(f => f.endsWith('.md'))) type = 'docs';

		const fileSummary = stagedFiles.length > 2 ? `${stagedFiles.slice(0, 2).map(f => f.split('/').pop()).join(', ')}...` : stagedFiles.map(f => f.split('/').pop()).join(', ');
		const fallbackMsg = `🤖 ${type}(${scope}): update ${fileSummary}\n\n[Auto-generated offline fallback]`;

		if (commitMsgFile) fs.writeFileSync(commitMsgFile, fallbackMsg + "\n\n" + fs.readFileSync(commitMsgFile, 'utf8'));
	}
}

generateCommitMessage();