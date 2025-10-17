// server.js - Your Weird Music Tracker API
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory "database" - replace with MongoDB/PostgreSQL later if you want
let tracks = [
  { 
    id: 1, 
    title: "Windowlicker", 
    artist: "Aphex Twin", 
    weirdness: 9,
    genre: "IDM"
  },
  { 
    id: 2, 
    title: "Weird Fishes", 
    artist: "Radiohead", 
    weirdness: 7,
    genre: "Alternative"
  }
];

let nextId = 3;

// GET all tracks
app.get('/api/tracks', (req, res) => {
  const { minWeirdness } = req.query;
  
  if (minWeirdness) {
    const filtered = tracks.filter(t => t.weirdness >= parseInt(minWeirdness));
    return res.json(filtered);
  }
  
  res.json(tracks);
});

// GET single track
app.get('/api/tracks/:id', (req, res) => {
  const track = tracks.find(t => t.id === parseInt(req.params.id));
  
  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }
  
  res.json(track);
});

// POST new track
app.post('/api/tracks', (req, res) => {
  const { title, artist, weirdness, genre } = req.body;
  
  // Validation
  if (!title || !artist) {
    return res.status(400).json({ error: 'Title and artist are required' });
  }
  
  if (weirdness && (weirdness < 1 || weirdness > 10)) {
    return res.status(400).json({ error: 'Weirdness must be between 1-10' });
  }
  
  const newTrack = {
    id: nextId++,
    title,
    artist,
    weirdness: weirdness || 5,
    genre: genre || 'Unknown'
  };
  
  tracks.push(newTrack);
  res.status(201).json(newTrack);
});

// PUT update track
app.put('/api/tracks/:id', (req, res) => {
  const track = tracks.find(t => t.id === parseInt(req.params.id));
  
  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }
  
  const { title, artist, weirdness, genre } = req.body;
  
  if (weirdness && (weirdness < 1 || weirdness > 10)) {
    return res.status(400).json({ error: 'Weirdness must be between 1-10' });
  }
  
  track.title = title || track.title;
  track.artist = artist || track.artist;
  track.weirdness = weirdness !== undefined ? weirdness : track.weirdness;
  track.genre = genre || track.genre;
  
  res.json(track);
});

// DELETE track
app.delete('/api/tracks/:id', (req, res) => {
  const index = tracks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Track not found' });
  }
  
  tracks.splice(index, 1);
  res.status(204).send();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server (only if not being imported for tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎵 Weird Music API running on port ${PORT}`);
  });
}

module.exports = app;