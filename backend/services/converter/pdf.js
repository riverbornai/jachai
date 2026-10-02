const puppeteer = require("puppeteer-core");

function generateHtml(jsonData, includeAnswers, isResult, isCompleted) {
  const title = `<h1>${jsonData.title}</h1>`;

  let userInfoHTML = "";
  if (isResult) {
    const { name, roll, department, session } = jsonData.participant;
    const { finalScore, subScore, negativeScore, timeTaken, updatedAt } =
      jsonData;
    const submissionTime = updatedAt;
    const formattedSubmissionTime = new Date(submissionTime).toLocaleString(
      "en-BD",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );
    userInfoHTML = `
      <table class="info-table">
        <tr>
          <th>Name</th>
          <th>Roll</th>
          <th>Department</th>
          <th>Session</th>
        </tr>
        <tr>
          <td>${name || "N/A"}</td>
          <td>${roll || "N/A"}</td>
          <td>${department || "N/A"}</td>
          <td>${session || "N/A"}</td>
        </tr>
      </table>
      <div class="scores">
        <div class="score-row">
          <div class="score-item"><span class="score-label">Sub Score:</span> <span class="score-value">${
            subScore || "N/A"
          }</span></div>
          <div class="score-item"><span class="score-label">Negative Score:</span> <span class="score-value">${
            negativeScore || "0"
          }</span></div>
          <div class="score-item"><span class="score-label">Final Score:</span> <span class="score-value">${
            finalScore || "N/A"
          }</span></div>
        </div>
        <div class="score-row">
          <div class="score-item"><span class="score-label">Time Taken:</span> <span class="score-value">${
            timeTaken
              ? `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`
              : "N/A"
          }</span></div>
          <div class="score-item"><span class="score-label">Submission Time:</span> <span class="score-value">${
            formattedSubmissionTime || "N/A"
          }</span></div>
          <div class="score-item"></div>
        </div>
      </div>`;
  }

  const questionsHtml = jsonData.questions
    .map((q, i) => {
      return `
      <div class="question">
        <p class="question-text"><strong>Q${i + 1}.</strong> ${q.question}</p>
        <div class="options">
          ${q.options
            .map(
              (opt, j) => `
            <div class="option ${
              q.answers.includes(opt)
                ? isCompleted && q.selectedOptions.includes(opt)
                  ? "correct-user-answer"
                  : "correct-answer"
                : isCompleted && q.selectedOptions.includes(opt)
                ? "incorrect-user-answer"
                : ""
            }">
              <span class="opt-letter ${
                q.answers.includes(opt)
                  ? isCompleted && q.selectedOptions.includes(opt)
                    ? "correct-user-letter"
                    : "correct-letter"
                  : isCompleted && q.selectedOptions.includes(opt)
                  ? "incorrect-user-letter"
                  : ""
              }">${String.fromCharCode(65 + j)}</span>${opt}
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");

  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif; 
          font-size: 12px;
          line-height: 1.5; 
          margin: 0; 
          padding: 20px; 
          color: #333; 
        }
        .option.correct-answer {
          background-color: #90EE90; /* Light green */
        }
        .option.correct-user-answer {
          background-color: #006400; /* Dark green */
          color: white;
        }
        .option.incorrect-user-answer {
          background-color: #FF0000; /* Red */
          color: white;
        }
        .opt-letter {
          padding: 2px 6px;
          margin-right: 8px;
          font-weight: bold;
          border-radius: 3px;
          background: #3498db; /* Default blue */
          color: white;
        }
        .opt-letter.correct-letter {
          background-color: #90EE90; /* Light green */
          color: black;
        }
        .opt-letter.correct-user-letter {
          background-color: #006400; /* Dark green */
        }
        .opt-letter.incorrect-user-letter {
          background-color: #FF0000; /* Red */
        }
        .scores {
          display: flex;
          flex-direction: column;
          font-weight: bold;
        }
        .score-row {
          display: flex;
          justify-content: space-between;
        }
        .score-item {
          flex: 1;
          margin: 5px;
        }
        h1 { 
          font-size: 20px; 
          margin: 0 0 20px 0; 
          color: #2c3e50; 
        }
        .info-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 15px; 
        }
        .info-table th {
          background-color: #f2f2f2; 
          font-weight: bold;
          text-align: left;
        }
        .info-table th, .info-table td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          font-size: 12px; 
        }
        .scores { 
          display: flex; 
          flex-direction: column;
          justify-content: space-between; 
          margin-bottom: 15px; 
          padding: 8px; 
          background-color: #f9f9f9; 
          border-radius: 5px; 
        }

        .score-row {
          display: flex;
          justify-content: space-between;
        }

        .score-item { 
          flex: 1;
          margin: 2px 5px;
          font-size: 11px;
        }

        .score-label { 
          font-weight: bold; 
          color: #555; 
        }

        .score-value { 
          color: #2980b9; 
        }
        .question { 
          margin-bottom: 25px; 
          border: 1px solid #e0e0e0; 
          padding: 15px; 
          border-radius: 5px; 
        }
        .question-text { 
          margin-top: 0; 
          margin-bottom: 10px; 
          font-size: 14px; 
        }
        .options { 
          columns: 2; 
          margin: 10px 0; 
        }
        .option { 
          margin-bottom: 5px; 
          padding: 5px;
          border-radius: 3px;
        }
        @media print { 
          .question { page-break-inside: avoid; } 
        }
      </style>
    </head>
    <body>
      ${title}
      ${userInfoHTML}
      ${questionsHtml}
    </body>
    </html>`;
}

// Function to convert JSON data to a PDF using Puppeteer
async function convertJsonToPdf(
  jsonData,
  outputPath,
  includeAnswers,
  isResult,
  isCompleted
) {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: true, // Make sure headless mode is on (it is by default)
    executablePath: getChromeExecutablePath(),
    args: [
      "--no-sandbox", // Required when running in Docker/Cloud environments
      "--disable-setuid-sandbox", // Disables seccomp, also needed in Cloud environments
    ],
  });

  // Open a new page
  const page = await browser.newPage();

  // Generate the HTML content from the question data
  const htmlContent = generateHtml(
    jsonData,
    includeAnswers,
    isResult,
    isCompleted
  );

  // Set the HTML content for the page
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Generate the PDF with margin options for printability
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "50px",
      bottom: "50px",
      left: "20px",
      right: "20px",
    },
  });

  console.log(`PDF generated successfully: ${outputPath}`);

  // Close the browser instance
  await browser.close();
}

// Helper function to determine Chrome path according to the OS
function getChromeExecutablePath() {
  // Detect the platform
  const platform = process.platform;

  // Mac
  if (platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  // Linux
  if (platform === "linux") {
    return "/usr/bin/chromium"; // Or '/usr/bin/chromium-browser' if you're using Chromium
  }

  // Windows
  if (platform === "win32") {
    return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  }

  throw new Error("Unsupported platform: " + platform);
}
module.exports = { convertJsonToPdf };
