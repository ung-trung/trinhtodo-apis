const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const User = require('../models/User')

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('firstName', 'First name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last Name is required')
      .not()
      .isEmpty(),
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { firstName, lastName, username, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ msg: 'User already exists' })
      }

      user = new User({
        firstName,
        lastName,
        username,
        email,
        password
      })

      const salt = await bcrypt.genSalt(10)

      // @ts-ignore
      user.password = await bcrypt.hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route    Get api/users
// @desc     Get user by name
// @access   Public

router.get('/get-by-term/:term', auth, async (req, res) => {
  const decodeTerm = decodeURI(req.params.term)
  const termRegex = new RegExp(decodeTerm, 'i')
  try {
    const users = req.params.term
      ? await User.find({}, 'firstName lastName username id').or([
          { firstName: termRegex },
          { username: termRegex },
          { lastName: termRegex }
        ])
      : await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

router.get('/get-by-term', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName username id')
    res.json(users)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

module.exports = router
