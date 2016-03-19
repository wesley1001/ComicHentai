var React = require('react-native');
var Detail = require('./detail');
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    } = React;

//单个专题内容,在首页展示
var Item = React.createClass({
    render: function () {
        var size = {
            width: parseInt(this.props.width),
            height: parseInt(this.props.width),
            backgroundColor: this.props.color,
        };
        //显示专题的标题和封面
        return (
            <TouchableHighlight underlayColor="#fff" onPress={this._loadPage}>
                <View style={[styles.itemBlock, size]}>
                    <View>
                        <Text style={styles.font18}>封面</Text>
                    </View>
                    <View>
                        <Text style={styles.font10}>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    //加载页面
    _loadPage: function (e) {
        var nav = this.props.nav;
        var key = Util.key;
        var title = this.props.title;
        var path = Service.host + Service.getUser;
        //跳转到Detail页
        Util.post(path, {
            key: key,
            title: title
        }, function (data) {
            nav.push({
                title: "专题信息",
                component: Detail,
                passProps: {
                    data: data
                }
            });
        }.bind(this));

    }
});

var styles = StyleSheet.create({
    itemBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 10,
    },
    font18: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    font10: {
        color: '#fff',
        fontSize: 10,
    },
});

module.exports = Item;