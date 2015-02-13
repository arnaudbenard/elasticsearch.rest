var Cluster = require('../models/Cluster');
var Bluebird = require('bluebird');
var helper = require('../helpers/elasticsearch');
var Moniker = require('moniker');
var _ = require('lodash');

/**
 * GET /clusters
 * Clusters page.
 */
exports.getIndex = function(req, res) {
    Cluster.findAsync({ user: req.user })
    .then(function(docs) {
        console.log(docs);
        res.render('clusters/index', {
            title: 'Clusters',
            clusters: docs
        });
    });
};

exports.getShow = function(req, res) {
    Cluster.findOneAsync({ user: req.user, _id: req.params.id })
    .then(function(doc) {
        return Bluebird.props({
            indices: helper.getResources(doc.url), // has index and resource
            cluster: doc.toObject() // has apps
        });
    })
    .then(function(obj) {
        obj.indices.forEach(function(ind) {
            ind.appName = _.find(obj.cluster.apps, {index: ind.index}).name;
        });

        res.render('clusters/show', {
            title: 'Clusters',
            cluster: obj.cluster,
            indices: obj.indices,
            host: process.env.PRODUCTION ? 'http://www.elasticsearch.rest/': 'http://localhost:3000/'
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

var randomName = function() {
    var names = Moniker.generator([Moniker.noun, Moniker.noun, Moniker.noun], {
        maxSize: 30,
        encoding: 'utf-8',
        glue: '-'
    });
    return names.choose();
};

var populateAppNames = function(cluster) {
    return helper.getResources(cluster.url)
    .then(function(indices) {
        return indices.map(function(obj) {
            return {
                index: obj.index,
                name: randomName(),
                resources: obj.resources
            };
        });
    })
    .then(function(arr) {
        return cluster.updateAsync({ $set: {
            apps: arr
        }});
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

    Cluster.findAsync({ user: req.user, url: url})
    .then(function(docs) {
        if (docs.length > 0) {
            res.send(400, {
                message: 'Url already used.'
            });
        }
        return Cluster.createAsync({
            url: url,
            user: req.user
        });
    })
    .then(populateAppNames)
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


