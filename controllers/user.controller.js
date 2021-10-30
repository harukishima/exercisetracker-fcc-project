const userModel = require('../models/users.model');
const exerciseModel = require('../models/exercises.model');

module.exports.createUser = async (req, res) => {
  const username = req.body.username;
  const user = { username: username };
  const newUser = await userModel.create(user);
  res.status(201).json(newUser);
};

module.exports.getListOfUsers = async (req, res) => {
  const users = await userModel.get({});
  res.status(200).json(users);
};

module.exports.createExercise = async (req, res) => {
  const userId = req.params.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const exercise = {
    userId: userId,
    description: description,
    duration: duration,
    date: date,
  };
  const newExercise = await exerciseModel.create(exercise);
  const user = await userModel.findById(userId);
  const exerciseObject = newExercise.toObject();
  exerciseObject.date = new Date(newExercise.date).toDateString();
  const resp = { ...exerciseObject, ...user };
  delete resp.__v;
  res.status(201).json(resp);
};

module.exports.getLogs = async (req, res) => {
  const userId = req.params.userId;
  const from = req.query.from ? new Date(req.query.from) : new Date(0);
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const exercises = await userModel.getLog(userId, from, to, limit);
  const resp = exercises[0];
  if (resp) {
    resp.log = resp.log.filter((exercise) => {
      const date = new Date(exercise.date);
      return date >= from && date <= to;
    });
    resp.log = resp.log.map((exercise) => {
      exercise.date = new Date(exercise.date).toDateString();
      return exercise;
    });
  }
  res.status(200).json(resp);
};
