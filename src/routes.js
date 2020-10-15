// routes.js
const Apify = require('apify');
const {
    utils: { log },
} = Apify;

exports.SEARCHPAGE = async({ response, body, $, request }, { requestQueue }) => {
    const pageContent = $('*');
    if (pageContent.length === 5) {
        log.error("IDENTIFIED AS A CRAWLER");
    } else {
        log.debug("processing a search page");

        await Apify.utils.enqueueLinks({
            $,
            requestQueue,
            selector: 'li[class=natural] > article > a[href]',
            baseUrl: request.loadedUrl,
            transformRequestFunction: req => {
                req.userData.label = 'LISTING';
                return req;
            },
        });

        await Apify.utils.enqueueLinks({
            $,
            requestQueue,
            selector: 'li[class=pagination-page] > a[href]',
            baseUrl: request.loadedUrl,
            transformRequestFunction: req => {
                req.userData.label = 'SEARCHPAGE';
                return req;
            },
        });
    }
};

exports.LISTING = async({ response, body, $, request }) => {
    const pageContent = $('*');
    if (pageContent.length === 5) {
        log.error("IDENTIFIED AS A CRAWLER");
    } else {
        log.debug("processing a listings page");
    }
};