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
                "user-agent" : "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Mobile Safari/537.36",
                "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding" : "gzip, deflate, br",
                "accept-language" : "en-GB,en-US;q=0.9,en;q=0.8,es;q=0.7",
                "cache-control" : "max-age=0",
                "authority" : "www.gumtree.com",
                "dnt" : "1",
                "referer" : "https://www.gumtree.com/search?search_category=for-sale&search_location=wf120rg&distance=10",
                "upgrade-insecure-requests": "1"
            };
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Actor finished.');
});