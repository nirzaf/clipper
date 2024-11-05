const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Clipper API',
            version: '1.0.0',
            description: 'API documentation for Clipper application',
        },
        servers: [
            {
                url: `https://clipper-2gxs.onrender.com`,
            },
        ],
    },
    apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Clip:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         text:
 *           type: string
 *           description: The content of the clip
 */

/**
 * @swagger
 * /api/clips:
 *   get:
 *     summary: Retrieve all clips
 *     description: Get all clips sorted by creation date in descending order
 *     responses:
 *       200:
 *         description: A list of clips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clip'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/clips/count:
 *   get:
 *     summary: Get total number of clips
 *     description: Returns the total count of clips in the database
 *     responses:
 *       200:
 *         description: Total count of clips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of clips
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/clips:
 *   post:
 *     summary: Create a new clip
 *     description: Add a new clip to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clip'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/clips/{id}:
 *   put:
 *     summary: Update a clip
 *     description: Update an existing clip by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the clip
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clip updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clip'
 *       404:
 *         description: Clip not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/clips/{id}:
 *   delete:
 *     summary: Delete a clip
 *     description: Delete a clip by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the clip
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clip deleted successfully
 *       404:
 *         description: Clip not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the server and MongoDB connection are healthy
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 mongodb:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: System is unhealthy
 */
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
