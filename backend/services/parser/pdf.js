const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");
const downloadFile = require("../downloadFile");

// Accepts either a remote URL (downloaded first) or a local file path
// (e.g. a file already written to disk by a direct upload).
async function pdfParser(source) {
  let filePath;
  try {
    if (/^https?:\/\//i.test(source)) {
      const { fileName } = await downloadFile(source);
      filePath = path.resolve(__dirname, "..", "..", "uploads", fileName);
    } else {
      filePath = source;
    }
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF");
  } finally {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

module.exports = { pdfParser };
