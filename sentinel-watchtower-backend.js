// Project Sentinel Watchtower Backend (Phase 1)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

let threatLogs = [];

app.post('/report', (req, res) => {
    const { location, description, reporter, mediaLink, category } = req.body;
    if (!location || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = {
        id: threatLogs.length + 1,
        timestamp: new Date(),
        location,
        description,
        reporter: reporter || 'Anonymous',
        mediaLink: mediaLink || null,
        category: category || 'general',
    };

    threatLogs.push(report);
    console.log('New report received:', report);
    res.status(200).json({ message: 'Report logged successfully', report });
});

app.get('/threats', (req, res) => {
    res.json(threatLogs);
});

app.get('/threats/search', (req, res) => {
    const { location, category } = req.query;
    let filtered = [...threatLogs];
    if (location) filtered = filtered.filter(t => t.location.toLowerCase().includes(location.toLowerCase()));
    if (category) filtered = filtered.filter(t => t.category === category);
    res.json(filtered);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🛡️ Sentinel Watchtower backend is active on port ${PORT}`);
});
