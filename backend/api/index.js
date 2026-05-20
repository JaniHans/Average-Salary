import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const client = new OpenAI( {
    apiKey: process.env.OPENAI_API_KEY,
})

const allowedOrigins = [
    "https://average-salary-25dl.vercel.app",
    "http://localhost:3000",
    process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(cors({
    origin : allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


app.use(express.json())

app.get('/api', (req, res) => {
    console.log("Someone is making a request to the server "  + req.url)
    res.json({ message : "Hello from the server"})
})

const openAiAnalysisHandler = async (req, res) => {
    console.log("Someone is making a request to the server "  + req.url)


    console.log(req.body)

    try {
        const industryName = req.body.name;
        const salary = req.body.salaries;
        const salaryChangePercentage = req.body.increase;

        const response = await client.responses.create({

            model: "gpt-4.1-mini",
            input: "In a very short overview, 300-500 characters in total - explain the wage trend from 2021 to 2025 and forecast for the Year 2026, whether it might be rising or falling. You should use three components and headers." +
                "100% always follow the headings in CAPS that are below in the exact character as below written" +
                "OVERVIEW" +
                "FORECAST" +
                "ANALYSIS" +"- for example how to acquire a rise, skills and knowledge that is required" +
                `Industry Name : ${industryName}` +
                `Year 2021: ${salary[0]} euros, ` +
                `Year 2022: ${salary[1]} euros ${salaryChangePercentage[1]} compared to previous year, ` +
                `Year 2023: ${salary[2]} , rose ${salaryChangePercentage[2]} compared to previous year and ` +
                `Year 2024: ${salary[3]} euros ${salaryChangePercentage[3]} compared to previous year` +
                `Year 2025: ${salary[4]} euros ${salaryChangePercentage[4]} compared to previous year`
        })
        console.log(response.output_text)

        res.json({ data : response.output_text})
    } catch (e) {
        console.error(e);
        res.status(500).json({ error : "OpenAI request failed"})
    }



}

app.post(['/openai', '/api/openai', '/api'], openAiAnalysisHandler)

export default app;
