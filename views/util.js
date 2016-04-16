var React = require('react-native');
var Dimensions = require('Dimensions');
var CryptoJS = require("crypto-js");

var {
    PixelRatio
    } = React;

var Util = {

    //单位像素
    pixel: 1 / PixelRatio.get(),
    //屏幕尺寸
    size: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    AES_KEY: "xComicHentai6537",
    AES_IV: "4798145623545678",
    //post请求
    post: function (url, data, callback) {
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
            .then((response) => {
                response.text()
            })
            .then((responseText) => {
                callback(JSON.parse(responseText));
            });
    },
    //post请求
    post_json: function (url, data, callback) {
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((responseText) => {
                callback((responseText));
            })
            .done();
    },
    //get请求
    _get: function (url, data, callback) {

        var fetchOptions = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };

        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                callback(JSON.parse(responseText));
            });
    },
    encode: function (obj) {
        var parts = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return "?" + parts.join('&');
    },
    encrypt: function (word) {
        var key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        var iv = CryptoJS.enc.Utf8.parse(this.AES_IV);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    ,
    decrypt: function (word) {
        var key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        var iv = CryptoJS.enc.Utf8.parse(this.AES_IV);
        var decrypted = CryptoJS.AES.decrypt(word, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    },
    //Key
    key: 'HSHHSGSGGSTWSYWSYUSUWSHWBS-REACT-NATIVE'

};

module.exports = Util;