const Apify = require('apify');

Apify.main(async () => {
    const sources = [
        'https://apify.com/store?category=TRAVEL',
        'https://apify.com/store?category=ECOMMERCE',
        'https://apify.com/store?category=ENTERTAINMENT',
    ];

    const requestList = await Apify.openRequestList('categories', sources);

    const crawler = new Apify.CheerioCrawler({
        requestList,
        handlePageFunction: async ({ $, request }) => {
            // Select all the actor cards.
            $('.item').each((i, el) => {
                const text = $(el).text();
                console.log(`ITEM: ${text}\n`);
            });
        },
    });

    // Just got to https://sdk.apify.com/docs/guides/getting-started#enqueueing-the-detail-links-using-a-custom-selector

    await crawler.run();
});