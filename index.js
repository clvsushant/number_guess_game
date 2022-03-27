var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
const PORT = process.env.PORT || 3000;
var app = express();

app.use(
  session({
    secret: 'guessinggameexpress',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/play', function (req, res) {
  if (typeof req.session.number == 'undefined') {
    req.session.number = Math.floor(Math.random() * 100);
  }
  if (typeof req.session.count == 'undefined') {
    req.session.count = 0;
  }
  console.log(req.session.number);
  console.log(req.session.id);
  res.render('verify', { session: req.session });
});

app.post('/verify', function (req, res) {
  if (
    typeof +req.body.guess != 'number' ||
    req.body.guess < 1 ||
    req.body.guess > 100
  ) {
    req.session.reply = 'invalid';
  } else if (req.session.number > req.body.guess) {
    req.session.reply = 'low';
    req.session.count++;
  } else if (req.session.number < req.body.guess) {
    req.session.reply = 'high';
    req.session.count++;
  } else if (req.session.number == req.body.guess) {
    req.session.status = 'gameover';
    req.session.reply = 'correct';
    req.session.count++;
  } else {
    req.session.reply = 'invalid';
  }
  console.log(req.body.guess);
  res.redirect('/play');
});

app.get('/reset', function (req, res) {
  req.session.destroy();
  res.redirect('/play');
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
