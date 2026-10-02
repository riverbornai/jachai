const router = require("express").Router();
const root = require("app-root-path");

const { populateId } = require(`${root}/services/utilities`);

const prisma = require(`${root}/services/prisma/client`);

setResult = async (req, res, next) => {
    const { quizId, participantId } = req.body;

    try {
        // 1. Check if result already exists
        const existingResult = await prisma.result.findFirst({
            where: { quizId, participantId }
        });
        if (existingResult) {
            return sendErrorStatus(res, "You have already participated in this quiz.");
        }

        // 2. Validate quiz and participant
        const quiz = await prisma.quiz.findUnique({
            where: { uid: quizId }
        });
        if (!quiz) return sendErrorStatus(res, "Quiz not found");

        const participant = await prisma.participant.findUnique({
            where: { uid: participantId }
        });
        if (!participant) return sendErrorStatus(res, "Participant not found");

        // 3. Prepare the result payload
        const payload = prepareResultPayload(quiz, participant, participantId);

        // 4. Create result
        const result = await prisma.result.create({ data: payload });

        // 5. Cleanup questions (remove answers before sending response)
        result.questions = cleanupQuestionsForResponse(result.questions);

        return res.status(200).json({ success: true, response: result });

    } catch (error) {
        next(error); // Pass error to middleware
    } finally {
        await prisma.$disconnect();
    }
};

getUserResults = async (req, res, next) => {
    const { limit, pageNumber, sorting } = req.query;
    try {
        const response = await fetchResults({ userId: req.params.userId, limit, pageNumber, sorting });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
};

getQuizResults = async (req, res, next) => {
    const { limit, pageNumber, sorting } = req.query;
    try {
        const response = await fetchResults({ userId: req.params.userId, quizId: req.params.quizId, limit, pageNumber, sorting });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
};

getResult = async (req, res, next) => {
    const { resultId } = req.params;
    try {
        const response = await prisma.result.findUnique({
            where: {
                uid: resultId,
                isDeleted: false
            }
        });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
};

const updateResult = async (req, res, next) => {
    const { resultId } = req.params;
    try {
        // Fetch the result by resultId
        const result = await prisma.result.findUnique({
            where: {
                uid: resultId,
                isDeleted: false
            }
        });
        // Handle if the result does not exist or is already completed
        if (!result) return sendErrorStatus(res, "Result not found");
        if (result.isCompleted) return sendErrorStatus(res, "Result already completed");
        // Extract time and createdAt from the result
        const { time, createdAt, quizId } = result;
        const timeDifferenceMinutes = (Date.now() - createdAt) / (1000 * 60);
        if (timeDifferenceMinutes > Number(time) + 3) return sendErrorStatus(res, "Time limit exceeded");
        const updatedQuestions = await handleQuestionsAnswers(result.questions, req.body.questions);
        const { subScore, finalScore, negativeScore } = await calculateCorrectAnswers(updatedQuestions, result);
        // Prepare the data to update
        const updatedData = {
            timeTaken: req.body.timeTaken,
            finalScore,
            subScore,
            negativeScore,
            questions: updatedQuestions,
            isCompleted: true,
            updatedAt: Date.now()
        };
        // Update the result with new data
        const response = await prisma.result.update({
            where: { uid: resultId },
            data: updatedData,
        });
        // Fetch quiz data if necessary (if resultType is "immediately")
        let quiz = null;
        if (response && response.isCompleted) {
            quiz = await prisma.quiz.findUnique({
                where: { uid: quizId }
            });
        }

        // Prepare response object
        const responseObject = {
            success: !!response,
            ...(quiz && quiz.resultType === "immediately" && { response })
        };

        // Send response back to client
        res.status(200).json(responseObject);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect(); // Ensure Prisma disconnection
    }
};



deleteResult = async (req, res, next) => {
    const { resultId } = req.params;
    try {
        const response = await prisma.result.update({
            where: {
                uid: resultId
            },
            data: {
                isDeleted: true
            }
        });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
};

router.post("/submit-result", setResult);
router.get("/results/user/:userId", getUserResults);
router.get("/results/quiz/:userId/:quizId", getQuizResults);
router.get("/results/:resultId", getResult);
router.put("/results/:resultId", updateResult);
router.delete("/results/:resultId", deleteResult);


module.exports = router;

// Helper functions

// Prepare the result payload
const prepareResultPayload = (quiz, participant) => {
    const questions = quiz.questions.map((question) => ({
        ...question,
        selectedOptions: []
    }));

    return {
        uid: populateId(),
        title: quiz.title,
        time: quiz.time,
        questions,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        participant,
        quizId: quiz.uid,
        totalMarks: quiz.perQuesMarks * questions.length,
        perQuesMarks: quiz.perQuesMarks,
        userId: quiz.userId,
        isCompleted: false,
        participantId: participant.uid,
        negativeMark: quiz.negativeMark || 0,
    };
};

// Cleanup questions to remove answers before sending the response
const cleanupQuestionsForResponse = (questions) => {
    return questions.map((question) => {
        delete question.answers;
        return question;
    });
};

async function handleQuestionsAnswers(answerArray, questions) {
    // Normalize the answer array into a map for quick access
    const answerMap = answerArray.reduce((acc, item) => {
        acc[item.id] = item.answers;
        return acc;
    }, {});
    // Update the original questions array with answers
    const updatedQuestions = questions.map(question => {
        if (answerMap[question.id]) { // check if there's an answer for the question
            return {
                ...question,
                answers: answerMap[question.id] // update or add the 'answers' field
            };
        }
        return question; // if no answer is found, return the question as is
    });

    return updatedQuestions;
}

async function calculateCorrectAnswers(questions, result) {
    let score = 0;
    let negativeScore = 0;
    const mark = result.perQuesMarks || 1;
    const negativeMark = result.negativeMark || 0;
    questions.forEach(question => {
        // Sort both the answers and selectedOptions for a reliable comparison
        let sortedAnswers = question.answers.sort();
        let sortedSelectedOptions = question.selectedOptions.sort();
        if (sortedSelectedOptions.length === 0) {
            // No answer given, do nothing
            return;
        };
        // Check if sorted arrays are equal
        if (arraysEqual(sortedAnswers, sortedSelectedOptions)) {
            score += mark;  // Correct answer, add mark
        } else {
            negativeScore += negativeMark;  // Incorrect answer, add negative mark
        }
    });
    return { finalScore: score, subScore: score - negativeScore, negativeScore };
}

// Helper function to check if two arrays are equal in length and content
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};


async function fetchResults({ userId, quizId, limit, pageNumber, sorting }) {
    const orderBy = sorting === "newest" ? [{ createdAt: "desc" }] : [{ createdAt: "asc" }];
    const query = quizId ? { userId, quizId, isDeleted: false } : { userId, isDeleted: false };
    const response = await prisma.result.findMany({
        where: query,
        orderBy: orderBy,
        skip: Number(pageNumber) > 0 ? (Number(pageNumber) - 1) * Number(limit) : 0,
        take: Number(limit) || 10,
    });
    const total = await prisma.result.count({
        where: query
    })
    return { response, total };

};
sendErrorStatus = async (res, error) => {
    res.status(200).json({ success: false, error });
    await prisma.$disconnect();
}