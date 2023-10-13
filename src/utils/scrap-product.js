const scrapData = require("./scrap-data");

function getProductURLs(apiUrl, pages) {
  const productURLs = [];

  for (let page = 1; page <= pages; page++) {
    const productURL = `${apiUrl}?page=${page}`;
    productURLs.push(productURL);
  }

  return productURLs;
}

async function scrapeProducts(apiUrl, config) {
  const productURLs = getProductURLs(apiUrl, config.page);

  const products = await Promise.all(
    productURLs.map(async productURL => {
      return await scrapData(productURL, config);
    }),
  );

  const allProducts = products.reduce((acc, products) => {
    return acc.concat(products);
  }, []);

  return allProducts;
}

module.exports = scrapeProducts;
