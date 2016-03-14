var React = require('react-native');
var Util = require('./util');
var AddUser = require('./manager/addUser');
var ModifyPassword = require('./manager/modifyPassword');
var DeleteUser = require('./manager/deleteUser');
var PostMessage = require('./manager/postMessage');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    TabBarIOS,
    NavigatorIOS,
    AppRegistry,
    Image,
    TextInput,
    StatusBarIOS,
    TouchableHighlight,
    ActivityIndicatorIOS,
    AlertIOS,
    } = React;


var User = React.createClass({

    /**
     * 初始值
     * @returns {{selectedTab: string, showIndex: {height: number, opacity: number}, showLogin: {flex: number, opacity: number}, isLoadingShow: boolean}}
     * */
    getInitialState: function () {
        return {
            showIndex: {
                height: 0,
                opacity: 0
            },
            showLogin: {
                flex: 1,
                opacity: 1
            },
            isLoadingShow: false
        };
    },

    /**
     * 验证token是否合法
     */
    componentDidMount: function () {
        var that = this;
        AsyncStorage.getItem('token', function (err, token) {
            if (!err && token) {
                var path = Service.host + Service.loginByToken;
                Util.post(path, {
                    token: token
                }, function (data) {
                    if (data.status) {
                        that.setState({
                            showLogin: {
                                height: 0,
                                width: 0,
                                flex: 0,
                            },
                            showIndex: {
                                flex: 1,
                                opacity: 1
                            },
                            isLoadingShow: false
                        });
                    }
                });
            } else {
                that.setState({
                    showIndex: {
                        height: 0,
                        opacity: 0
                    },
                    showLogin: {
                        flex: 1,
                        opacity: 1
                    },
                    isLoadingShow: false
                });
            }
        });

        var path = Service.host + Service.getMessage;
        var that = this;
        Util.post(path, {
            key: Util.key
        }, function (data) {
            that.setState({
                data: data
            });
        });
    },

    _getEmail: function (val) {
        var email = val;
        this.setState({
            email: email
        });
    },

    _getPassword: function (val) {
        var password = val;
        this.setState({
            password: password
        });
    },

    _login: function () {
        var email = this.state.email;
        var password = this.state.password;
        var path = Service.host + Service.login;
        var that = this;

        //隐藏登录页 & 加载loading
        that.setState({
            showLogin: {
                height: 0,
                width: 0,
                flex: 0,
            },
            isLoadingShow: true
        });
        AdSupportIOS.getAdvertisingTrackingEnabled(function () {
            AdSupportIOS.getAdvertisingId(function (deviceId) {
                Util.post(path, {
                    email: email,
                    password: password,
                    deviceId: deviceId,
                }, function (data) {
                    if (data.status) {
                        var user = data.data;
                        //加入数据到本地
                        AsyncStorage.multiSet([
                            ['username', user.username],
                            ['token', user.token],
                            ['userid', user.userid],
                            ['email', user.email],
                            ['tel', user.tel],
                            ['partment', user.partment],
                            ['tag', user.tag],
                        ], function (err) {
                            if (!err) {
                                that.setState({
                                    showLogin: {
                                        height: 0,
                                        width: 0,
                                        flex: 0,
                                    },
                                    showIndex: {
                                        flex: 1,
                                        opacity: 1
                                    },
                                    isLoadingShow: false
                                });
                            }
                        });

                    } else {
                        AlertIOS.alert('登录', '用户名或者密码错误');
                        that.setState({
                            showLogin: {
                                flex: 1,
                                opacity: 1
                            },
                            showIndex: {
                                height: 0,
                                width: 0,
                                flex: 0,
                            },
                            isLoadingShow: false
                        });
                    }
                });
            }, function () {
                AlertIOS.alert('设置', '无法获取设备唯一标识');
            });
        }, function () {
            AlertIOS.alert('设置', '无法获取设备唯一标识，请关闭设置->隐私->广告->限制广告跟踪');
        });
    },

    render: function () {
        var colors = ['#F4000B', '#17B4FF', '#FFD900', '#F00000'];
        var tags = ['U', 'A', 'D', 'M'];
        var items = ['修改密码', '增加联系人', '删除联系人', '发布公告'];
        var components = [ModifyPassword, AddUser, DeleteUser, PostMessage];
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
            <View>

                {this.state.isLoadingShow ?
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicatorIOS size="small" color="#268DFF"></ActivityIndicatorIOS>
                    </View> : null
                }
                {!this.state.isLoadingShow ?
                    <View style={this.state.showIndex}>
                        <ScrollView style={styles.container}>
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
                    </View>
                    : null
                }


                <ScrollView style={[this.state.showLogin]}>
                    <View style={styles.container}>
                        <View>
                            <Image style={styles.logo} source={require('image!logo')}></Image>
                        </View>

                        <View style={styles.inputRow}>
                            <Text>邮箱</Text><TextInput style={styles.input} placeholder="请输入邮箱"
                                                      onChangeText={this._getEmail}/>
                        </View>
                        <View style={styles.inputRow}>
                            <Text>密码</Text><TextInput style={styles.input} placeholder="请输入密码" password={true}
                                                      onChangeText={this._getPassword}/>
                        </View>

                        <View>
                            <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login}>
                                <Text style={{color:'#fff'}}>登录</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    },

    _loadPage: function (component, title) {
        this.props.navigator.push({
            title: title,
            component: component
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
        justifyContent: 'center',
        borderTopWidth: Util.pixel,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    font: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10,
    },
    wrapper: {
        marginTop: 30,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    input: {
        marginLeft: 10,
        width: 220,
        borderWidth: Util.pixel,
        height: 35,
        paddingLeft: 8,
        borderRadius: 5,
        borderColor: '#ccc'
    },
    btn: {
        marginTop: 10,
        width: 80,
        height: 35,
        backgroundColor: '#3BC1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: Image.resizeMode.contain
    },
});

module.exports = User;