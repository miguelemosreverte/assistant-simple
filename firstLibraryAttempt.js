
var request = require('request');




exports.MeLiPromise = new Promise((resolve, reject) => {
    request('https://api.mercadolibre.com/users/226384143/', function (err, response, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });

});



exports.googlePromise = new Promise((resolve, reject) => {
    request('http://www.google.com', function (err, response, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });

});
