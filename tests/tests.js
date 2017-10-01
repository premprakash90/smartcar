var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe("unit test for home page",function() {
    it("should return home page", function (done) {

        server
            .get('/')
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });

});

describe("Tests get vehicle response with valid vehicle id - /vehicle/1234",function() {
    it("should return vehicle information", function (done) {

        server
            .get('/vehicles/1234')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.have.properties('vin', 'color', 'driveTrain', 'doorCount');
                done();
            });
    });
});


describe("Tests get vehicle response with invalid vehicle id - /vehicles/12",function() {
    it("should return 422", function (done) {

        server
            .get('/vehicles/12')
            .expect(422)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(422);
                done();
            });
    });
});


describe("Tests vehicle door response - /vehicles/1234/doors",function() {
    it("should return vehicle door status", function (done) {

        server
            .get('/vehicles/1234/doors')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                for (var i = 0; i < res.body.length; i++) {
                    res.body[i].should.have.properties('location', 'locked');
                }
                done();
            });
    });
});


describe("Tests vehicle fuel response - /vehicles/1234/fuel",function() {
    it("should return fuel percent", function (done) {

        server
            .get('/vehicles/1234/fuel')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.have.properties('percent');
                done();
            });
    });
});


describe("Tests Vehicle battery response - /vehicles/1234/battery",function() {
    it("should return battery percent", function (done) {

        server
            .get('/vehicles/1234/battery')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.have.properties('percent');
                done();
            });
    });
});


describe("Tests Vehicle engine response with valid action - /vehicles/1234/engine",function() {
    it("should return successful response with status = 'success' or 'error' ", function (done) {
        // action START
        server
            .post('/vehicles/1234/engine')
            .send({'action': 'START'})
            .set('Accept', /application\/json/)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.have.properties('status');
            });

        // action STOP
        server
            .post('/vehicles/1234/engine')
            .send({'action': 'STOP'})
            .set('Accept', /application\/json/)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.have.properties('status');
                done();
            });
    });
});


describe("Test Vehicle engine response with invalid action - /vehicles/1234/engine",function() {
    it("should return bad request status 4**", function (done) {
        // no action in POST param should return 400
        server
            .post('/vehicles/1234/engine')
            .set('Accept', /application\/json/)
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(400);
            });

        // action POST param set to invalid value ('xyz')
        server
            .post('/vehicles/1234/engine')
            .send({'action': 'xyz'})
            .set('Accept', /application\/json/)
            .expect(422)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(422);
                done();
            });
    });
});


describe('Test invalid url path - /vehicle/door/123', function () {
    it('should return 404', function (done) {
        server
            .get('/vehicle/door/123')
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    })

});



