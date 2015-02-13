var mongoose = require('mongoose');

var clusterSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  url: {
    type: String,
    required: true
  },

});



module.exports = mongoose.model('Cluster', clusterSchema);
