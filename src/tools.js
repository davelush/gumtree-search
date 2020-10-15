// tools.js
const Apify = require('apify');
const routes = require('./routes');
const {
    utils: { log },
} = Apify;

exports.getSources = async () => {
    log.debug('Getting sources.');
    const input = await Apify.getInput();
    const output = input.map(postcode => ({
        url: `https://www.gumtree.com/search?search_category=for-sale&search_location=${postcode}&distance=10`,
        userData: {
            label: 'SEARCHPAGE',
        },
    }));
    return output;
};

exports.createRouter = globalContext => {
    return async function(routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};