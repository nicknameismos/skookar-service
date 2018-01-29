'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Job = mongoose.model('Job'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Job
 */
exports.create = function (req, res) {
  var job = new Job(req.body);
  job.user = req.user;

  job.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * Show the current Job
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var job = req.job ? req.job.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  job.isCurrentUserOwner = req.user && job.user && job.user._id.toString() === req.user._id.toString();

  res.jsonp(job);
};

/**
 * Update a Job
 */
exports.update = function (req, res) {
  var job = req.job;

  job = _.extend(job, req.body);

  job.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * Delete an Job
 */
exports.delete = function (req, res) {
  var job = req.job;

  job.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(job);
    }
  });
};

/**
 * List of Jobs
 */
exports.list = function (req, res) {
  Job.find().sort('-created').populate('user', 'displayName').exec(function (err, jobs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobs);
    }
  });
};

/**
 * Job middleware
 */
exports.jobByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Job is invalid'
    });
  }

  Job.findById(id).populate('user', 'displayName').exec(function (err, job) {
    if (err) {
      return next(err);
    } else if (!job) {
      return res.status(404).send({
        message: 'No Job with that identifier has been found'
      });
    }
    req.job = job;
    next();
  });
};

exports.jobDetail = function (req, res) {
  if (req.body.apiKey === 'xHji908Klj74efghkJSGHlLGyfd543GFh') {
    res.jsonp({
      jobDetail: {
        jobId: req.body.jobId,
        jobDate: '21 / 12 / 2015',
        jobStatus: 6,
        jobStatusEn: 'OTW to pickup',
        jobStatusTh: 'กำลังไปรับของ',
        jobDesc: 'รับ:new point > ส่ง:ม.รามคำแหง',
        startTime: '13:45',
        finishTime: '15:45',
        haveReturn: false,
        jobType: '2',
        option: ['1', '2', '4', '6'],
        totalDistance: 0.0,
        totalWeight: 0.0,
        totalSize: 0.0,
        remark: 'Be careful fragile goods',
        userType: 0,
        normalPrice: 180.0,
        netPrice: 180.0,
        skootarId: 'SK1742',
        skootarName: 'ทันใจงานดี',
        skootarPhone: '0900000000',
        discount: 0.0,
        rating: 0,
        locationList: [{
          seq: 1,
          type: 'P',
          addressId: 1949,
          addressName: 'new point',
          address: '281 / 28 บรรทั ดทอง เขต ราชเทวี กรุงเทพมหานคร ประเทศไทย 10400',
          lat: '13.7518789',
          lng: '100.5263246',
          contactName: 'Thanate',
          contactPhone: '0864923595'
        }, {
          seq: 2,
          type: 'D',
          addressId: 1950,
          addressName: 'ม.รามคำแหง',
          address: '2086 ถนน รามคำแหง เขต บางกะปิ กรุงเทพมหานคร ประเทศไทย 10240',
          lat: '13.7596345',
          lng: '100.6203078',
          contactName: 'มาช่า',
          contactPhone: '0998888999'
        }]
      },
      responseCode: '200',
      responseDesc: 'Create job success'
    });
  }
};
