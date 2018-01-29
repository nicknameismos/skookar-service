'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Job = mongoose.model('Job'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  job;

/**
 * Job routes tests
 */
describe('Job CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Job
    user.save(function () {
      job = {
        name: 'Job name'
      };

      done();
    });
  });



  it('get detail', function (done) {
    var job = {
      userName: 'user@mail.com',
      apiKey: 'xHji908Klj74efghkJSGHlLGyfd543GFh',
      channel: 'foodstory',
      jobId: 'J151200170'
    };

    agent.post('/api/get_job_detail')
      .send(job)
      .expect(200)
      .end(function (jobSaveErr, jobSaveRes) {
        // Handle Job save error
        if (jobSaveErr) {
          return done(jobSaveErr);
        }

        (jobSaveRes.body.jobDetail.jobId).should.equal(job.jobId);

        done();

      });
  });

  // it('should be able to get a single Job that has an orphaned user reference', function (done) {
  //   // Create orphan user creds
  //   var _creds = {
  //     username: 'orphan',
  //     password: 'M3@n.jsI$Aw3$0m3'
  //   };

  //   // Create orphan user
  //   var _orphan = new User({
  //     firstName: 'Full',
  //     lastName: 'Name',
  //     displayName: 'Full Name',
  //     email: 'orphan@test.com',
  //     username: _creds.username,
  //     password: _creds.password,
  //     provider: 'local'
  //   });

  //   _orphan.save(function (err, orphan) {
  //     // Handle save error
  //     if (err) {
  //       return done(err);
  //     }

  //     agent.post('/api/auth/signin')
  //       .send(_creds)
  //       .expect(200)
  //       .end(function (signinErr, signinRes) {
  //         // Handle signin error
  //         if (signinErr) {
  //           return done(signinErr);
  //         }

  //         // Get the userId
  //         var orphanId = orphan._id;

  //         // Save a new Job
  //         agent.post('/api/jobs')
  //           .send(job)
  //           .expect(200)
  //           .end(function (jobSaveErr, jobSaveRes) {
  //             // Handle Job save error
  //             if (jobSaveErr) {
  //               return done(jobSaveErr);
  //             }

  //             // Set assertions on new Job
  //             (jobSaveRes.body.name).should.equal(job.name);
  //             should.exist(jobSaveRes.body.user);
  //             should.equal(jobSaveRes.body.user._id, orphanId);

  //             // force the Job to have an orphaned user reference
  //             orphan.remove(function () {
  //               // now signin with valid user
  //               agent.post('/api/auth/signin')
  //                 .send(credentials)
  //                 .expect(200)
  //                 .end(function (err, res) {
  //                   // Handle signin error
  //                   if (err) {
  //                     return done(err);
  //                   }

  //                   // Get the Job
  //                   agent.get('/api/jobs/' + jobSaveRes.body._id)
  //                     .expect(200)
  //                     .end(function (jobInfoErr, jobInfoRes) {
  //                       // Handle Job error
  //                       if (jobInfoErr) {
  //                         return done(jobInfoErr);
  //                       }

  //                       // Set assertions
  //                       (jobInfoRes.body._id).should.equal(jobSaveRes.body._id);
  //                       (jobInfoRes.body.name).should.equal(job.name);
  //                       should.equal(jobInfoRes.body.user, undefined);

  //                       // Call the assertion callback
  //                       done();
  //                     });
  //                 });
  //             });
  //           });
  //       });
  //   });
  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Job.remove().exec(done);
    });
  });
});
