const osmosis = require('osmosis');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis.config('tries', 1)
osmosis.config('concurrency', 2);

function scrapeGoogle() {
    return new Promise((resolve, reject) => {
        let list = new Set();

        osmosis
            // Do Google search
            .get('https://www.google.com/search?client=firefox-b-ab&sa=X&biw=1440&bih=763&q=contractors+kenya+listing&npsic=0&rflfq=1&rlha=0&rllag=-1272458,36856103,3498&tbm=lcl&ved=2ahUKEwi85vHI7NrcAhVIOhoKHSJRAUYQjGp6BAgAEDw&tbs=lrf:!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:2&rldoc=1#rlfi=hd:;si:;mv:!1m3!1d1162351.4376809243!2d37.342286200000004!3d-0.29683324999999994!2m3!1f0!2f0!3f0!3m2!1i239!2i437!4f13.1;start:40')
            //.paginate('#navcnt table tr > td a[href]', 3)
            .delay(10000) // delay 2 seconds between pagination calls
            // All listings exist inside of a div with class .cXedhc
            .find('.cXedhc')
            .delay(1000)
            .set({
                'name': 'div.dbg0pd > div',
                'phone': 'span.rllt__details > div:nth-child(4)'
            })
            .data(listing => {
                // Each iteration, push the data into our Set
                list.add(listing);        
            })
            .error(err => reject(err))
            .done(() => resolve(list));
    });
}

scrapeGoogle().then(list => {
    var data = Array.from(list);
    const csvWriter = createCsvWriter({
        path: './google-2.csv',
        header: [
          {id: 'name', title: 'Name'},
          {id: 'phone', title: 'Business Phone'},
        ],
        append: true
      });

      csvWriter.writeRecords(data)
        .then(function(){
          console.log('Writing to CSV... Done');
      });
});