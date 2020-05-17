const http = require("http");
const oracledb = require("oracledb");
let error;
let user;

let connection;

 oracledb.getConnection(
  {
    user: 'SYS',
    password: 'Pass1234',
    connectString: 'orcl'
  },
  function(err, connection)
{
if (err) {
console.error(err.message);
return;
}
console.log('Connection was successful!');

connection.close(
function(err)
{
if (err) {
console.error(err.message);
return;
}
});
});

module.exports = oracledb;
