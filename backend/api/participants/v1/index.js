const router = require("express").Router();
const root = require("app-root-path");
const { populateId } = require(`${root}/services/utilities`);
const prisma = require(`${root}/services/prisma/client`);

setParticipant = async (req, res, next) => {
    try {
        req.body.uid = populateId();
        const participant = await prisma.participant.create({
            data: req.body
        });
        res.status(200).json({ success: !!participant, participant });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        await prisma.$disconnect();
    }
};

getParticipant = async (req, res, next) => {
    const { identifier, quizId } = req.params;
    try {
        const participant = await prisma.participant.findUnique({
            where: { identifier },
        });
        if (!participant) {
            return res.status(200).json({ success: false, error: "Participant not found" });
        }

        const existingResult = await prisma.result.findFirst({
            where: {
                participantId: participant.uid,
                quizId
            },
        });
        if (existingResult) {
            return res.status(200).json({ success: false, error: "You have already participated in this quiz." });
        };
        return res.status(200).json({ success: !!participant, participant });

    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect(); // this will always run
    }
};


router.get("/participants/:quizId/:identifier", getParticipant);
router.post("/participants", setParticipant);

module.exports = router;
