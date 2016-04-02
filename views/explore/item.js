var React = require('react-native');
var Detail = require('./detail');
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    Image,
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
            <TouchableHighlight key={this.props.id} style={{marginTop:10}} underlayColor="#fff"
                                onPress={this._loadPage}>
                <View style={[styles.itemBlock, size]}>
                    <Image
                        style={[styles.text]}
                        source={{uri: this.props.coverImage}}
                    />
                    <View style={{marginTop:5}}>
                        <Text style={styles.font12}>{this.props.title}</Text>
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
        var id = this.props.id;
        var path = Service.host + Service.getSpecial;
        //跳转到Detail页
        Util.post(path, {
            key: key,
            title: title,
            id: id
        }, function (data) {
            nav.push({
                title: title,
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
    text: {
        width: Math.floor(((Util.size.width - 20)) / 3),
        height: Math.floor(((Util.size.width - 20)) / 3) - 10,
        borderRadius: 4,
        marginLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    font18: {
        fontSize: 18,
        fontWeight: '500',
    },
    font12: {
        fontSize: 12,
    },
});

module.exports = Item;