
var express = require('express')
const Logger = require('../services/logger_service')
var multer = require('multer');
var path = require('path');
const logger = new Logger('app')
var router = express.Router();
var oracledb = require('../database/db')

var app = express();

var connpool = {
    "user": "SYS",
    "password": "Pass1234",
    "connectString": "orcl",
    "schema":""
    
}

 var Storage= multer.diskStorage({
     destination:"./public/uploads/",
     filename:(req,file,cb)=>{
     cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
     }
  });
  
  var upload = multer({
    storage:Storage
  }).single('file');
  

 

    
app.get('/user_profiles', function (req, res) {
    oracledb.getConnection(connpool, function (err, connection) {
        
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message,
                
            }));
            
            return;
        }

        connection.execute("SELECT * FROM user_profiles", {}, {
            outFormat: oracledb.OBJECT  }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the user profile",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles : Connection released");
                    }
                });
        });
    });
});

app.get('/user_profiles/:USER_NAME', function (req, res) {
    oracledb.getConnection(connpool, function (err, connection) {
        if (err) { 
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM USER_PROFILES WHERE USER_NAME = :USER_NAME", [req.params.USER_NAME], {
            outFormat: oracledb.OBJECT 
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles/" + req.params.USER_NAME + " : Connection released");
                    }
                });
        });
    });
});


app.post('/saveuser_profiles',upload, function (req, res) {
    console.log(req.body);
    oracledb.getConnection(connpool, function (err, connection) {
        if (err) {
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        
        connection.execute("INSERT INTO user_profiles VALUES " +
            "(:USER_NAME, :USER_IMAGE, :DESCRIPTION, :GENDER," +
            ":AGE, :COUNTRY) ", [req.body.USER_NAME,req.file.filename,  req.body.DESCRIPTION, 
                req.body.GENDER, req.body.AGE, req.body.COUNTRY], {
                autoCommit: true,
                outFormat: oracledb.OBJECT 
            },
            function (err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    res.status(201).set('Location', '/user_profiles/' + req.body.USER_NAME).end();
                }
            });
    });
});



var buildUpdateStatement = function buildUpdateStatement(req) {
    var statement = "",
        bindValues = {};
        if (req.file.filename) {
            if (statement) statement = statement + ", ";
            statement += "USER_IMAGE = :USER_IMAGE";
            bindValues.USER_IMAGE = req.file.filename;
        }
    if (req.body.DESCRIPTION) {
        if (statement) statement = statement + ", ";
        statement += "DESCRIPTION = :DESCRIPTION";
        bindValues.DESCRIPTION = req.body.DESCRIPTION;
    }
    if (req.body.GENDER) {
        if (statement) statement = statement + ", ";
        statement += "GENDER = :GENDER";
        bindValues.GENDER = req.body.GENDER;
    }
    if (req.body.AGE) {
        if (statement) statement = statement + ", ";
        statement += "AGE = :AGE";
        bindValues.AGE = req.body.AGE;
    }
    if (req.body.COUNTRY) {
        if (statement) statement = statement + ", ";
        statement += "COUNTRY = :COUNTRY";
        bindValues.COUNTRY = req.body.COUNTRY;
    }
    
    statement += " WHERE USER_NAME = :USER_NAME";
    bindValues.USER_NAME = req.params.USER_NAME;
    statement = "UPDATE USER_PROFILES SET " + statement;

    return {
        statement: statement,
        bindValues: bindValues
    };
};


app.put('/user_profiles/:USER_NAME',upload, function (req, res) {
    oracledb.getConnection(connpool, function (err, connection) {
        if (err) { 
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        var updateStatement = buildUpdateStatement(req);
        connection.execute(updateStatement.statement, updateStatement.bindValues, {
                autoCommit: true,
                outFormat: oracledb.OBJECT 
            },
            function (err, result) {
                if (err || result.rowsAffected === 0) {
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err ? "Input Error" : "User doesn't exist",
                        detailed_message: err ? err.message : ""
                    }));
                } else {
                     res.status(204).end();
                }
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("PUT /user_profiles/" + req.params.USER_NAME + " : Connection released ");
                        }
                    });
            });
    });
});

app.delete('/user_profiles/:USER_NAME', function (req, res) {
    oracledb.getConnection(connpool, function (err, connection) {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("DELETE FROM USER_PROFILES WHERE USER_NAME = :USER_NAME", [req.params.USER_NAME], {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        }, function (err, result) {
            if (err || result.rowsAffected === 0) {
                res.set('Content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    status: 400,
                    message: err ? "Input Error" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.status(204).end();
            }
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("DELETE /user_profiles/" + req.params.USER_NAME + " : Connection released");
                    }
                });
        });
    });
});

module.exports = app;
