// tools.js
const Apify = require('apify');
const routes = require('./routes');
const {
    utils: { log },
} = Apify;

exports.getSources = async () => {
    log.debug('Getting sources.');
    const input = await Apify.getInput();
    const output = input.map(category => ({
        url: `https://apify.com/store?category=${category}`,
        userData: {
            label: 'CATEGORY',
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