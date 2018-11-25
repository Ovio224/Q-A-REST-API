'use strict';

const express = require('express');
const router = express.Router();
const Question = require("./models").Question;

router.param("qID", (req, res, next, id) => {
  Question.findById(id, (err, doc) => {
    if (err) return next(err);
    if (!doc) {
      err = new Error("Not found");
      err.status = 404;
    } else {
      req.question = doc;
      return next();
    }
  });
});

router.param("aID", (req, res, next, id) => {
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    err = new Error("Not found");
    err.status = 404;
  }
  next();
});

// GET /questions for entire questions collection
router.get('/', (req, res, next) => {
  Question.find({})
    .sort({
      createdAt: -1
    })
    .exec((err, questions) => {
      if (err) return next(err);
      res.json(questions);
    });
});


// POST /questions for creating a question
router.post('/', (req, res, next) => {
  const question = new Question(req.body);
  question.save((err, questions, next) => {
    if (err) return next(err);
    res.status(201);
    res.json(questions);
  });
});


// GET /questions/:id for specific questions
router.get('/:qID', (req, res, next) => {
  res.json(req.question);
});


// POST /questions/:id/answers for creating an answer
router.post('/:qID/answers', (req, res) => {
  req.question.answers.push(req.body);
  req.question.save((err, questions, next) => {
    if (err) return next(err);
    res.status(201);
    res.json(questions);
  });
});

router.put('/:qID/answers/:aID', (req, res) => {
  req.answer.update(req.body, (err, result) => {
    if (err) return next(err);
    res.json(result);
  });
});

// 
router.delete('/:qID/answers/:aID', (req, res) => {
  req.answer.remove((err) => {
    req.question.save((err, question) => {
      if (err) return next(err);
      res.json(question);
    });
  });
});

// vote-up & vote-down route
// /questions/:qID/answers/:aID/vote-up/down
router.post('/:qID/answers/:aID/vote-:dir',
  (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      req.vote = req.params.dir;
      next();
    }
  },
  (req, res) => {
    req.answer.vote(req.vote, (err, question) => {
      if (err) return next(err);
      res.json(question);
    });
});
module.exports = router;