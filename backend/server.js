const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', app: 'ApnaMart Backend' });
});

app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL) {
    return res.status(200).json({ 
      message: 'Welcome Punya Binay Swain (Admin)', 
      role: 'admin',
      token: 'jwt_admin_token_sample'
    });
  }
  return res.status(401).json({ message: 'Invalid Admin Credentials' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ApnaMart Backend running on port ${PORT}`));