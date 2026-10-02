const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const root = require("app-root-path");
const prisma = require(`${root}/services/prisma/client`);
const { convertJsonToPdf } = require(`${root}/services/converter/pdf`);
const { convertJsonToText } = require(`${root}/services/converter/text`);
const { convertJsonToXlsx } = require(`${root}/services/converter/xlsx`);

const convertAndDownloadPdf = async (req, res) => {
  const { quizId, isIncludeAnswer = false } = req.body;

  try {
    const question = await prisma.quiz.findUnique({
      where: {
        uid: quizId,
        isDeleted: false,
      },
    });
    if (!question) throw new Error("Question not found");
    const outputPath = generateOutputPath(
      Math.random().toString(36).substring(2),
      "pdf"
    );
    await convertJsonToPdf(question, outputPath, isIncludeAnswer);

    res.download(outputPath, async (err) => {
      if (err) {
        return handleDownloadError(res, err, "PDF");
      }
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const generateOutputPath = (prefix, extension) => {
  return `${root}/${prefix} Questions.${extension}`;
};

const convertAndDownloadXlsx = async (req, res) => {
  const quizId = req.params.quizId;
  const outputPath = generateOutputPath(
    Math.random().toString(36).substring(2),
    "xlsx"
  );

  try {
    const results = await prisma.result.findMany({
      where: {
        quizId: quizId,
        isDeleted: false, // Assuming you have this field
      },
      select: {
        uid: true,
        participant: true,
        finalScore: true,
        subScore: true,
        negativeScore: true,
        timeTaken: true,
        quiz: {
          select: {
            title: true,
          },
        },
      },
    });

    if (results.length === 0) throw new Error("No results found for this quiz");

    // Prepare the data for the XLSX converter
    const formattedData = {
      title: results[0].quiz.title,
      participants: results.map((result) => ({
        name: result.participant.name,
        roll: result.participant.roll || "N/A",
        identifier: result.participant.identifier,
        department: result.participant.department,
        subScore: result.subScore,
        negativeScore: result.negativeScore,
        finalScore: result.finalScore,
        session: result.participant.session,
        timeTaken: `${Math.floor(result.timeTaken / 60)}m ${
          result.timeTaken % 60
        }s`,
      })),
    };

    await convertJsonToXlsx(formattedData, outputPath);

    res.download(outputPath, async (err) => {
      if (err) {
        return handleDownloadError(res, err, "XLSX");
      }
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
    });
  } catch (error) {
    console.error("Error generating XLSX:", error);
    if (!res.headersSent) {
      res.status(500).send("Error generating XLSX file");
    }
  }
};

const handleDownloadError = (res, err, fileType) => {
  console.error(`Error sending ${fileType}:`, err);
  return res
    .status(500)
    .json({ success: false, message: `Error sending ${fileType}` });
};

const convertAndDownloadText = async (req, res) => {
  try {
    const { quizId, isIncludeAnswer = false } = req.body;

    const question = await prisma.quiz.findUnique({
      where: {
        uid: quizId,
        isDeleted: false,
      },
    });
    if (!question) throw new Error("Question not found");
    const outputPath = generateOutputPath(
      Math.random().toString(36).substring(2),
      "txt"
    );

    // Ensure 'uploads' directory exists
    const uploadsDir = `${root}/uploads`;
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    convertJsonToText(question, outputPath, isIncludeAnswer);

    res.download(outputPath, async (err) => {
      if (err) {
        return handleDownloadError(res, err, "txt");
      }
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("Error generating text file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error generating text file" });
  }
};
const downloadQuizWithResult = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = await prisma.result.findUnique({
      where: {
        uid: resultId,
      },
    });
    let payload = result;
    if (!result) throw new Error("Result not found");
    const outputPath = generateOutputPath(
      Math.random().toString(36).substring(2),
      "pdf"
    );
    await convertJsonToPdf(result, outputPath, true, true, result.isCompleted);
    res.download(outputPath, async (err) => {
      if (err) {
        return handleDownloadError(res, err, "PDF");
      }
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    next(error);
  }
};
router.post("/download/pdf", convertAndDownloadPdf);
router.post("/download/text", convertAndDownloadText);
router.get("/download/result/:resultId", downloadQuizWithResult);
router.get("/generate-xlsx/:quizId", convertAndDownloadXlsx);

module.exports = router;
