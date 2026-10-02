const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function imageParser(urls) {
  console.log(urls, "this is urls");
  const images = await getImageObjects(urls);
  console.log(images, "this is images");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the text from the images.Just give the extracted text.Don't include any other text like:Here’s the extracted text from the image:",
          },
          ...images,
        ],
      },
    ],
  });
  return response.choices[0].message.content;
}
module.exports = { imageParser };

async function getImageObjects(urls) {
  const images = urls.map(async (url) => {
    return {
      type: "image_url",
      image_url: {
        url: url,
      },
    };
  });

  const resolvedImages = await Promise.all(images); // This will wait for all promises to resolve
  return resolvedImages;
}
