// var request = require("request");
var fs = require('fs');
var request = require('request-json');
var client = request.createClient('https://itunes.apple.com');
var regexDict = {
  fileToId : /(\d+)\.[a-zA-Z0-9]+\.txt/,
  extract : /\[\s(_OBJC_CLASS_\$_|classRef_)([A-Za-z_]+)\s\s\"(.*)\"\]\:\s(\d+)/
}



fs.readdir('../rawdata', function(err, list){
  for (var i = 1; i < 10; i++) {
    var id = regexDict.fileToId.exec(list[i]);
    if (id) {
      //console.log(id[1]);
      var url = "/us/lookup?id=" + id[1];
      client.get(url, function(err, res, body) {
        console.log(id[1]);
        try {
          console.log(body.results[0].artworkUrl100);
        } catch (e) {
          console.log(e);
        }
      });
    }
  }
});

//console.log(url);
// request({
//     url: url,
//     json: true
// }, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//       try {
//         var pic_link = body.results[0].artworkUrl100;
//         var data = {
//            app_id: id[1],
//            link: pic_link
//          }
//          fs.appendFile('message.json', JSON.stringify(data), function (err) {
//            console.log("saved!");
//          });
//       } catch (e) {
//         console.log(e);
//       }

    // if (body.results[0]['artworkUrl100']) {
    //   var pic_link = body.results[0].artworkUrl100;
    //   console.log("OK");
    // } else {
    //   console.log(body.results);
    // }
      // var data = {
      //   app_id: id,
      //   link: pic_link
      // }
      // var what = data+",";
      // fs.appendFile('message.json', data, function (err) {
      //   console.log("saved!");
      // });
