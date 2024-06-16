const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3001;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const upload = multer({ dest: 'uploads/' });

async function uploadToGemini(filePath, mimeType) {
  const uploadResult = await fileManager.uploadFile(fs.readFileSync(filePath), {
    mimeType,
    displayName: path.basename(filePath),
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const file = await uploadToGemini(filePath, req.file.mimetype);
  
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: file.mimeType,
              fileUri: file.uri,
            },
          },
          { text: "What is happening in this image?" }, // Adjust prompt as needed
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("Analyze the image.");
  res.json({ response: result.response.text() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
