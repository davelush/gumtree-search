const Apify = require('apify');
// const { URL } = require('url');
const {
    utils: {enqueueLinks},
} = Apify;

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://apify.com' });

    const handlePageFunction = async ({ request, $ }) => {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);

        const enqueued = await enqueueLinks({
            $,
            requestQueue,
            pseudoUrls: ['http[s?]://apify.com[.*]'],
            baseUrl: request.loadedUrl,
        });

        console.log(`Enqueued ${enqueued.length} URLs`);
    };

    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 20,
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
});