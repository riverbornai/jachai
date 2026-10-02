const fs = require("fs");
const path = require("path");

// Downloads a file from any publicly reachable URL into the local /uploads
// directory so the parser services can read it off disk. This used to be
// wired directly to Firebase Storage via the Firebase Admin SDK — the core
// engine no longer depends on a specific storage/auth vendor, so any product
// built on top of it can host uploaded files wherever it wants (S3, Firebase
// Storage, a plain static host, etc.) as long as it hands this a fetchable URL.
async function downloadFile(url) {
  const uploadsDir = path.resolve(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const basename = decodeURIComponent(path.basename(new URL(url).pathname)) || `${Date.now()}`;
  const filePath = path.resolve(uploadsDir, basename);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    return { filePath, fileName: basename };
  } catch (error) {
    console.error("Error downloading File:", error);
    throw new Error("Failed to download File");
  }
}

module.exports = downloadFile;
