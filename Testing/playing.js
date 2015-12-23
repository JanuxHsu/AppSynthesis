var async = require('async');
//
// var a1 = [1,2,3,4,5,6,7,8];
// async.forEachSeries(a1, function(n1, callback) {
//     console.log(n1);
//     var a2 = [10,11,12,13,14];
//     async.forEachSeries(a2, function(n2, callback) {
//         console.log(n1 + " " + n2);
//         callback();
//     });
//     callback();
// });
// var a1 = [1,2,3,4,5,6,7,8];
// async.forEachSeries(a1, function(n1, callback_s1) {
//     console.log(n1);
//     callback_s1();
// });

var a1 = [1,2,3,4,5,6,7,8];
async.forEachSeries(a1, function(n1, callback_s1) {
    console.log(n1);
    var a2 = [10,11,12,13,14];
    async.forEachSeries(a2, function(n2, callback_s2) {
        console.log(n1 + " " + n2);
        callback_s2();
    }, function () {
        /* Finished the second series, now we mark the iteration of first series done */
        callback_s1();
    } );
});
