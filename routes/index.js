var fs = require('fs');
var path = require('path');
var express = require('express');
var COS =  require('cos-nodejs-sdk-v5');
var router = express.Router();

var boxsource;
/* GET home page. */
var cos = new COS({
    SecretId: 'AKIDHaPhVxFWsuZhMp6TUE0H4baDPHcaqto3',
    SecretKey: 'ssTQnb63YblRdvCZTS8HKqFCdeWuf7vp',
});
function getService() {
    cos.getService(function (err, data) {
        console.log(err || data);
    });
}


getService()


function getObjectUrl(keyname) {
    var url = cos.getObjectUrl({
        Bucket: 'mybox-1251755715', // Bucket 格式：test-1250000000
        Region:'ap-beijing-1' ,
        Key: keyname,
        Expires: 60,
        Sign: true,
    }, function (err, data) {
        console.log(err || data);
    });
    console.log(url);

    return url;
}

var cosdate;
router.get('/', function(req, res, next) {

function getBucket(prefix,delimiter) {

    var params = {
        Bucket : 'mybox-1251755715',    /* 必须 */
        Region : 'ap-beijing-1',
        Prefix:prefix,
        Delimiter:delimiter

    };

    cos.getBucket(params, function(err, data) {
        if(err) {
            console.log(err);
        } else {

            // console.log(data.Contents,data.CommonPrefixes);
            cosdate=data.Contents;
            res.render('index', { message: cosdate});

        }
    });


}

  getBucket(null,'-')


});

router.get('/:list/detail',function (req, res) {


    function getBucket(prefix,delimiter) {




        var params = {
            Bucket : 'mybox-1251755715',    /* 必须 */
            Region : 'ap-beijing-1',
            Prefix:prefix,
            Delimiter:delimiter

        };

        cos.getBucket(params, function(err, data) {
            if(err) {
                console.log(err);
            } else {

                // console.log(data.Contents,data.CommonPrefixes);
                cosdate=data.Contents;
                console.log(cosdate)
                res.render('detail', { message: cosdate});

            }
        });


    }
    if(req.params.list.lastIndexOf('/')!=req.params.list.length-1){
        var resour=req.params.list.replace(/,/g,'/');
        getBucket(resour+'/',null)

    }
    else{

        getBucket(req.params.list,null)
    }




})
 /*  播放页面控制器 ，对页面传来的key进行重新拼接发起url请求，获取objecturl,并渲染播放页面 */
router.get('/:id/play', function(req, res) {
    var resour=req.params.id.replace(/,/g,'/')
    var sourname=req.params.id.substring(req.params.id.lastIndexOf(',')+1)
    console.log(resour)
    var auth = cos.getAuth({
        Method: 'get',
        Key: resour,
        Expires: 60,
    });



      var reurl= getObjectUrl(resour);
    console.log(reurl);

    res.render('play', { message: reurl , playdetail: sourname});
});


router.get('/login',function (req,res) {
    var params = {
        Bucket : 'mybox-1251755715',    /* 必须 */
        Region : 'ap-beijing-1'

    };
    cos.getBucketAcl(params, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });

    var user={
        name:"Chen-xy",
        age:"22",
        address:"bj"
    }
    req.session.user=user;
      res.redirect('/')

})


module.exports = router;
