if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const express = require("express");
const cors = require("cors");
const http = require("http");
const { sendErrorToSlack } = require("./services/slackNotification");

const app = express();
global.app = app;

app.use(express.json({ limit: "50mb" }));

app.set("trust proxy", true);

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request Origin: ", origin);
      if (!origin) return callback(null, true);
      if (process.env.ALLOWED_ORIGINS && !allowedOrigins.includes(origin)) {
        const msg = `The CORS policy for ${origin} does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use("/api", require("./api/status"));
app.use("/api", require("./api/quiz"));
app.use("/api", require("./api/results"));
app.use("/api", require("./api/parser"));
app.use("/api", require("./api/download"));
app.use("/api", require("./api/participants"));

// Update the global error handling middleware
app.use(async (err, req, res, next) => {
  // Log error stack
  console.error(err.stack);
  // Optional error reporting: only runs when ERROR_WEBHOOK_URL is set.
  sendErrorToSlack(err.stack || err.message, "jachai");
  // Render the error response
  res.status(err.status || 500).json({ success: false, message: err.message || err });
});

const port = process.env.PORT || 3001;

// Listen with the server object instead of the app object
app.listen(port, async () => {
  console.log("Server started at port : ", port);
});
