'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({response: "GET request"});
});

router.get('/:qID', (req, res) => {
  res.json({response: "GET request"});
});

router.post('/', (req, res) => {
  res.json({
    response: "POST request",
    body: req.body
  });
});

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

router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "DELETE request to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID
  });
});

// vote-up & vote-down route
router.post('/:qID/answers/:aID/vote-:dir', (req, res) => {
  res.json({
    response: "POST request to /vote-" + req.params.dir,
    questionId: req.params.qID,
    answerId: req.params.aID,
    direction: req.params.dir
  });
});

module.exports = router;