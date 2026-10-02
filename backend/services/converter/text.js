const fs = require("fs");

function addTitle(title) {
  return `${title}\n\n`;
}


function addQuestion(questionData, index, includeAnswers) {
  if (!questionData || !Array.isArray(questionData.options)) {
    console.error(`Invalid question data at index ${index}:`, questionData);
    return ""; // Return empty string for invalid questions
  }

  let content = `${index + 1}. ${questionData.question}\n`;

  // Add options (e.g., a), b), c), d)...)
  questionData.options.forEach((option, optionIndex) => {
    content += `  ${String.fromCharCode(97 + optionIndex)}) ${option}\n`;
  });

  if (includeAnswers && questionData.answers) {
    content += `Correct Answer: ${questionData.answers.join(", ")}\n\n`;
  } else {
    content += "\n";
  }

  return content;
}

function convertJsonToText(jsonData, outputPath, includeAnswers) {
  try {

    let title = jsonData.title || "Quiz";
    let content = addTitle(`${title} Questions`);

    const questions = jsonData.questions || [];
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions found.");
    }

    questions.forEach((questionData, index) => {
      content += addQuestion(questionData, index, includeAnswers);
    });

    fs.writeFileSync(outputPath, content, "utf8");
    console.log("File written successfully:", outputPath);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}

module.exports = { convertJsonToText };
