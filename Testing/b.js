var a = require('./a');
a.on('ready', function(data) {
  console.log(data);
  console.log('module a is ready');
});
