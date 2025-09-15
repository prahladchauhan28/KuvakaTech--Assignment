import express from 'express';
import dotenv from 'dotenv';
import offerRoutes from'./src/routes/offer.js';
import leadRoutes from'./src/routes/leads.js';

// Load environment variables (env)
dotenv.config();

const app = express();
// middleware
app.use(express.json());

// offer routes
app.use('/offer', offerRoutes);

// lead routes
app.use('/leads', leadRoutes);


// start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
