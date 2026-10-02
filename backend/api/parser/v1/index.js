const router = require("express").Router();
const root = require("app-root-path");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { imageParser } = require(`${root}/services/parser/image`);
const { pdfParser } = require(`${root}/services/parser/pdf`);
const { textFileParser } = require(`${root}/services/parser/textFile`);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Legacy/URL-based flow: give it a fetchable URL and it parses it.
parser = async (req, res, next) => {
    try {
        const { type, url } = req.body;
        let result;
        if (type === "image") {
            result = await imageParser([url]);
        } else if (type === "pdf") {
            result = await pdfParser(url);
        } else if (type === "text") {
            result = await textFileParser(url);
        }
        return res.status(200).json({ success: !!result, response: result });
    } catch (error) {
        next(error);
    }
}

// Direct upload flow: no external storage vendor required — the file is
// sent straight to this server as multipart/form-data and parsed in place.
uploadAndParse = async (req, res, next) => {
    let filePath;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const { type } = req.body;
        let result;

        if (type === "image") {
            const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            result = await imageParser([dataUri]);
        } else {
            const uploadsDir = path.resolve(`${root}`, "uploads");
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${req.file.originalname}`;
            filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, req.file.buffer);

            if (type === "pdf") {
                result = await pdfParser(filePath);
            } else {
                result = await textFileParser(filePath);
            }
            filePath = null; // the parsers clean up the file themselves
        }

        return res.status(200).json({ success: !!result, response: result });
    } catch (error) {
        next(error);
    } finally {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

router.post("/parser", parser);
router.post("/parser/upload", upload.single("file"), uploadAndParse);
module.exports = router;
