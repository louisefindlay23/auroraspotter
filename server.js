var express = require('express');
var app = express();

app.use(express.static('final'));

app.listen(8080);
