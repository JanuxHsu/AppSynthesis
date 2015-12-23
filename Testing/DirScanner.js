var fs = require('fs');

module.exports = function(callback){
  console.log("dwdw");
  var test = "dwhb";
  fs.readdir('../rawdata', function(err, list){
    test = list;
  });
  return test;
};
