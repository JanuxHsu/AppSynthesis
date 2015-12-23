var fs = require('fs');

fs.readdir('../jsonData', function(err, list){
  console.log(list.length);
});
