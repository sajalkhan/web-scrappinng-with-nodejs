const stringSimilarity = require("string-similarity");

const findMatchingProducts = (starTechProducts, ryansProducts) => {
  const comparedProducts = [];

  // Iterate through starTech products
  starTechProducts.forEach(starTechProduct => {
    // Find the best matching product in ryans based on a fuzzy string comparison
    const { bestMatchIndex } = stringSimilarity.findBestMatch(
      starTechProduct.name,
      ryansProducts.map(ryansProduct => ryansProduct.name),
    );

    // Extract the best match from ryans
    const ryansProduct = ryansProducts[bestMatchIndex];

    // If a matching product is found in ryans, compare their prices
    if (ryansProduct) {
      const priceDifference = parseInt(starTechProduct.price) - parseInt(ryansProduct.price);

      if (priceDifference >= 0 && priceDifference < 3000) {
        const product = {
          productName: starTechProduct.name,
          starTechPrice: starTechProduct.price,
          ryansPrice: ryansProduct.price,
          priceDifference,
        };

        comparedProducts.push(product);
      }
    }
  });

  return comparedProducts;
};

module.exports = findMatchingProducts;
