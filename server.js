const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`server is run on port ${process.env.PORT}....`);
});

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log('Connect to database');
  })
  .catch((error) => {
    console.log(error);
  });
