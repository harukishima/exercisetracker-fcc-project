const express = require('express');
const controller = require('../controllers/user.controller');
const router = express.Router();

router.post('/', controller.createUser);
router.get('/', controller.getListOfUsers);
router.post('/:userId/exercises', controller.createExercise);
router.get('/:userId/logs', controller.getLogs);

module.exports = router;
