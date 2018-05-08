// Load the Cloudant library.
var Cloudant = require('cloudant');

var me = 'deb7a053-8395-4883-a5c1-e8a1c2f07d24-bluemix'; // Set this to your own account
var password = process.env.CLOUDANT_PASSWORD;

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

var db = cloudant.db.use("prima1");



exports.getData = new Promise((resolve, reject) => {
    db.get("ae4542472a088699e12e2ed1e18a5e70",  function (err, data) {
      if (err) {
        reject(err);
      }


      var deducible = "a"
      var edad = "19 a 24"
      console.log("getPrima successfull: " + data[deducible][edad]);

      resolve(data);
    });

});
