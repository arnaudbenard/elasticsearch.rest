var Cluster = require('../models/Cluster');
var Bluebird = require('bluebird');

/**
 * GET /clusters
 * Clusters page.
 */
exports.getIndex = function(req, res) {
    Cluster.findAsync({ user: req.user })
    .then(function(docs) {
        console.log('docs', docs);
        res.render('clusters/index', {
            title: 'Clusters',
            clusters: docs
        });
    });
};

exports.getShow = function(req, res) {
    console.log('req.params', req.params);
    Cluster.findOneAsync({ user: req.user, _id: req.params.id })
    .then(function(doc) {
        res.render('clusters/show', {
            title: 'Clusters',
            cluster: doc
        });
    });
};

/**
 * GET /clusters/new
 * Create cluster page.
 */
exports.getCreate = function(req, res) {
    res.render('clusters/new', {
        title: 'Clusters create'
    });
};

/**
 * Post /clusters
 * Create cluster api.
 */
exports.postIndex = function(req, res) {
    var url = req.body.url;

    if (!url) {
        res.send(400, {
            message: 'Url missing'
        });
    }

    Cluster.findAsync({ url: url})
    .then(function(docs) {
        if (docs.length > 0) {
            res.send(400, {
                message: 'Url already used by another user'
            });
        }

        return Cluster.createAsync({
            url: url,
            user: req.user
        });
    })
    .then(function() {
        res.redirect('/clusters');
    });
};


// app.get('/clusters', clustersController.getIndex);
// app.post('/clusters', clustersController.postIndex);
// app.get('/clusters/:id', clustersController.getShow);
// app.put('/clusters/:id', clustersController.putShow);
// app.del('/clusters/:id', clustersController.delShow);
// app.get('/clusters/new', clustersController.getCreate);


