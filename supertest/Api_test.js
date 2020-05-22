const expect = require('chai').expect;
const request = require('supertest');
const app = require('../controllers/user')
var supertest = request(app);






describe('GET', function () {
    it('respond with json containing a list of all users', function (done) {
        request(app)
            .get('/user_profiles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /user_profiles/:USER_NAME', function () {
    it('respond with json containing a single user', function (done) {
        request(app)
            .get('/user_profiles/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


// describe('GET /user_profiles/:USER_NAME', function () {
//     it('User doesnt exist', function (done) {
//         request(app)
//             .get('/user_profiles/sachin')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(404)
//             .end(function(err, res) {
//            if (err) {
//            done(err);
//             } else {
//              done();
//             }   
//             });
//             });
//         });



describe('POST /saveuser_profiles', function () {
    it('User inserted', function (done) {
        request(app)
        .post('/saveuser_profiles')
        .field("USER_NAME", "ddf")
        .attach("file", "C:/Users/ramdas/Documents/Downloads/java_tutorial.pdf")    
        .field("DESCRIPTION", "John Doe")
       .field("GENDER", "male")
      .field("AGE", "34")
       .field("COUNTRY", "india")
        .set('Accept', /application\/json/)
        .expect(201,  done)
    });
    });

            
describe('POST /saveuser_profiles', function () {
it('User allready exists', function (done) {
request(app)
.post('/saveuser_profiles')
.field("USER_NAME", "ddf")
.attach("file", "C:/Users/ramdas/Documents/Downloads/java_tutorial.pdf")    
.field("DESCRIPTION", "John Doe")
.field("GENDER", "male")
.field("AGE", "34")
.field("COUNTRY", "india")
.set('Accept', 'application/json')
.expect('Content-Type', /json/)
.expect(400)
.end(function(err, res) {
    if (err) {
    done(err);
     } else {
      done();
     }   
     });
     });
 });
       




describe('PUT /user_profiles/:USER_NAME', function () {
    it('User update', function (done) {
        request(app)
            .put('/user_profiles/')
            .attach("file", "C:/Users/ramdas/Documents/Downloads/java_tutorial.pdf")   
            .field("DESCRIPTION", "modern")
            .field("GENDER", "nklp")
            .field("AGE", "34")
            .field("COUNTRY", "oplkm")
            .set('Accept', /application\/json/)
            .expect(204,  done)
        });
        });

    

describe('DELETE /user_profiles/:USER_NAME', function () {
    it('delete user', function (done) {
        request(app)
            .delete('/user_profiles/')
            .send({message: 'hello'})
             .expect(204,  done)
             });
             });
           
             describe('DELETE /user_profiles/:USER_NAME', function () {
                it('User doesnt exist', function (done) {
                    request(app)
                        .delete('/user_profiles/')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                .end(function(err, res) {
               if (err) {
               done(err);
                } else {
                 done();
                }   
                });
                });
            });
            


    
    
    