var React = require('react-native');
var Util = require('./util');
var AddUser = require('./manager/addUser');
var ModifyPassword = require('./manager/modifyPassword');
var DeleteUser = require('./manager/deleteUser');
var PostMessage = require('./manager/postMessage');

var Config = require('./user/config');
var Download = require('./user/download');
var Favorite = require('./user/favorite');
var History = require('./user/history');
var Profile = require('./user/profile');
var Special = require('./user/special');


var {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    } = React;


var User = React.createClass({

    render: function () {
        var colors = ['#F4000B', '#17B4FF', '#FFD900', '#F00000', '#66CCFF'];
        var tags = ['S', 'F', 'H', 'D', 'C'];
        var items = ['我的专题', '我的收藏', '历史记录', '离线下载', '设置'];
        var components = [Special, Favorite, History, Download, Config];
        var JSXDOM = [];
        for (var i in items) {
            JSXDOM.push(
                <TouchableOpacity key={items[i]} onPress={this._loadPage.bind(this, components[i], items[i])}>
                    <View style={[styles.item, {flexDirection:'row'}]}>
                        <Text style={[styles.tag, {color: colors[i]}]}>{tags[i]}</Text>
                        <Text style={[styles.font,{flex:1}]}>{items[i]}</Text>
                    </View>
                </TouchableOpacity>
            );
        }


        return (
            <ScrollView style={styles.container}>
                <View key={'comic' + this.props.key} style={[styles.item,{height:90}]}>
                    <TouchableOpacity style={[styles.item,{height:90}]}
                                      onPress={this._loadPage.bind(this, Profile,"个人信息")}>
                        <Image
                            style={[styles.text,{marginLeft:10,marginTop:10}]}
                            source={{uri: "https://avatars1.githubusercontent.com/u/8215153?v=3&s=460"}}
                        />
                        <View>
                            <Text style={styles.noColor}>
                                {"便当少年"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.wrapper}>
                    {JSXDOM}
                </View>

                <View style={{marginTop:30}}>
                    <TouchableOpacity onPress={this._clear}>
                        <View style={[styles.item, {flexDirection:'row'}]}>
                            <Text style={[styles.tag, {color: colors[i]}]}>Q</Text>
                            <Text style={[styles.font,{flex:1}]}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },

    _loadPage: function (component, title) {
        this.props.navigator.push({
            title: title,
            component: component,
            passProps: {
                userId: 1 //传递过去的UserId
            }
        });
    },

    _clear: function () {
        this.props.navigator.pop();
        AsyncStorage.clear();
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    item: {
        height: 40,
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    font: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10,
    },
    wrapper: {
        marginTop: 10,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    text: {
        width: 75,
        height: 75,
        borderRadius: 4,
        marginLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noColor: {
        fontSize: 12,
        marginLeft: 5
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
        marginLeft: 5
    }
});

module.exports = User;