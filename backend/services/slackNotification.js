const axios = require("axios");

// Posts unhandled API errors to an optional webhook (for example a Slack
// relay you run yourself). Does nothing unless ERROR_WEBHOOK_URL is set.
async function sendErrorToSlack(err, siteName) {
  const webhookUrl = process.env.ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await axios.post(
      webhookUrl,
      {
        message: err,
        siteName: siteName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during error-webhook reporting:", error.message);
  }
}

module.exports = {
  sendErrorToSlack,
};
