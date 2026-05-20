import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}, powered by inward`)
    console.log(`Server running on  http://localhost:${PORT}/api`)
});