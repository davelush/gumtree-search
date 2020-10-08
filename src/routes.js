// routes.js
const Apify = require('apify');
const {
    utils: {log},
} = Apify;

exports.CATEGORY = async({$, request}, {requestQueue}) => {
    return Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector: 'div.item > a',
        baseUrl: request.loadedUrl,
        transformRequestFunction: req => {
            req.userData.label = 'DETAIL';
            return req;
        }
    })
};

exports.DETAIL = async({$, request}) => {
    const urlArr = request.url.split('/').slice(-2);

    log.debug('Scraping results');
    const results = {
        url: request.url,
        uniqueIdentifier: urlArr.join('/'),
        owner: urlArr[0],
        title: $('header h1').text(),
        description: $('header p[class^=Text__Paragraph]').text(),
        lastRunDate: new Date(
            Number(
                $('time')
                    .eq(1)
                    .attr('datetime')
            ),
        ),
        runCount: Number(
            $('ul.stats li:nth-of-type(3)')
                .text()
                .match(/\+d/)[0],
        )
    };

    log.debug('Push data to to dataset');
    await Apify.pushData(results);
};