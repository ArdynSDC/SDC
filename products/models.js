const pool = require('./db.js');

const getProducts = (page=1, count=5, callback) => {
  var queryStr = `select * from products limit ${count} offset ${(page - 1) * count}`;
  pool.query(queryStr, (err, results) => {
    console.log(results.rows);
    callback(err, results.rows);
  });
}

const getInfo = (id, callback) => {
  var queryStr = `select * from products p, features f where p.id = ${id} and f.product_id = ${id}`;
  pool.query(queryStr, (err, results)  => {
    // Data formatting
    var helperObj = results.rows[0];
    helperObj.features = [];
    // Push new feature to features
    for (var i = 0; i < results.rows.length; i++) {
      var newFeature = {
        feature: results.rows[i].feature,
        value: results.rows[i].value
      };
      helperObj.features.push(newFeature);
    }
    // More formatting to match API
    helperObj.id = helperObj.product_id;
    delete helperObj.product_id;
    delete helperObj.feature;
    delete helperObj.value;
    console.log(helperObj);
    callback(err, helperObj);
  });
}

const getStyles = (id, callback) => {
  var queryStr = `select * from styles s, photos p where s.productId = ${id} and p.styleID = s.id`;
  //  and sku.styleID = s.id;
  // add photos and skus
  pool.query(queryStr, (err, results)  => {
    var helperObj = {
      product_id: id,
      results: []
    };

  // Format and add all unique styles to helperObj.results
    var helperArr = [];
    for (var i = 0; i < results.rows.length; i++) {
      var currentObj = results.rows[i];
      if (!helperArr.includes(currentObj.styleid)) {
        helperArr.push(currentObj.styleid);
        // Format
        delete currentObj.id;
        delete currentObj.productid;
        currentObj.style_id = currentObj.styleid;
        delete currentObj.styleid;
        if (currentObj.sale_price === 'null') {
          currentObj.sale_price = 0;
        }
        currentObj['default?'] = currentObj.default_style;
        delete currentObj.default_style;
        // Add photos and skus
        currentObj.photos = [];
        var firstPhoto = {
          thumbnail_url: currentObj.thumbnail_url,
          url: currentObj.url
        }
        currentObj.photos.push(firstPhoto);
        delete currentObj.thumbnail_url;
        delete currentObj.url;
        currentObj.skus = {};
        // Push formatted object
        helperObj.results.push(currentObj);
      }
    }

    console.log(helperObj.results);
    callback(err, helperObj.results);
  });

}
const getRelated = (id, callback) => {
  var queryStr = `select related_product_id from related where current_product_id = ${id}`;
  pool.query(queryStr, (err, results)  => {
    // Data formatting
    var helperArr =[];

    // Push each object value to helperArr
    for (var i = 0; i < results.rows.length; i++) {
      helperArr.push(results.rows[i].related_product_id);
    }
    console.log(helperArr.results);
    callback(err, helperArr.results);
  });
}

module.exports = {
  getProducts,
  getInfo,
  getStyles,
  getRelated
}

