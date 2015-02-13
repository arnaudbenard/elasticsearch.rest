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

  apps: [new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true
    },
    token: {
        type: String,
    }
  })]

});

module.exports = mongoose.model('Cluster', clusterSchema);
