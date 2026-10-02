const ExcelJS = require("exceljs");

async function convertJsonToXlsx(data, outputPath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Quiz Results");

  sheet.mergeCells("A1:H1");
  const titleRow = sheet.getRow(1);
  titleRow.values = [`Results for Quiz: ${data.title}`];
  titleRow.font = { bold: true, size: 14 }; // Bold and larger font for title
  titleRow.alignment = { horizontal: "center" }; // Center align

  // Add headers
  const headers = [
    "Participant Name",
    "Identifier",
    "Roll",
    "Department",
    "Session",
    "Sub Score",
    "Negative Score",
    "Final Score",
    "Time Taken",
  ];
  sheet.addRow(headers);

  // Apply bold font to header row
  sheet.getRow(2).font = { bold: true };

  // Set column widths (smaller widths)
  sheet.columns = [
    { width: 20 }, // Participant Name
    { width: 25 }, //identifier
    { width: 10 }, // Roll
    { width: 20 }, // Department
    { width: 15 }, // Session
    { width: 15 }, // Sub Score
    { width: 15 }, // Negative Score
    { width: 15 }, // Final Score
    { width: 20 }, // Time Taken
  ];

  // Add participant data
  data.participants.forEach((participant) => {
    sheet.addRow([
      participant.name,
      participant.identifier,
      participant.roll,
      participant.department,
      participant.session,
      participant.subScore,
      participant.negativeScore,
      participant.finalScore,
      participant.timeTaken,
    ]);
  });

  // Write to file
  await workbook.xlsx.writeFile(outputPath);
}

module.exports = { convertJsonToXlsx };
