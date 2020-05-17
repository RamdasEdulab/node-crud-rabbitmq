/*jslint node:true*/

var express = require('express');
const helmet = require('helmet');

var bodyParser = require('body-parser');
var oracledb = require('oracledb');
const Logger = require('../NodeJS/services/logger_service')

const logger = new Logger('app')
var oracledb = require('./database/db')

var app = express();

var user = require('../NodeJS/controllers/user');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use('/',user);
app.listen(3000, () => {
    logger.info("APP LAUNCHED IN PORT 3000")
   })