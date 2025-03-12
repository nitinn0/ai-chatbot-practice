const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");


dotenv.config();
console.log("API Key:", process.env.GEMINI_API_KEY);


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.post("/chat", async(req, res) => {
    try {
        const {message} = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch(error){
        console.error(error);
        res.status(500).json({error: "Something went wrong!"});
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});