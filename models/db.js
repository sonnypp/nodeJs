/**
 * create 
 */
var mongoose = require("mongoose");
var db = 'mongodb://localhost:27017/blog';

mongoose.connect(db);
mongoose.connection.on('connected',function () {
    console.log("connected..");
});
mongoose.connection.on('error',function (err) {
    console.log("connected err"+err);
});
mongoose.connection.on('disconnected',function () {
    console.log("disconnected");
});
process.on('SIGINT',function () {
    mongoose.connection.close(function () {
        console.log("close");
        process.exit(0);
    });
});

exports.mongoose=mongoose;