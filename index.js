const scrapeIt = require('scrape-it');
const request = require('request-promise');
const cheerio = require('cheerio');

const AMAZON_BASE_URL = 'https://www.amazon.com';

const getSearchUrl = (isbn) => {
  const searchUrl = `${AMAZON_BASE_URL}/s/?field-keywords=${isbn}`;
  // console.log(searchUrl);

  return searchUrl;
};

const getRequestSettings = uri => ({
  method: 'GET',
  uri,
  headers: {
    'User-Agent': 'Googlebot'
  },
  transform: body => cheerio.load(body),
})

const searchAmazonForDetailPageUrl = uri => request(getRequestSettings(uri))
.then($ => scrapeIt.scrapeHTML($, {
  detailPageUrl: {
    selector: '#s-results-list-atf a.s-access-detail-page',
    attr: 'href',
  },
}))
.then(({detailPageUrl}) => detailPageUrl);

const searchAmazonForKindlePageUrl = uri => request(getRequestSettings(uri))
.then($ => scrapeIt.scrapeHTML($, {
  kindlePageUrl: {
    selector: '#tmmSwatches ul li a',
    attr: 'href',
  },
}))
.then(({kindlePageUrl}) => AMAZON_BASE_URL + kindlePageUrl);

const searchAmazonForAsin = uri => request(getRequestSettings(uri))
.then($ => scrapeIt.scrapeHTML($, {
  productDetails: {
    listItem: '#productDetailsTable .content ul li',
    data: {
      line: {
        how: 'text',
        convert: text => text.split(':').map(splittedText => splittedText.trim())
      }
    }
  },
}))
.then(({productDetails}) => productDetails
  .map(({line}) => line)
  .filter(line => line[0] === 'ASIN')
  .map(line => line[1])[0]
);

(async () => {
  const isbn = process.argv.slice(2)[0];
  // const isbn = '9781507204290';

  if(!isbn) {
    throw new Error('ISBN is not provided.');
  }

  const searchUrl = getSearchUrl(isbn);

  try {
    const detailPageUrl = await searchAmazonForDetailPageUrl(searchUrl);
    const kindlePageUrl = await searchAmazonForKindlePageUrl(detailPageUrl);
    const asin = await searchAmazonForAsin(kindlePageUrl);
    console.log(`ASIN: ${asin}.`); // ask for apiKey with email registration
  }
  catch(e) {
    console.log('Not found.');
  }
})();
