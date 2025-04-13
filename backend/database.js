const mongoose = require('mongoose');

const database = () => { mongoose.connect('mongodb://localhost:27017/MyDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err)) };

module.exports = database;
