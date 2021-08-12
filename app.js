require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = 3001;

const app = express();

app.use(cors({ origin: '*' }));

app.use(morgan('dev'));
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use('/public', express.static('public'));

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw.js')(app);

app.get('/404', (req, res, next) => {
  res.render('404');
});

app.use('/', (req, res) => {
  res.render('404');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.redirect('/');
});

app.listen(PORT, (server) => {
  console.log(`GenZ Web App listening at http://localhost:${PORT}`);
});
