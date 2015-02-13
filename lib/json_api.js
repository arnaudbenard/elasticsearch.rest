var _ = require('lodash');
var ElasClone = _.clone(require('elasto'));
var Cluster = require('../models/Cluster');

// exports.init = function(url) {
//     ElasClone.config({
//         host: url,
//     });
// };

// var _buildQuery = function(req) {

//     return ElasClone.query({
//         index: 'boulevard-staging-2015-02-02-02-48-40',
//         type: 'products'
//     })
//     .term('shoe');

//     // where
//     // near
//     // size
//     // from
//     // fields
//     // q
//     // sort
//     // range
//     // exclude
// };

var findConfig = function(user, app) {
    return Cluster.findAsync({ user: user})
    .get(0)
    .then(function(doc) {
        return {
            index: _.find(doc.toObject().apps, { name: app }).index,
            host: doc.toObject().url
        };
    });
};

exports.getConfig = function(req, res) {
    findConfig(req.user, req.params.name)
    .then(function(config) {
        res.send(200, {
            config: config
        });
    });
};


exports.getQuery = function(req, res) {
    var meta = {};

    findConfig(req.user, req.params.name)
    .then(function(config) {
        meta.config = config;
        ElasClone.config({
            host: config.host,
        });

        return ElasClone.query({
            index: config.index,
            type: req.params.type
        })
       .term('shoe')
       .exec();
    })
    .then(function(body) {
        var docs = [];

        body.hits.hits.forEach(function (hit) {
            var obj = hit.fields || hit._source;
            // if geolocation type of query the response returns the distance in sort
            if (hit.sort) obj.sort = hit.sort;
            docs.push(obj);
        });

        docs.forEach(function(doc) {
            doc.type = req.params.type; // JSON API Specs
        });

        res.send(200, {
            meta: meta,
            data: docs
        });
    });
};

