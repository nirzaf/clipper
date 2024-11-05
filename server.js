const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;

// Create MongoDB client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Database and Collection names
const DB_NAME = 'clipper';
const COLLECTION_NAME = 'clips';

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// API Routes

// GET - Retrieve all clips
app.get('/api/clips', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const clips = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ _id: -1 })
            .toArray();
        res.json(clips);
    } catch (error) {
        console.error('Error fetching clips:', error);
        res.status(500).json({ error: 'Failed to fetch clips' });
    }
});

// GET - Get clip count
app.get('/api/clips/count', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const count = await db.collection(COLLECTION_NAME).countDocuments({});
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

        const db = client.db(DB_NAME);
        const result = await db.collection(COLLECTION_NAME).insertOne({ text });
        
        const insertedClip = await db.collection(COLLECTION_NAME)
            .findOne({ _id: result.insertedId });
        
        res.status(201).json(insertedClip);
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

        const db = client.db(DB_NAME);
        const result = await db.collection(COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { text } },
                { returnDocument: 'after' }
            );

        if (!result.value) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        res.json(result.value);
    } catch (error) {
        console.error('Error updating clip:', error);
        res.status(500).json({ error: 'Failed to update clip' });
    }
});

// DELETE - Delete single clip
app.delete('/api/clips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = client.db(DB_NAME);
        const result = await db.collection(COLLECTION_NAME)
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        res.json({ message: 'Clip deleted successfully' });
    } catch (error) {
        console.error('Error deleting clip:', error);
        res.status(500).json({ error: 'Failed to delete clip' });
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await client.db("admin").command({ ping: 1 });
        res.json({ status: 'healthy', mongodb: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', mongodb: 'disconnected' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize server
async function startServer() {
    await connectToMongo();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start the server
startServer().catch(console.dir);
