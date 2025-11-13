
const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.get('/api', (req, res) => {
    res.json({ message : "Hello from the server"})
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}, powered by inward`)
    console.log(`Server running on  http://localhost:${PORT}/api`)
});

