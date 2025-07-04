const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const app = express();
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/summarize-notes', async (req, res) => {
  const notes = req.body.notes;

  const prompt = `Summarize the following doctor visit notes into patient-friendly language, highlighting diagnosis, medication, and next steps:

"${notes}"`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ summary: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3003, () => console.log('Note Summarizer API running on port 3003'));
