const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const app = express();
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/generate-history', async (req, res) => {
  const data = req.body;

  const prompt = `Generate a formatted medical history report for the following user data:
  Allergies: ${data.allergies}
  Surgeries: ${data.surgeries}
  Family History: ${data.familyHistory}
  Medications: ${data.medications}
  Chronic Conditions: ${data.conditions}
  `;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ report: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3004, () => console.log('Medical History Generator API running on port 3004'));
