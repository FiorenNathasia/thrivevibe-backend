const axios = require("axios");
const openAiKey = process.env.OPEN_AI_KEY;

//OpenAi Function
async function chatgpt(commentsText, upvote, downvote) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAiKey}`,
  };
  const prompt = `
  You are a video analysis assistant.
  
  Here are some viewer comments and the number of upvotes and downvotes the video received:
  
  Comments:
  ${commentsText}
  
  Upvotes: ${upvote}
  Downvotes: ${downvote}
  
  Based on this, write a short paragraph (1-3 sentences) summarizing how viewers received the video. Reflect the tone of the comments and what the voting trend suggests about the general audience response.
  
  Do not include the actual vote numbers. Do not return JSON or markdown. Just return plain text.
    `;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
    },
    { headers }
  );
  const content = response.data.choices[0].message.content;
  return content;
}

module.exports = chatgpt;
