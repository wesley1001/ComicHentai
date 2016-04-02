var fs = require('fs');
var util = require('./../util');
var MESSAGE_PATH = './database/message.json';
var USER_PATH = './database/user.json';
var COMIC_PATH = './database/comic.json';
var COMIC_TOTAL_PATH = './database/total.json';
var SPECIAL_TOTAL_PATH = './database/special_total.json';
var Message = {
    init: function (app) {
        app.post('/message/get', this.getMessage);
        app.post('/message/add', this.addMessage);
        app.post('/comic/get', this.getComic);
        app.post('/comic/search', this.searchComic);
        app.post('/special/get', this.getSpecial);
        app.post('/special/search', this.searchSpecial);
    },

    //获取公告消息
    getMessage: function (req, res) {
        var key = req.param('key');
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            });
        }
        fs.readFile(MESSAGE_PATH, function (err, data) {
            if (!err) {
                try {
                    var obj = JSON.parse(data);
                    return res.send({
                        status: 1,
                        data: obj
                    });
                } catch (e) {
                    return res.send({
                        status: 0,
                        err: e
                    });
                }
            }
            return res.send({
                status: 0,
                err: err
            });
        });
    },

    /**
     * 搜素漫画信息
     * @param req
     * @param res
     * @returns {*}
     */
    searchComic: function (req, res) {
        var key = req.param('key');
        var page = req.param('page');
        var keyWord = req.param('keyWord');
        if (page == null || page == undefined) {
            page = 0;
        }
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            });
        }

        if (keyWord == undefined) {
            keyWord = ' ';
        }
        console.log("搜素关键字为:" + keyWord);
        fs.readFile(COMIC_TOTAL_PATH, function (err, data) {
            if (!err) {
                try {
                    var count = 0;
                    var obj = JSON.parse(data);
                    var resultList = [];
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].comicTitle.indexOf(keyWord) != -1) {
                            count++;
                            resultList.push(obj[i]);
                            if (count > 10) {
                                break;
                            }
                        }
                    }
                    console.log("个数为" + count);
                    return res.send({
                        status: 1,
                        data: resultList
                    });
                } catch (e) {
                    console.log(e);
                    return res.send({
                        status: 0,
                        err: e
                    });
                }
            }
            return res.send({
                status: 0,
                err: err
            });
        });
    },

    /**
     * 查询漫画信息
     * @param req
     * @param res
     * @returns {*}
     */
    getComic: function (req, res) {
        var key = req.param('key');
        var page = req.param('page');
        var comicId = req.param('comicId');
        var path = ['./database/comic.json', './database/comic1.json', './database/comic2.json', './database/comic3.json']
        if (page == null || page == undefined) {
            page = 0;
        }
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            });
        }

        if (comicId != null && comicId != undefined) {
            console.log("漫画ID:" + comicId);
            fs.readFile(COMIC_TOTAL_PATH, function (err, data) {
                if (!err) {
                    try {
                        var obj = JSON.parse(data);
                        for (var i = 0; i < obj.length; i++) {
                            if (obj[i].comicId == comicId) {
                                console.log(obj[i]);
                                return res.send({
                                    status: 1,
                                    data: obj[i]
                                });
                            }
                        }
                    } catch (e) {
                        return res.send({
                            status: 0,
                            err: e
                        });
                    }
                }
                return res.send({
                    status: 0,
                    err: err
                });
            });
        } else {
            console.log("当前为第" + page + "页")
            fs.readFile(path[page % 4], function (err, data) {
                if (!err) {
                    try {
                        var obj = JSON.parse(data);
                        console.log(obj);
                        return res.send({
                            status: 1,
                            data: obj
                        });
                    } catch (e) {
                        return res.send({
                            status: 0,
                            err: e
                        });
                    }
                }
                return res.send({
                    status: 0,
                    err: err
                });
            });
        }
    },


    /**
     * 获取专题信息
     * @param req
     * @param res
     * @returns {*}
     */
    getSpecial: function (req, res) {
        var key = req.param('key');
        var page = req.param('page');
        var specialId = req.param('id');
        var path = ['./database/special.json', './database/special1.json', './database/special2.json', './database/special3.json'];
        if (page == null || page == undefined) {
            page = 0;
        }
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            });
        }
        if (specialId != null && specialId != undefined) {
            try {
                var specialJson = JSON.parse(fs.readFileSync(SPECIAL_TOTAL_PATH));
                var comicJson = JSON.parse(fs.readFileSync(COMIC_TOTAL_PATH));
                var result = [];
                var count = 0;

                for (var i = 0; i < specialJson.length; i++) {
                    if (specialId == specialJson[i].id) {
                        var comicIdList = specialJson[i].comicIdList;
                        if(comicIdList == undefined){
                            comicIdList = []
                        }
                        for(var k = 0 ; k < 25 ; k++){
                            var randomIndex = Math.floor(Math.random() * (comicJson.length));
                            comicIdList.push(comicJson[randomIndex].comicId);
                        }
                        for (var j = 0; j < comicJson.length; j++) {
                            if (comicIdList.indexOf(comicJson[j].comicId) != -1) {
                                count++;
                                result.push(comicJson[j]);
                                if (count >= 10) {
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log(result);
                return res.send({
                    status: 1,
                    data: result
                });
            }
            catch (e) {
                console.log(e);
            }

        } else {
            console.log("当前为第" + page + "页");
            fs.readFile(path[page % 4], function (err, data) {
                if (!err) {
                    try {
                        var obj = JSON.parse(data);
                        console.log(obj);
                        return res.send({
                            status: 1,
                            data: obj
                        });
                    } catch (e) {
                        return res.send({
                            status: 0,
                            err: e
                        });
                    }
                }
                return res.send({
                    status: 0,
                    err: err
                });
            });
        }
    },
    /**
     * 搜素专题信息
     * @param req
     * @param res
     * @returns {*}
     */
    searchSpecial: function (req, res) {
        var key = req.param('key');
        var page = req.param('page');
        var keyWord = req.param('keyWord');
        if (page == null || page == undefined) {
            page = 0;
        }
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            });
        }

        if (keyWord == undefined) {
            keyWord = ' ';
        }
        console.log("搜素关键字为:" + keyWord);
        fs.readFile(COMIC_TOTAL_PATH, function (err, data) {
            if (!err) {
                try {
                    var count = 0;
                    var obj = JSON.parse(data);
                    var resultList = [];
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].comicTitle.indexOf(keyWord) != -1) {
                            count++;
                            resultList.push(obj[i]);
                            if (count > 10) {
                                break;
                            }
                        }
                    }
                    console.log("个数为" + count);
                    return res.send({
                        status: 1,
                        data: resultList
                    });
                } catch (e) {
                    console.log(e);
                    return res.send({
                        status: 0,
                        err: e
                    });
                }
            }
            return res.send({
                status: 0,
                err: err
            });
        });
    },


    //增加公告消息
    addMessage: function (req, res) {
        var token = req.param('token');
        var message = req.param('message');
        if (!token || !message) {
            return res.send({
                status: 0,
                err: 'token或者message不能为空'
            });
        }
        //根据token查询
        fs.readFile(USER_PATH, function (err, data) {
            if (err) {
                return res.send({
                    status: 0,
                    err: err
                });
            }

            try {
                var obj = JSON.parse(data);
                for (var i in obj) {
                    if (obj[i].token === token) {
                        //增加信息
                        var msgObj = JSON.parse(fs.readFileSync(MESSAGE_PATH));
                        msgObj.push({
                            messageid: util.guid(),
                            userid: obj[i].userid,
                            username: obj[i].username,
                            time: new Date().getFullYear() + '-'
                            + (parseInt(new Date().getMonth()) + 1) + '-' + new Date().getDate(),
                            message: message
                        });

                        fs.writeFileSync(MESSAGE_PATH, JSON.stringify(msgObj));
                        return res.send({
                            status: 1
                        });
                    }
                }

                return res.send({
                    status: 0,
                    err: 'token认证失败'
                });

            } catch (e) {
                return res.send({
                    status: 0,
                    err: e
                });
            }
        });

    }

};

module.exports = Message;