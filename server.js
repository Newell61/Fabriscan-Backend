import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import authRoutes from './routes/auth.js';
import binRoutes from './routes/bins.js';
import depositRoutes from './routes/depositroute.js';
import collectionRoutes from './routes/collections.js';
import inventoryRoutes from './routes/inventory.js';
import distributionRoutes from './routes/distributions.js';
import orgRoutes from './routes/orgs.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/organisations', orgRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'FabriScan API is running' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});