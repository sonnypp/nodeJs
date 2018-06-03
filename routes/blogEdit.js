/**
 * Ceated
 */

const express = require('express');
const router = express.Router();

var mongoose = require('../models/db');
var cat = require('../models/cats');
var content = require('../models/user');
var async = require('async');

exports.blog_edit = function(req,res) {
    //查找文章类别
    async.parallel({   //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其他函数先执行

        getCat:function(callback){
            var blog_cats = [];
            car.Cat.find({"name":req.session.username},function(err,docs){
                if(err) {
                    res.render("error");
                } else {
                    for(var i = 0;i<docs.length;i++) {
                        blog_cats.push(docs[i].catname);
                    }
                    callback(null.blog_cats);
                }
            });
            ;
        },
        getContent:function(callback) {
            cat.Cat.find({name:req.session.username},function(err,docs){
                if(err) {
                    res.render("error");
                } else {
                    var catsNum = {},result2 =[];

                    async.mapSeries(docs,function(dd,callback1){
                        content.Content.find({name:req.session.username,cat:dd['catname']},function(err,rs){
                            catsNum[dd['catname']] = rs.length;

                            callback(null,catsNum);
                        });
                    },function(err,results){
                        result2  = results;
                        callback(null,result2);
                    });
                }
            })
        }
    },function(err,results){
        res.render('blogEdits',{
            title:"博客编辑页",
            username:req.session.username,
            userSeesion:req.session.username,
            imgUrl:req.session.imgUrl,
            data:new Date(),
            cats:results['getCat'],
            content:results['getContent'],
            catsNum:results['getCatsNum']
        });
    });
}


//将文本编辑器里的内容传给后台的数据库 及其更新博客内容
exports.blog_updateBlog = function(req,res) {
    //上传内容
    if(req.body.role ==1 ) //销毁session
    {
        req.session.username = null;
        res.json({msg:1});
    } else if(req.body.role == 2) {
        //上传博客内容

        var titlePic = "";
        var con = req.body.con_text;
        //匹配图片（g表示匹配所有结果i表示区分大小写）
        var imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = con[0].match(imgReg);
        if(arr == null) {
            titlePic = "/images/ex02.jpg";
        } else {
            titlePic = arr[0].match(srcReg)[1];
        }

        var entity = new content.Content({"name": req.session.username,"title":req.body.title,"titlePic":titlePic,"text":req.body.text,"content":req.body.con_text,"time":req.body.data,"cat":req.body.cat,click:0});
        entity.save();
        res.json({msg:1});
    } else if(req.body.type==3) {
        //删除博客
        var query = {"name":req.session.username,"title":req.body.title,"cat":req.body.cat};
        content.Content.remove(query,function(err,docs){
            res.json({msg:1});
        });
    } else if(req.body.type == 4) {
        //更新分类
        var query1 = {"name":req.session.username,"title":req.body.title,"catname":req.body.catNameOld};
        cat.Cat.update(query1,{$set:{catname:req.body.catNameNew}},function(err,docs){
            if(err){
                res.render("error");
            }
        });

        var query2 = {"name":req.session.username,"catname":req.body.catNameOld};
        content.Content.update(query2,{$set:{catname:req.body.catNameNew}},function(err,docs){
            if(err) {
                res.render("error");
            }
        });
        res.json({msg:1});
    } else if(req.body.type == 5) {
        //上传分类
        var query = {"name":req.session.username,"catname":req.body.catsAdd};
        cat.Cat.find(query,function(err,docs){
            if(docs!=0) {
                res.json({msg:0});
            } else {
                var entity = new cat.Cat(query);
                entity.save();
                res.json({msg:1});
            }
        });
    } else if(req.body.type == 6) {
        //获取初始化内容
        var query = {"name":req.session.username,"title":req.body.title,"cat":req.body.cat};

        content.Content.find(query,function(err,docs){
            if(err) {
                res.render("error");
            } else {
                res.json({msg:docs});
            }
        });
    } else if(req.body.type == 7) {
        //更新博客内容；
        var titlePic="";
        var con=req.body.con_text;
        //匹配图片（g表示匹配所有结果i表示区分大小写）
        var imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = con[0].match(imgReg);
        if(arr==null){
            titlePic="/images/ex02.jpg"
        }else {
            titlePic=arr[0].match(srcReg)[1];
        }
        var query = {"name":req.session.username,"title":req.body.title,"cat":req.body.cat};
        var updateData = {$set:{"title":req.body.title,"content":req.body.con_text,"text":req.body.text,"titlePic":titlePic}};
        content.Content.update(query,updateData,function(err,docs){
            if(err) res.render("error");
            res.json({msg:1});
        });
    } else if(req.body.type == 8) {
        //文章收藏

    }
};

exports.updateC = function(req,res) {
    var imgurl4 = "";
    var query5 = {"name":req.session.username};
    async.parallel({
        getContent:function(callback) {
            content.Content.find({"name":req.session.username,"title":req.query.title,"cat":req.query.cat},function(err,docs){
                if(err) {
                    res.render("error");
                } else {
                    callback(null,docs);
                }
            });
        },
        getImgUrl:function(callback) {
            user.User.find(query5,function(err,docs){
                if(err) {
                    res.render("error");
                } else {
                    if(docs.length == 0) {
                        imgurl4 = "/images/touxiang/Koala.jpg";
                    } else {
                        imgurl4=urlHandle(docs[0]['pic']);
                    }
                    req.session.username = query5.name;
                    req.session.password =  query5.password;
                }
                callback(null,imgurl4);
            });
        }
    },function(err,results){
        res.render('blogUpdate',{
            title:"博客更新",
            username:query5.name,
            userSession:req.session.username,
            contents:results['getContent'],
            imgUrl:results['getImgUrl']
        });
    });
};

function urlHandle(url) {
    var str=url.replace(/\\/g,"/");
    return str.replace(/public/g,"")
}