import fs from 'node:fs/promises';

/**
 * Ensures the directory exists. Creates recursively if needed.
 * @param {string} dirPath - Directory path to ensure.
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Writes a JSON object to a file (pretty printed).
 * @param {string} filePath - File path to write.
 * @param {object} data - JSON data to write.
 * @returns {Promise<void>}
 */
export async function writeJSON(filePath, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonStr, 'utf-8');
}

/**
 * Reads a JSON file and parses it.
 * @param {string} filePath - File path to read.
 * @returns {Promise<object>} Parsed JSON object.
 */
export async function readJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Checks if a file or directory exists.
 * @param {string} pathToCheck - Path to check.
 * @returns {Promise<boolean>}
 */
export async function exists(pathToCheck) {
  try {
    await fs.access(pathToCheck);
    return true;
  } catch {
    return false;
  }
}

/**
 * Writes content only if different from existing file content.
 * @param {string} filePath - File path to write.
 * @param {string} content - New content to write.
 * @returns {Promise<boolean>} Whether the file was updated.
 */
export async function safeWrite(filePath, content) {
  try {
    const existing = await fs.readFile(filePath, 'utf-8');
    if (existing === content) {
      return false; // No changes
    }
  } catch {
    // File doesn't exist or unreadable — proceed to write
  }

  await fs.writeFile(filePath, content, 'utf-8');
  return true;
}
