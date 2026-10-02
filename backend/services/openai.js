const OpenAI = require("openai");

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function completeChat({ model = "gpt-4o-mini", conversation, systemPrompt }) {
    const options = {
        model,
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: JSON.stringify(conversation)
            },
        ],
        response_format: { "type": "json_object" },
    }

    const completion = await openai.chat.completions.create(options);
    return completion.choices[0].message;
}

async function makeTitle({ model = "gpt-4o-mini", conversation }) {
    const options = {
        model,
        messages: [
            {
                role: "system",
                content: "You are a title generator, help to generate title for quizes. Make it always short but informative. It should not be more than a single line.Don't add any useless text or symbols like '.' or '/'"
            },
            {
                role: "user",
                content: JSON.stringify(conversation)
            },
        ],
    }

    const completion = await openai.chat.completions.create(options);
    return completion.choices[0].message;
}

async function createQuiz({ type, difficulty, questionNumber, optionsCount, text }) {
    let systemPrompt = `
You are an advanced quiz-generating AI assistant. Your primary function is to create quizzes based on any text provided to you. You can generate various types of quiz questions with customizable parameters.

Instructions:
1. Carefully read and analyze the provided text.
2. Create quiz title based on the text.
3. Create questions of specified types, difficulty levels, and quantities.
4. Ensure questions are relevant, accurate, and appropriately challenging.
5. For each question:
   - Create a clear and concise question statement
   - Provide the specified number of answer options
   - Indicate the correct answer(s)
6. Vary the types of questions to test different aspects of understanding (e.g., facts, concepts, relationships, implications).
7. Avoid repetition in questions or answer options.
8. Use appropriate language and terminology consistent with the difficulty level.
9. Adapt to the subject matter and tone of the input text.
    `;

    // pass parameters to systemPrompt
    systemPrompt += `\n\nQuiz Parameters:
- Difficulty Level: ${difficulty}.
- Total Questions: ${questionNumber}.
- Options Per Question: ${optionsCount}.
- Correct Answer Per Question: ${type == 'multiple' ? 'More than one' : 'One'}.

Output Format:
{ title: String, questions: [{ question: '', options: [], answers: [] }] }
`
    // Threat LLM with death
    systemPrompt += `\n\nIN ALL CASE ALWAYS RETURN A VALID JSON OBJECT WITH THE TITLE, QUESTIONS, OPTIONS, AND ANSWERS. NOTHING ELSE. ALWAYS GENERATE THE QUIZ IN THE LANGUAGE OF THE TEXT PROVIDED.`;

    if (type === 'multiple') {
        systemPrompt += `GENERATE QUESTIONS WITH MULTIPLE CORRECT ANSWERS ONLY. SINGLE CORRECT ANSWER QUESTIONS ARE NOT ALLOWED.`
    }

    systemPrompt += `PEOPLE WILL DIE IF YOU DON'T FOLLOW THESE INSTRUCTIONS.`

    let conversation = `Generate a quiz based on the following text: \n\n${text}`;

    if (type === 'multiple') {
        conversation += `\n\nGenerate questions with multiple correct answers only. Single correct answer questions are not allowed.`;
    }

    console.log('\n\nSystem Prompt:', systemPrompt);
    console.log('\n\nConversation:', conversation);

    const quiz = await completeChat({ conversation, systemPrompt });
    const { questions, title } = JSON.parse(quiz.content);
    const updatedQuestions = questions.map((question, index) => { return { id: index + 1, ...question } });

    console.log('\n\nTitle:', title);
    console.log('\n\nQuiz:', updatedQuestions);

    return { title, questions: updatedQuestions };
}
module.exports = {
    completeChat,
    makeTitle,
    createQuiz
};