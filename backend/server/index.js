
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');

app.get('/api', cors(), (req, res) => {
    console.log("Someone is making a request to the server "  + req.url)
    res.json({ message : "Hello from the server"})
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}, powered by inward`)
    console.log(`Server running on  http://localhost:${PORT}/api`)
});

