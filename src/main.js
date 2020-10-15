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
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 1
        },
        persistCookiesPerSession: true,
        handlePageFunction: async context => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        },
        prepareRequestFunction: async context => {
            context.request.headers = {
                "cache-control" : "max-age=0",
                "user-agent" : tools.getUserAgent(),
            };
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Actor finished.');
});