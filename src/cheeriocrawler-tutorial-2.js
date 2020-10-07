const Apify = require('apify');

// TODO me next https://sdk.apify.com/docs/guides/getting-started#scraping-data

Apify.main(async () => {
    const input = await Apify.getInput();

    const sources = input.map(category => ({
        url: `https://apify.com/store?category=${category}`,
        userData: {
            label: 'CATEGORY',
        },
    }));

    // there is a bug here on node 13+ https://github.com/apify/apify-js/issues/735
    const requestList = await Apify.openRequestList('categories', sources);
    const requestQueue = await Apify.openRequestQueue();

    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 50,
        requestList,
        requestQueue,
        handlePageFunction: async ({$, request}) => {
            console.log(`Processing ${request.url}`);

            if (request.userData.detailPage) {
                const urlArr = request.url.split('/').slice(-2);

                const results = {
                    url: request.url,
                    uniqueIdentifier: urlArr.join('/'),
                    owner: urlArr[0],
                    title: $('header h1').text(),
                    description: $('header p[class^=Text__Paragraph]').text(),
                    lastRunDate: new Date(
                        Number($('time')
                            .eq(1)
                            .attr('datetime'),
                        ),
                    ),
                    runCount: Number(
                        $('ul.stats li:nth-of-type(3)')
                            .text()
                            .match(/\d+/)[0],
                    )
                };

                await Apify.pushData(results)
            }

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