var mongoose = require('mongoose');
var catgoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category', catgoriesSchema);

