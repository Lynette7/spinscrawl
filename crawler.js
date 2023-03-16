const Crawler = require('crawler');
const crawlerInstance = new Crawler({
    rateLimit: 2000,
    maxConnections: 1,

    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const statsTable = 
            $('.table.table-bordered.table-hover.downloads > tbody > tr');
            statsTable.each(function() {
                let title = $(this).find('td').text();
                console.log(title);
            });
        }
        done();
    }
});

crawlerInstance.queue('https://www.iban.com/exchange-rates');
