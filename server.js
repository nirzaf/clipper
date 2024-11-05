require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Clip Schema
const clipSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Clip = mongoose.model('Clip', clipSchema);

// API Routes

// GET - Retrieve all clips
app.get('/api/clips', async (req, res) => {
    try {
        const clips = await Clip.find({})
            .select('-__v')
            .sort({ createdAt: -1 });
        res.json(clips);
    } catch (error) {
        console.error('Error fetching clips:', error);
        res.status(500).json({ error: 'Failed to fetch clips' });
    }
});

// GET - Get clip count
app.get('/api/clips/count', async (req, res) => {
    try {
        const count = await Clip.countDocuments({});
        res.json({ count });
    } catch (error) {
        console.error('Error counting clips:', error);
        res.status(500).json({ error: 'Failed to count clips' });
    }
});

// POST - Create new clip
app.post('/api/clips', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required and must be a string' });
        }

        const newClip = new Clip({ text });
        const savedClip = await newClip.save();
        
        res.status(201).json(savedClip);
    } catch (error) {
        console.error('Error creating clip:', error);
        res.status(500).json({ error: 'Failed to create clip' });
    }
});

// PUT - Update clip
app.put('/api/clips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required and must be a string' });
        }

        const updatedClip = await Clip.findByIdAndUpdate(
            id,
            { text },
            { new: true, runValidators: true }
        );

        if (!updatedClip) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        res.json(updatedClip);
    } catch (error) {
        console.error('Error updating clip:', error);
        res.status(500).json({ error: 'Failed to update clip' });
    }
});

// DELETE - Delete single clip
app.delete('/api/clips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClip = await Clip.findByIdAndDelete(id);

        if (!deletedClip) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        res.json({ message: 'Clip deleted successfully' });
    } catch (error) {
        console.error('Error deleting clip:', error);
        res.status(500).json({ error: 'Failed to delete clip' });
    }
});

// DELETE - Delete all clips
app.delete('/api/clips', async (req, res) => {
    try {
        await Clip.deleteMany({});
        res.json({ message: 'All clips deleted successfully' });
    } catch (error) {
        console.error('Error deleting all clips:', error);
        res.status(500).json({ error: 'Failed to delete all clips' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
