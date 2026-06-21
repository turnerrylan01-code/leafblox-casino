import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import chatRoutes from './routes/chat';
import banRoutes from './routes/bans';
import promoRoutes from './routes/promotions';
import gameRoutes from './routes/games';
import supportRoutes from './routes/support';
import staffRoutes from './routes/staff';
import levelRoutes from './routes/levels';
import settingsRoutes from './routes/settings';
import auditRoutes from './routes/audit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bans', banRoutes);
app.use('/api/promotions', promoRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Leaf Blox API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
