/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home',
    documentation: [
    {
        name: 'Term',
        param: 'q',
        example: '?q=shoes',
        description: 'Search for a specific term on your resource'
    },
    {
        name: 'Size',
        param: 'size',
        example: '?size=12',
        description: 'Limit the size of the search'
    },
    {
        name: 'From',
        param: 'from',
        example: '?from=12',
        description: 'Skip documents of the search'
    },
    {
        name: 'Sort',
        param: 'sort',
        example: '?sort=created_at',
        description: 'Sort by a field in the document. For desc append add - (-created_at)'
    },
    {
        name: 'Fields',
        param: 'fields',
        example: '?fields=name,description',
        description: 'Only return certain fields in the document.'
    },
    {
        name: 'Matching field',
        param: ':field',
        example: '?slug=2014-blog-article',
        description: 'Field matching on the index.'
    },
    ]
  });
};
