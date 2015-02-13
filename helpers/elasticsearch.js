var request = require('request');
var Bluebird = require('bluebird');
var _ = require('lodash');

var massageBody = function(body) {
    var obj = JSON.parse(body);
    var indices = _.keys(obj);
    return indices.map(function(index) {

        var resources = _.keys(obj[index])
        .filter(function(name) { return name !== '_default_'; });

        return {
            index: index,
            resources: resources
        };
    });
};


exports.getResources = function(url) {
    return new Bluebird(function(resolve, reject) {
        request(url + '/_all/_mapping', function(error, response, body) {
            if (!error && response.statusCode == 200) resolve(massageBody(body));
            reject(error);
        });
    });
};

