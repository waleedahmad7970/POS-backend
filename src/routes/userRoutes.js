const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
