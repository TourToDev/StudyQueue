const Crawler = require('js-crawler')

var crawler = new Crawler().configure({ignoreRelative: false, depth: 2});
 
crawler.crawl({
  url: "https://github.com",
  success: function(page) {
    console.log(page.url);
    console.log(page.title)
  },
  failure: function(page) {
    console.log(page.status);
  },
  finished: function(crawledUrls) {
    console.log(crawledUrls);
  }
});