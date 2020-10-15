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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.getUserAgent = globalContext => {
    return "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Mobile Safari/537.36";
    // return makeid(8);
}