const jwt = require('jsonwebtoken');
const { models : { User }} = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log('Token:', token); // adicionado para debug
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id
      }
    });

    if (!user) {
      return res.redirect('/login');
    }

    req.user = user;
    req.isAdmin = user.email === 'admin@admin.com';
    next();
  } catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
};

module.exports = authMiddleware;