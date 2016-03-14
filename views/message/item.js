/**
 * 单行消息
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('../util');
var Service = require('../service');

var {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    } = React;

var Item = React.createClass({
    render: function () {
        return (
            //每一行的消息都由一个不透明触摸来储存
            <TouchableOpacity onPress={this.loadPage.bind(this, this.props.data)}>
                <View style={styles.item}>
                    <!-- 左侧图标 -->
                    <View style={styles.width55}>
                        <Text
                            style={{color:'#fff', fontSize:18,fontWeight:'bold'}}>{this.props.name.substr(0, 1)}</Text>
                    </View>
                    <!-- 消息的内容 -->
                    <View style={{flexDirection:'column',flex:1}}>
                        <Text numberOfLines={2} style={styles.text}>
                            {this.props.text}
                        </Text>
                        <!-- 消息的时间 -->
                        <Text style={styles.date}>
                            {this.props.date}
                        </Text>
                    </View>
                    <!-- 消息发布人 -->
                    <View numberOfLines={1} style={styles.m10}>
                        <Text style={styles.name}>{this.props.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
    //向详情页跳转
    loadPage: function (data) {
        //替换变量
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
        marginLeft: 10,
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

module.exports = Item;
