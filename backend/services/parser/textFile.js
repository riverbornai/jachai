const fs = require("fs");
const path = require("path");
const textract = require('textract');
const downloadFile = require("../downloadFile");

// Accepts either a remote URL (downloaded first) or a local file path
// (e.g. a file already written to disk by a direct upload).
async function textFileParser(source) {
  let filePath;
  try {
    if (/^https?:\/\//i.test(source)) {
      const { fileName } = await downloadFile(source);
      filePath = path.resolve(__dirname, "..", "..", "uploads", fileName);
    } else {
      filePath = source;
    }
    let result = await extractTextFromFile(filePath);
    return result;
  } catch (error) {
    console.error("Error reading the file:", error);
    throw new Error("Failed to parse the text file.");
  } finally {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

module.exports = { textFileParser };


function extractTextFromFile(filePath) {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}