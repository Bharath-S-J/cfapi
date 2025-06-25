import fs from "node:fs/promises";

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJSON(filePath, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonStr, "utf-8");
}

export async function readJSON(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function exists(pathToCheck) {
  try {
    await fs.access(pathToCheck);
    return true;
  } catch {
    return false;
  }
}

export async function safeWrite(filePath, content) {
  try {
    const existing = await fs.readFile(filePath, "utf-8");
    if (existing === content) {
      return false; // No changes
    }
  } catch {
    // File doesn't exist or unreadable — proceed to write
  }

  await fs.writeFile(filePath, content, "utf-8");
  return true;
}
