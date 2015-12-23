var express = require('express');
var fs = require('fs');
var readline = require('readline');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var lineReader = readline.createInterface({
    input: require('fs').createReadStream('rawdata/281941097.armv7.txt')
  });
  var counter = 0;

  var temp = [];
  var regex = /\[\s(_OBJC_CLASS_\$_|classRef_)([A-Za-z_]+)\s\s\"(.*)\"\]\:\s(\d+)/;

  var data = '';

  lineReader.on('line', function (line) {
    var qq = regex.exec(line);
    if (qq) {
      var obj = {};
      var className = qq[2];
      var methodName = qq[3];
      var callCount = qq[4];

      obj = {
        "className" : className,
        "methodName" : methodName,
        "callCount" : callCount
      }
      temp.push(obj);

    }

  }).on("close", function(){
    var proccessed = JSON.stringify(temp);
    fs.writeFile('jsonData/281941097.armv7.json', proccessed, function (err) {
      if (err) return console.log(err);
      console.log('data saved!');
    });
    console.log(temp);
  });



  res.render('index', { title: 'Express' });
});

module.exports = router;
