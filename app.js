var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const rankingFolder = 'chess-rankings/';
const fs = require('fs');

fs.readdir(rankingFolder, (err, files) => {
    const players = files.map(file => rankingFolder + file).map(xlsxFileToJson).flat();
    console.log(players);
    saveJson(players);
});

function xlsxFileToJson(filename) {
    const xlsx = require('xlsx');
    const workbook = xlsx.readFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(worksheet);
}

function saveJson(content) {
    const filename = "chess-players.json";
    fs.writeFile(filename, JSON.stringify(content), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log(`${filename} file has been saved.`);
    });
}

module.exports = app;
