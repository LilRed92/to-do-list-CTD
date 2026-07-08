import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const commitMsgFile = process.argv[2];
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY environment variable is missing.");
  process.exit(1);
}

async function generateCommitMessage() {
  // 1. Get staged files to determine scope and for the fallback
  const stagedFiles = execSync("git diff --cached --name-only")
    .toString()
    .trim()
    .split("\n");
  if (!stagedFiles.length || stagedFiles[0] === "") process.exit(0);

  // 2. Determine Monorepo Scope
  let scope = "root";
  const touchesClient = stagedFiles.some((f) => f.startsWith("client/"));
  const touchesServer = stagedFiles.some((f) => f.startsWith("server/"));

  if (touchesClient && touchesServer) scope = "fullstack";
  else if (touchesClient) scope = "client";
  else if (touchesServer) scope = "server";

  // 3. Get the actual code changes
  let diff = execSync("git diff --cached").toString().trim();
  if (diff.length > 8000)
    diff = diff.substring(0, 8000) + "\n...[diff truncated]";

  // 4. Dynamically read your custom rules from the text file
  let customRules = "";
  try {
    customRules = fs.readFileSync(path.join(__dirname, ".ai-commit-rules.txt"), "utf8");
  } catch (err) {
    customRules = "No additional custom rules provided.";
  }

  // 5. Get the current commit count dynamically
  // let commitCount = '0';
  // try {
  //     // Retrieve the number of existing commits
  //     const countRaw = execSync('git rev-list --all --count', { stdio: 'pipe' }).toString().trim();
  //     // Add 1 to account for the commit you are currently creating
  //     commitCount = (parseInt(countRaw, 10) + 1).toString();
  // } catch (err) {
  //     // Safety fallback just in case the git command fails
  //     commitCount = '1';
  // }

  // 6. The strict instructions for Gemini
  const prompt = `
    You are an expert developer. Read the following git diff and write a Conventional Commit message.

    Core Rules:
    1. Start the subject line with exactly one relevant Gitmoji (e.g., ✨, 🐛, ♻️, 💄, 📦).
    2. Use a conventional type (feat, fix, chore, refactor, style, docs, test).
    3. You MUST use this exact scope: (${scope}).
    4. Format: Subject line, followed by a blank line, followed by a bulleted body (if the diff warrants detailed explanation).


    Custom Project Rules (Follow these strictly):
    ${customRules}

    Git Diff:
    ${diff}
    `;
  //5. APPEND the exact text "${commitCount}/50 commits completed" on a new line at the very end of the message.

  console.log("🤖 Asking Gemini to analyze your changes...");

  // 6. Call the Gemini API with a Try/Catch block for the Fallback
  try {
    // Add a 5-second timeout to the fetch request so it doesn't hang forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    // Extract and clean up the AI's response
    let aiMessage = data.candidates[0].content.parts[0].text.trim();
    aiMessage = aiMessage
      .replace(/^```[a-z]*\n/i, "")
      .replace(/\n```$/i, "")
      .trim();

    // 6. Inject the message into Git
    if (commitMsgFile) {
      const currentMsg = fs.readFileSync(commitMsgFile, "utf8");
      // Force the AI message to the very top of the file
      fs.writeFileSync(commitMsgFile, aiMessage + "\n\n" + currentMsg);
      console.log(`✅ Success!`);
    } else {
      console.log("\n✅ Generated Commit Message:\n");
      console.log(aiMessage);
    }
  } catch (err) {
    // 7. The Offline Fallback Logic
    console.error(
      "\n⚠️ AI Generation failed or timed out. Using offline fallback.",
    );
    console.error("🔍 Exact Error:", err.message);

    let type = "chore";
    if (stagedFiles.some((f) => f.includes(".test.") || f.includes("spec")))
      type = "test";
    else if (stagedFiles.some((f) => f.includes("client/src/"))) type = "feat";
    else if (stagedFiles.some((f) => f.includes("server/"))) type = "feat";
    else if (stagedFiles.some((f) => f.endsWith(".css"))) type = "style";

    const fileSummary =
      stagedFiles.length > 2
        ? `${stagedFiles
            .slice(0, 2)
            .map((f) => f.split("/").pop())
            .join(", ")}...`
        : stagedFiles.map((f) => f.split("/").pop()).join(", ");

    const fallbackMsg = `🤖 ${type}(${scope}): update ${fileSummary}\n\n[Auto-generated offline fallback]`; //\n\n${commitCount}/50 commits completed

    if (commitMsgFile) {
      const currentMsg = fs.readFileSync(commitMsgFile, "utf8");
      // Force the fallback message to the very top of the file
      fs.writeFileSync(commitMsgFile, fallbackMsg + "\n\n" + currentMsg);
    }
  }
}

generateCommitMessage();
