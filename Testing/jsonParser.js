var fs = require('fs');
var readline = require('readline');
var sleep = require('sleep');
var async = require('async');
var LineByLineReader = require('line-by-line');

var regexDict = {
  fileToId : /(\d+)\.[a-zA-Z0-9]+\.txt/,
  extract : /\[\s(_OBJC_CLASS_\$_|classRef_)([A-Za-z_]+)\s\s\"(.*)\"\]\:\s(\d+)/
};




fs.readdir('../rawdata', function(err, list){
  list.forEach(function(element, index){
    sleep.sleep(1);
    var id = regexDict.fileToId.exec(element);
    if (id){
      ParseToJSON(id[0], id[1]);
    }
  });
});

// fs.readdir('../rawdata', function(err, list){
//   async.forEachSeries(list, function(item, callback_s1) {
//       //console.log(item);
//       var id = regexDict.fileToId.exec(item);
//       if(id){
//         ParseToJSON(id[0], id[1], callback_s1());
//       } else {
//         callback_s1();
//       }
//   });
// });


// fs.readdir('../rawdata', function(err, list){
//   for(var i in list){
//     if(i < 100 && i > 0){
//       var id = regexDict.fileToId.exec(list[i]);
//       if(id){
//         ParseToJSON(id[0], id[1])
//       }
//     }
//   }
// });


function ParseToJSON(filename, id){
  // var lineReader = readline.createInterface({
  //   input: require('fs').createReadStream('../rawdata/'+ filename)
  // });

  var lr = new LineByLineReader('../rawdata/' + filename);

  var counter = 0;

  var temp = [];

  var data = '';
  var classList = [];

  lr.on('error', function (err) {
    console.log(err);
  	// 'err' contains error object
  });

  lr.on('line', function (line) {
    var qq = regexDict.extract.exec(line);
    if (qq) {
      var obj = {};
      var className = qq[2];
      var methodName = qq[3];
      var callCount = qq[4];

      var cursor = classList.indexOf(className);
      //console.log(cursor);
      if (cursor == -1) {
        classList.push(className);
        var methodList = [];
        methodList.push({"methodName":methodName,"callCount":1});
        obj = {
          "className" : className,
          "methodList" : methodList,
        };
        temp.push(obj);
      } else {
        var target = temp[cursor];
        var test = target.methodList.map(function(e) { return e.methodName; }).indexOf(methodName);
        //console.log(temp);
        if (test == -1) {
          target.methodList.push({"methodName":methodName,"callCount":1});
        } else {
          //console.log(target.methodList[test]);
          target.methodList[test].callCount += 1;
        }

      }


    }
  });

  lr.on('end', function () {
    lineReader.input.destroy();
    var proccessed = JSON.stringify(temp);
    fs.writeFile('../jsonData/'+ id +'.armv7.json', proccessed, function (err) {
      if (err) return console.log(err);
      console.log(id+' data saved!');
    });
    //console.log(temp.length);
  });
}
