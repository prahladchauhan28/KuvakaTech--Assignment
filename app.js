import express from 'express';
import dotenv from 'dotenv';
import offerRoutes from'./src/routes/offer.js';
dotenv.config();

const app = express();
// middleware
app.use(express.json());

// offer routes
app.use('/offer', offerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
