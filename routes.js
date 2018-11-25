'use strict';

const express = require('express');
const router = express.Router();
const Question = require("./models").Question;

// GET /questions for entire questions collection
router.get('/', (req, res, next) => {
  Question.find({}, null, {sort: {createdAt: -1}}, (err, questions) => {
    if(err) return next(err);
  });
  res.json({response: "GET request"});
});

// GET /questions/:id for specific questions
router.get('/:qID', (req, res) => {

  res.json({response: "GET request"});
});

// POST /questions for creating a question
router.post('/', (req, res) => {
  res.json({
    response: "POST request",
    body: req.body
  });
});

// POST /questions/:id/answers for creating an answer
router.post('/:qID/answers', (req, res) => {
  res.json({
    response: "POST request to /answers",
    questionId: req.params.qID,
    body: req.body
  });
});

router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "PUT request to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body
  });
});

// 
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "DELETE request to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID
  });
});

// vote-up & vote-down route
// /questions/:qID/answers/:aID/vote-up/down
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if(req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
}, (req, res) => {
  res.json({
    response: "POST request to /vote-" + req.params.dir,
    questionId: req.params.qID,
    answerId: req.params.aID,
    vote: req.params.dir
  });
});

module.exports = router;