var _ = require('lodash');
var ElasClone = _.clone(require('elasto'));
var Cluster = require('../models/Cluster');

var _buildQuery = function(req) {
    var actions = [];
    var query = req.query || {};
    var size = query.size || 10;

    if (query.page) {
        actions.push({
            method: 'from',
            args: (Number(query.page) - 1) * Number(size)
        });
    }

    // size
    if (size) {
        actions.push({
            method: 'size',
            args: query.size
        });
    }

    // term
    if (query.q) {
        actions.push({
            method: 'term',
            args: query.q
        });
    }

    // from
    if (query.from) {
        actions.push({
            method: 'from',
            args: query.from
        });
    }

    // sort
    if (query.sort) {
        var sort;
        if (query.sort.charAt(0) === '-') {
            sort = [query.sort.replace('-', ''), 'desc'];
        } else {
            sort = [query.sort, 'asc'];
        }

        actions.push({
            method: 'sort',
            args: sort
        });
    }

    if (query.fields) {
        actions.push({
            method: 'fields',
            args: [query.fields.split(',')]
        });
    }

    return actions;
};

var findConfig = function(user, app) {
    return Cluster.findAsync({ user: user})
    .get(0)
    .then(function(doc) {
        var docApp = _.find(doc.toObject().apps, { name: app });
        return {
            index: docApp.index,
            resources: docApp.resources,
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
    .tap(function checkIfTypeExists(config) {
        if (!_.contains(config.resources, req.params.type)) {
            throw new Error('Resource ' + req.params.type + ' doesn\'t exists.');
        }
    })
    .then(function(config) {
        meta.config = config;
        ElasClone.config({
            host: config.host,
        });

        var query = ElasClone.query({
            index: config.index,
            type: req.params.type
        });

        var actions = _buildQuery(req);
        actions.forEach(function(action) {
            var args = action.args;
            query[action.method].apply(query, _.isArray(args) ? args : [args]);
        });

        return query.exec();
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

        return res.send(200, {
            meta: meta,
            data: docs
        });
    })
    .catch(function(err) {
        return res.send(404, {
            message: err.message
        });
    });
};

