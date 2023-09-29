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

app.use('/V1', authRouter);
app.use('/V1', adminRouter);
app.use('/V1', userRouter);
