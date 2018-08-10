const osmosis = require('osmosis');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis.config('tries', 1)
osmosis.config('concurrency', 2);

function scrapeBusinessList() {
    return new Promise((resolve, reject) => {
        let list = new Set();
        osmosis
            // Get page
            .get('https://kendir.co.ke/dir/categories/Civil%20%26%20General%20Contractors')
            //.paginate('div.pages_container > a[href]', 19)
            //.delay(5000) // delay 2 seconds between pagination calls
            // All listings exist inside of a div with class
            .find('div.margin-left-20')
            //.follow('@href')
            //.submit('button.listing-card__contact-phone__icon-outer')
            .set({
                'name': 'div.margin-bottom-10 jsgrid-row',
                'phone': 'div.margin-left-20 > div:nth-child(8)',
            })
            .data(listing => {
                // Each iteration, push the data into our Set
                list.add(listing);        
            })
            .log(console.log)
            .error(err => reject(err))
            .done(() => resolve(list));
    });
}

scrapeBusinessList().then(list => {
    var data = Array.from(list);
    const csvWriter = createCsvWriter({
        path: './kendir.csv',
        header: [
          {id: 'name', title: 'Name'},
          {id: 'phone', title: 'Primary Phone'},
        ],
        append: true
      });

      csvWriter.writeRecords(data)
        .then(function(){
          console.log('Writing to CSV... Done');
      });
}).catch(err => {
    console.log(err);
});
