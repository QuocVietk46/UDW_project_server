const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRouter);
app.use('/api', adminRouter);
app.use('/api', userRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ msg: err.message });
});
