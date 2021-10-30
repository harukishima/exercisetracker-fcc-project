const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const config = require('./config/main.config');
require('./db').connectMongoDb(config.mongoUrl);
const userRoute = require('./routes/user.route');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.use('/api/users', userRoute);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
