const router = require("express").Router();
const root = require("app-root-path");

const { createQuiz } = require(`${root}/services/openai`);
const { populateId } = require(`${root}/services/utilities`);

const prisma = require(`${root}/services/prisma/client`);

setQuiz = async (req, res, next) => {
    try {
        const { type, difficulty, questionNumber, optionsCount, text } = req.body;

        const { questions, title } = await createQuiz({ type, difficulty, questionNumber, optionsCount, text });
        const response = await prisma.quiz.create({
            data: {
                uid: populateId(),
                title,
                ...req.body,
                questions,
                createdAt: Date.now(),
                updatedAt: Date.now()
            },
        });

        res.status(200).json({ success: true, response });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        await prisma.$disconnect();
    }
};
getQuizes = async (req, res, next) => {
    const { userId, limit, pageNumber, sorting } = req.query;
    try {
        const skip = Number(pageNumber) > 0 ? (Number(pageNumber) - 1) * Number(limit) : 0
        const orderBy = sorting === "newest" ? [{ createdAt: "desc" }] : [{ createdAt: "asc" }];
        let response = await prisma.quiz.findMany({
            where: {
                userId,
                isDeleted: false
            },
            orderBy: orderBy,
            skip: skip || 0,
            take: Number(limit) || 10,
        });
        const total = await prisma.quiz.count({
            where: {
                userId,
                isDeleted: false
            }
        })
        res.status(200).json({ success: !!response, response: response, total });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
}
getQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const response = await prisma.quiz.findUnique({
            where: {
                uid: quizId,
                isDeleted: false
            }
        });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
}
// Every quiz in this engine is public/shareable — this returns a quiz for
// someone taking it, with answers stripped so they can't be read off the
// network response.
getQuizForTaking = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const response = await prisma.quiz.findUnique({
            where: {
                uid: quizId,
                isDeleted: false
            }
        });
        if (!response) return res.status(200).json({ success: false, error: "Quiz not found" });
        response.questions = response.questions.map(q => {
            const { answers, ...rest } = q;
            return rest;
        });
        res.status(200).json({ success: true, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
}
updateQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const response = await prisma.quiz.update({
            where: {
                uid: quizId
            },
            data: {
                ...req.body,
                updatedAt: Date.now()
            }
        });
        res.status(200).json({ success: !!response, response });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect()
    }
}
deleteQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const response = await prisma.quiz.update({
            where: {
                uid: quizId
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
}

router.post("/quiz", setQuiz);
router.get("/quiz", getQuizes);
router.get("/quiz/:quizId", getQuiz);
router.get("/test/:quizId", getQuizForTaking);
router.put("/quiz/:quizId", updateQuiz);
router.delete("/quiz/:quizId", deleteQuiz);

module.exports = router;

// NOTE: this is the bare core engine — no auth/authorization is wired in here.
// Consuming products (dashboards, admin panels, etc.) should add their own
// auth middleware in front of the mutating routes (PUT/DELETE) as needed.