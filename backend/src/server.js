import express from 'express';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectsRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import connectDB from './config/db.js';
import servicesRoutes from './routes/servicesRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import cors from 'cors';

dotenv.config();



const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// routes
app.use('/api/projects', projectRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/contact', contactRoutes);

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})