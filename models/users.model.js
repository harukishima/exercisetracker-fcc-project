const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
});

const userModel = mongoose.model('Users', userSchema, 'Users');

module.exports = {
  create: (user) => {
    const newUser = new userModel(user);
    return newUser.save();
  },
  findById: (id) => {
    return userModel.findById(id).lean();
  },
  get: (query) => {
    return userModel.find(query).lean();
  },
  getLog: (id, from, to, limit) => {
    const aggregate = [
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'Exercises',
          localField: '_id',
          foreignField: 'userId',
          as: 'log',
        },
      },
      {
        $addFields: {
          count: { $size: '$log' },
        },
      },
      {
        $unwind: '$log',
      },
      // {
      //   $match: {
      //     date: {
      //       $gte: from,
      //       $lte: to,
      //     },
      //   },
      // },
      {
        $limit: limit,
      },
      {
        $project: {
          username: 1,
          count: 1,
          _id: '$_id',
          description: '$log.description',
          duration: '$log.duration',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$log.date' } },
        },
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          count: { $first: '$count' },
          log: {
            $push: {
              description: '$description',
              duration: '$duration',
              date: '$date',
            },
          },
        },
      },
    ];
    return userModel.aggregate(aggregate);
  },
};
