'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Job = mongoose.model('Job');

/**
 * Globals
 */
var user,
  job;

/**
 * Unit tests
 */
describe('Job Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      job = new Job({
        name: 'Job Name',
        user: user,
        userName: 'user@mail.com',
        apiKey: 'xHji908Klj74efghkJSGHlLGyfd543GFh',
        channel: 'playground',
        customerMobile: '0851111111',
        customerEmail: 'test@gmail.com',
        jobType: '1',
        jobDate: '2015-12-21',
        startTime: '13:45',
        finishTime: '15:45',
        locationList: [{
          addressName: 'My place',
          address: '281/28 บรรทัดทอง เขต ราชเทวี กรุงเทพมหานคร ประเทศไทย 10400',
          lat: '13.721899',
          lng: '100.5263246',
          contactName: 'Andrew',
          contactPhone: '0829963325',
          cashFee: 'Y',
          seq: 1
        }],
        paymentType: 'invoice',
        totalSize: 0,
        totalWeight: 0,
        promoCode: 'sktmx2015',
        remark: 'Be careful fragile goods',
        callbackUrl: 'http://www.youcallback.com',
        option: ['1', '2', '4', '6']
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return job.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      job.name = '';

      return job.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Job.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
