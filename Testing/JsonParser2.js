var fs = require('fs');
var readline = require('readline');
var sleep = require('sleep');
var async = require('async');
var LineByLineReader = require('line-by-line');

var regexDict = {
  fileToId : /(\d+)\.[a-zA-Z0-9]+\.txt/,
  extract : /\[\s(_OBJC_CLASS_\$_|classRef_)([A-Za-z_]+)\s\s\"(.*)\"\]\:\s(\d+)/
};

var idArr = [];
var done = 0;
fs.readdir('../rawdata', function(err, list){
  done = list.length;
  list.forEach(function(element, index){
    var idElement = regexDict.fileToId.exec(element);
    if (idElement){
      idArr.push(idElement);
    }

  });

  ParseToJSON(idArr,function(err){
    if(!err){
      //all complete
      console.log("everything complete!");
    }
  });
});




function ParseToJSON(idArr2 ,callback){
  var idElement = idArr2.pop();

  var filename = idElement[0];
  var id = idElement[1];

  var lr = new LineByLineReader('../rawdata/' + filename);

  var counter = 0;
  var temp = [];
  var data = '';
  var classList = [];

  lr.on('error', function (err) {
    console.log(err);
  	// 'err' contains error object
    callback(err);
  });

  lr.on('line', function (line) {
    var qq = regexDict.extract.exec(line);
    if (qq) {
      var obj = {};
      var className = qq[2];
      var methodName = qq[3];
      var callCount = parseInt(qq[4]);

      var cursor = classList.indexOf(className);
      //console.log(cursor);
      if (cursor == -1) {
        classList.push(className);
        var methodList = [];
        methodList.push({"methodName":methodName,"callCount":callCount});
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
          target.methodList.push({"methodName":methodName,"callCount":callCount});
        } else {
          //console.log(target);
          //console.log(target.methodList[test]);
          target.methodList[test].callCount += callCount;
        }

      }



    }
  });

  lr.on('end', function () {
    var proccessed = JSON.stringify(temp);
    fs.writeFile('../jsonData/'+ id +'.armv7.json', proccessed, function (err) {
      if (err){
        return console.log(err);
      } else {
        console.log(id+' data saved!');

        //completed
        if(idArr.length>0){
          var progress = Math.round((done - idArr.length)/done*100);
          //var progress = (done - idArr.length)/done*100;
          console.log("Progress: " + progress + "%");
          ParseToJSON(idArr,callback);
        } else {
          callback(null);
        }
      }
    });
    //completed

    //console.log(temp.length);
  });
}
