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
            .get('https://www.businesslist.co.ke/category/civil-engineering/10')
            //.paginate('div.pages_container > a[href]', 19)
            //.delay(5000) // delay 2 seconds between pagination calls
            // All listings exist inside of a div with class
            .find('a.m_company_link')
            .follow('@href')
            .set({
                'name': 'div.info > span#company_name',
                'address': 'div.info > div.text.location',
                'phone': 'div.info > div.text.phone',
                'phone_2': 'div.cmp_details_in > div:nth-child(4) > div:last-child'
            })
            .data(listing => {
                // Each iteration, push the data into our Set
                list.add(listing);        
            })
            .error(err => reject(err))
            .done(() => resolve(list));
    });
}

scrapeBusinessList().then(list => {
    var data = Array.from(list);
    const csvWriter = createCsvWriter({
        path: './businesslist.csv',
        header: [
          {id: 'name', title: 'Name'},
          {id: 'address', title: 'Business Address'},
          {id: 'phone', title: 'Primary Phone'},
          {id: 'phone_2', title: 'Mobile Phone'}
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
