var React = require('react-native');
var Address = require('./address');
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    } = React;

//每个单项组件
var ItemBlock = React.createClass({
    render: function () {
        var size = {
            width: parseInt(this.props.width),
            height: parseInt(this.props.width),
            backgroundColor: this.props.color,
        };
        return (
            <TouchableOpacity onPress={this.loadPage.bind(this, this.props.data)}>
                <View style={styles.item}>
                    <View style={styles.width55}>
                        <Text
                            style={{color:'#fff', fontSize:18,fontWeight:'bold'}}>{this.props.title.substr(0, 1)}</Text>
                    </View>
                    <View style={{flexDirection:'column',flex:1}}>
                        <Text numberOfLines={2} style={styles.text}>
                            {this.props.title}
                        </Text>
                        <Text style={styles.date}>
                            {this.props.partment}
                        </Text>
                    </View>
                    <View numberOfLines={1} style={styles.m10}>
                        <Text style={styles.name}>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
    //加载页面
    _loadPage: function (e) {
        var nav = this.props.nav;
        var key = Util.key;
        var partment = this.props.partment;
        var path = Service.host + Service.getUser;

        Util.post(path, {
            key: key,
            partment: partment
        }, function (data) {
            nav.push({
                title: "人员信息",
                component: Address,
                passProps: {
                    data: data
                }
            });
        }.bind(this));
    },
    loadPage: function (data) {
        var content = data;
        this.props.nav.push({
            title: '消息详情',
            component: this.props.component,
            passProps: {
                content: content
            }
        });

    }
});

var styles = StyleSheet.create({
    itemBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 0,
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
    row: {
        height: 80,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    },
    item: {
        height: 80,
        padding: 5,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    width55: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05C147',
        marginRight: 10,
    },
    text: {
        flex: 1,
        marginBottom: 5,
        opacity: 0.7
    },
    date: {
        color: '#ccc',
        fontSize: 11,
    },
    m10: {
        marginLeft: 10
    },
    name: {
        color: '#929292',
        fontSize: 13
    }
});

module.exports = ItemBlock;