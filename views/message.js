/**
 * 消息页
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
var Item = require('./message/item');
var Detail = require('./message/detail');
var Service = require('./service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    } = React;

var Message = React.createClass({
    render: function () {
        //获取所有的信息
        var contents = [];
        //这个是消息列表
        var items = [];
        //这个是主页传过来的数据
        if (this.props.data.status) {
            //赋值
            contents = this.props.data.data;
        }
        //迭代添加
        for (var i = 0; i < contents.length; i++) {
            items.push(
                <!-- 使用Item标签 -->
                <Item
                    data={contents[i]}
                    nav={this.props.navigator}
                    component={Detail}
                    key={contents[i].messageid}
                    text={contents[i].message}
                    name={contents[i].username}
                    date={contents[i].time}/>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <!-- 搜索框 -->
                <View style={{height:50,padding:7,}}>
                    <TextInput style={styles.search} placeholder="搜索"/>
                </View>
                <!-- 消息 -->
                <View style={{backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                    {items}
                    <View style={{height:35}}></View>
                </View>
            </ScrollView>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column'
    },
    search: {
        height: 35,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    }
});
//消息列表
module.exports = Message;