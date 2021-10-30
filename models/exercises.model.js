const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exercisesSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'Users' },
  description: String,
  duration: Number,
  date: Date,
});

const exercisesModel = mongoose.model(
  'Exercises',
  exercisesSchema,
  'Exercises'
);

module.exports = {
  create: (data) => {
    const exercise = new exercisesModel(data);
    return exercise.save();
  },
};
