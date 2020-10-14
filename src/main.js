// main.js
const Apify = require('apify');
const tools = require('./tools');
const {
    utils: { log },
} = Apify;

Apify.main(async () => {
    log.info('Starting actor.');
    const sources = await tools.getSources();
    const requestList = await Apify.openRequestList('postcodes', sources);
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug('Setting up crawler.');
    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        handlePageFunction: async context => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        },
        prepareRequestFunction: async context => {
            context.request.headers = {
                "User-Agent" : `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Mobile Safari/537.36`
            };
            console.log(context.request.headers);
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Actor finished.');
});