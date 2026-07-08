import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

async function generateReadme() {
  // Pull the API key from environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY environment variable is not set.");
    return;
  }

  console.log("🔍 Reading local project files for context...");

  // Read the current README.md to use as the template
  const templatePath = path.join(__dirname, "..", "README.md");
  let templateContent = "";
  if (fs.existsSync(templatePath)) {
    templateContent = fs.readFileSync(templatePath, "utf8");
  } else {
    console.warn("⚠️ No README.md found to use as a template.");
  }

  const srcPath = path.join(__dirname, "..", "src");
  let codeContext = "";

  // Gather core files to give the model context about your actual project structure
  const filesToAnalyze = [
    path.join(srcPath, "main.jsx"),
    path.join(srcPath, "App.jsx"),
    path.join(srcPath, "App.css"),
    path.join(srcPath, "index.css"),
    path.join(__dirname, "..", "index.html"),
    path.join(__dirname, "..", "package.json"),
  ];

  filesToAnalyze.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      const fileName = path.relative(__dirname, filePath);
      const content = fs.readFileSync(filePath, "utf8");
      codeContext += `\n--- File: ${fileName} ---\n${content}\n`;
    }
  });

  console.log("🧠 Sending context to Gemini API...");

  const prompt = `You are an expert technical documentation writer.
I have a full-stack project. I want you to write a clean, professional, and thorough README.md file for it.

Here is the exact structure and template you MUST use. Keep the badges section and update according to technology used in the project and the general layout exactly the same, but replace the generic placeholders (like "Project Title") and generic descriptions with the actual details of the project based on the provided source code:

--- TEMPLATE START ---
${templateContent}
--- TEMPLATE END ---

Here are the core source files of the project to analyze:
${codeContext}

Do not wrap your response in an outer markdown code block, just output the raw markdown content directly.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.error?.message ?? `API response status: ${response.status}`
      );
    }

    if (!data.candidates?.length) {
      throw new Error(`No candidates returned. Full response: ${JSON.stringify(data)}`);
    }

    const markdownOutput = data.candidates[0].content.parts[0].text;

    // Write the output directly to the root README.md
    fs.writeFileSync(path.join(__dirname, "..", "README.md"), markdownOutput);
    console.log(
      "✨ Success! Your root README.md has been automatically generated.",
    );
  } catch (error) {
    console.error("❌ Failed to generate README:", error.message);
  }
}

generateReadme();
