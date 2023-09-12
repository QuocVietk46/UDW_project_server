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

app.listen(3000, () => {
  console.log(`server is running....`);
});

mongoose
  .connect('mongodb://localhost:27017', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log('Connect to database');
  })
  .catch((error) => {
    console.log(error);
  });
