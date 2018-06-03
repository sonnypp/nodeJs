var express = require('express');

var router = express.Router();
var url = require('url');
var qs = require('querystring');
var async = require('async');
var crypto = require("crypto");
var mongoose = require("../models/db");
var person = require("../models/person");
var news = require("../models/new");

router.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("hello");
    res.end();
});


//密码加密函数
function pass_md5(string) {
    var md5 = crypto.createHash('md5');
    return md5.update(string).digest('hex'); //密码加密
}

//注册页
router.post('/reg', function (req, res) {

    var md5 = crypto.createHash('md5');
    var pwd = md5.update(req.body.password).digest('hex'); //密码加密
    // console.log(pwd);
    var data = { name: req.body.username, password: pwd };
    var entity = new person.Person(data);
    entity.save(function (error) {
        if (error) {
            res.json(error);
        }
        else {
            res.json({ msg: 1 });
        }
    });
});

//登陆页
router.post('/login', function (req, res) {

    var md5 = crypto.createHash('md5');
    var pwd = md5.update(req.body.password).digest('hex'); //密码加密
    var data = { name: req.body.username, password: pwd };
    person.Person.count(data, function (err, docs) {
        if (err) res.json(err);
        else {
            if (docs == 0) {
                res.json({ msg: 0 });
            } else {
                res.json({ msg: 1 });
            }
        }
    });
});

//密码修改
router.post('/modify/pass', function (req, res) {
    var old_pass = pass_md5(req.body.old_pass);  //旧密码
    var new_pass = pass_md5(req.body.new_pass); //新密码
    //查询数据是否正确
    person.Person.count({_id:req.body._id,password:old_pass},function(err,data){
        if(err) {
            res.json({msg:0,data:"原密码不正确"});
        } else{
            person.Person.update({_id:req.body._id,password:old_pass},{$set:{password:new_pass}},function(err,data){
                if(err) {
                    res.json({msg:0});
                } else {
                    res.json({msg:1});
                }
            });
        }
    });
});

//我的好友
router.get('/friend', function (req, res) {
    var arg1 = url.parse(req.url, true).query;
    // res.json(arg1.id);
    async.auto({
        fds: function (callback) {
            person.Person.find({ _id: arg1._id }, { friend: 1, _id: 0 }, function (err, docs) {
                if (err) throw err;
                else {
                    // res.json(docs[0]['friend']);
                    person.Person.find({ _id: docs[0]['friend'] }, { name: 1 }, function (err, docs) {
                        if (err) throw err;
                        else {
                            callback(null, docs);
                        }

                    });
                }
            });
        },
        facs: ['fds', function (results, callback) {
            // console.log(results);
            var arr = [];
            var test = results['fds'];
            for (var i = 0; i < test.length; i++) {
                arr.push(test[i]['_id']);
            }
            // console.log(arr);
            news.New.find({ u_id: arr }, { title: 1, content: 1, u_id: 1 }).sort({ "publishTime": -1 }).exec(function (err, docs) {
                if (err) throw err;
                console.log(docs);
                callback(null, docs);
            });
        }]
    }, function (err, result) {
        res.json({
            friends: result['fds'],
            facs: result['facs']
        });
    });

});

//文章添加
router.post('/article/add', function (req, res) {
    var data = { "title": req.body.title, "content": req.body.content, "u_id": req.body.u_id };
    var entity = new news.New(data);
    entity.save(function (err) {
        if (err) {
            res.json({ msg: 0 });

        } else {
            res.json({ msg: 1 });
        }
    });
});

//文章数据的修改
router.put('/article/update',function(req,res){
    //首先要进行身份验证。
    person.Person.count({_id:req.session._id,name:req.sesson.name},function(err,docs){
        if(err) throw err;
        if(docs == 0) {
            res.json({msg:0});
        } else {
            var data={$set:{"title": req.body.title, "content": req.body.content}};
            news.New.update({_id:req.body._id},data,function(err,result) {
                if(err) throw err;
                else {
                   if(result) res.json({msg:1});
                   else res.json({msg:0});
                }
            });
        }
    });
});

module.exports = router;

