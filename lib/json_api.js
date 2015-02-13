var _ = require('lodash');
var ElasClone = _.clone(require('elasto'));

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

exports.getQuery = function(req, res) {
    ElasClone.config({
        host: 'https://80183372ddd0a7c32ee55c324dcf36d5-eu-west-1.foundcluster.com:9243',
    });
    return ElasClone.query({
        index: 'boulevard-staging-2015-02-02-02-48-40',
        type: 'products'
    })
    .term('shoe')
    .exec()
    .then(function(docs) {
        res.send(200, {
            docs: docs
        });
    });
};

