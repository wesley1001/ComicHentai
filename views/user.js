var React = require('react-native');
var Util = require('./util');
var Service = require('./service')
var Config = require('./user/config');
var Download = require('./user/download');
var Favorite = require('./user/favorite');
var History = require('./user/history');
var Profile = require('./user/profile');
var Special = require('./user/special');
var AdSupportIOS = require('AdSupportIOS');

var {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    TouchableHighlight,
    ActivityIndicatorIOS,
    AlertIOS,
    } = React;


var User = React.createClass({

    getInitialState: function () {
        return {
            //默认不显示内容
            showIndex: {
                height: 0,
                opacity: 0
            },
            //显示登录界面
            showLogin: {
                flex: 1,
                opacity: 1
            },
            isLogin: false,
            showRegister: false,
            isLoadingShow: false
        };
    },

    /**
     * 载入之前验证是否登录
     */
    componentWillMount: function () {
        var that = this;
        //获取Token
        AsyncStorage.getItem('token', function (err, token) {
            if (!err && token) {
                //如果正常
                var path = Service.host + Service.loginByToken;
                //验证Token
                Util.post(path, {
                    token: token
                }, function (data) {
                    if (data.status) {
                        //变更显示状态
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
                            isLogin: true,
                            isLoadingShow: false
                        });
                    }
                });
            }
            //否则,显示要求登录
            else {
                that.setState({
                    showIndex: {
                        height: 0,
                        opacity: 0
                    },
                    showLogin: {
                        flex: 1,
                        opacity: 1
                    },
                    isLogin: false,
                    isLoadingShow: false
                });
            }
        });
    },

    /**
     * 获得用户名
     * @param val
     * @private
     */
    _getEmail: function (val) {
        var email = val;
        this.setState({
            email: email
        });
    },

    /**
     * 获得密码
     * @param val
     * @private
     */
    _getPassword: function (val) {
        var password = val;
        this.setState({
            password: password
        });
    },

    _backToLogin: function () {
        this.setState({
            showRegister: false
        });
    },

    _swapToRegister: function () {
        this.setState({
            showRegister: true
        });
    },


    _getNickName: function (val) {
        this.setState({
            nickname: val
        });
    },


    /**
     * 注册操作
     * @private
     */
    _register: function () {
        var email = this.state.email;
        var nickname = this.state.nickname;
        var password = this.state.password;
        var path = Service.host + Service.register;
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
                    nickname: nickname,
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
                                AlertIOS.alert('注册', '注册成功!正在跳转');
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
                                    isLogin: true,
                                    showRegister: false,
                                    isLoadingShow: false
                                });
                            }
                        });

                    } else {
                        AlertIOS.alert('错误', '用户名或者密码错误');
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
                            isLogin: false,
                            isLoadingShow: false,
                            showRegister: true,
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

    /**
     * 登录操作
     * @private
     */
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
                                    isLogin: true,
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
                            isLogin: false,
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

    renderUserInfo: function () {
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

    renderLogin: function () {
        var buttons = null;
        var nickname = null;
        if (this.state.showRegister) {
            nickname = (<View style={styles.inputRow}>
                <Text>昵称</Text><TextInput style={styles.input} placeholder="请输入昵称" clearButtonMode="always"
                                          autoCapitalize="none" autoCorrect={false}
                                          onChangeText={this._getNickName}/>
            </View>);
            buttons = ( <View>
                <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._register}>
                    <Text style={{color:'#fff'}}>完成注册</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._backToLogin}>
                    <Text style={{color:'#fff'}}>取消</Text>
                </TouchableHighlight>
            </View>);
        } else {
            buttons = (<View>
                <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._swapToRegister}>
                    <Text style={{color:'#fff'}}>注册</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login}>
                    <Text style={{color:'#fff'}}>登录</Text>
                </TouchableHighlight>
            </View>);
        }

        return (<ScrollView style={[this.state.showLogin]}>
            <View style={styles.loginContainer}>
                <View>
                    <Image style={styles.logo} source={require('image!logo')}/>
                </View>

                <View style={styles.inputRow}>
                    <Text>邮箱</Text><TextInput style={styles.input} placeholder="请输入邮箱" clearButtonMode="always"
                                              autoCapitalize="none" autoCorrect={false}
                                              onChangeText={this._getEmail}/>
                </View>
                {nickname}
                <View style={styles.inputRow}>
                    <Text>密码</Text><TextInput style={styles.input} placeholder="请输入密码" password={true}
                                              clearButtonMode="always"
                                              autoCapitalize="none" autoCorrect={false}
                                              onChangeText={this._getPassword}/>
                </View>
                {buttons}

            </View>
        </ScrollView>);
    },

    render: function () {
        var content = null;
        //如果载入中,只显示载入画面
        if (this.state.isLoadingShow) {
            content = (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicatorIOS size="large" color="#268DFF"/>
            </View>);
        }
        else if (!this.state.isLogin) {
            content = this.renderLogin();
        } else {
            content = this.renderUserInfo()
        }
        return (
            <View style={{flex:1}}>
                {content}
            </View>
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
        AsyncStorage.clear();
        AlertIOS.alert('注销', '已退出登录');
        this.setState({
            showIndex: {
                height: 0,
                opacity: 0
            },
            //显示登录界面
            showLogin: {
                flex: 1,
                opacity: 1
            },
            isLogin: false,
            showRegister: false,
            isLoadingShow: false
        });
    }

});

var styles = StyleSheet.create({
    loginContainer: {
        marginTop: 50,
        marginBottom: 150,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: Image.resizeMode.contain
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