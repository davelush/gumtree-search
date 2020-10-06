const Apify = require('apify');

// TODO me next https://sdk.apify.com/docs/guides/getting-started#scraping-data

Apify.main(async () => {
    const sources = [
        'https://apify.com/store?category=TRAVEL',
        'https://apify.com/store?category=ECOMMERCE',
        'https://apify.com/store?category=ENTERTAINMENT',
    ];

    // there is a bug here on node 13+ https://github.com/apify/apify-js/issues/735
    // push
    const requestList = await Apify.openRequestList('categories', sources);
    const requestQueue = await Apify.openRequestQueue();

    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 50,
        requestList,
        requestQueue,
        handlePageFunction: async ({ $, request }) => {
            console.log(`Processing ${request.url}`);

            // Only enqueue new links from the category pages.
            if (!request.userData.detailPage) {
                await Apify.utils.enqueueLinks({
                    $,
                    requestQueue,
                    selector: 'div.item > a',
                    baseUrl: request.loadedUrl,
                    transformRequestFunction: req => {
                        req.userData.detailPage = true;
                        return req;
                    },
                });
            }
        },
    });

    await crawler.run();
});