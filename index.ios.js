/**
 * 主页
 */
'use strict';
var React = require('react-native');
var AdSupportIOS = require('AdSupportIOS');
var Home = require('./views/home');
var About = require('./views/about');
var Manager = require('./views/manager');
var Message = require('./views/message');
var Util = require('./views/util');
var Service = require('./views/service');

var {
    StyleSheet,
    View,
    TabBarIOS,
    Text,
    NavigatorIOS,
    AppRegistry,
    Image,
    TextInput,
    StatusBarIOS,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    AlertIOS,
    AsyncStorage,
    } = React;

//这是啥?状态栏?
StatusBarIOS.setStyle('light-content')
//添加
var Address = React.createClass({
    statics: {
        //静态数据,标题
        title: '主页',
        description: '选项卡'
    },

    //初始设定
    getInitialState: function () {
        return {
            //选择的选项卡
            selectedTab: 'home',
            //关闭显示主页
            showIndex: {
                height: 0,
                opacity: 0
            },
            //显示登录页
            showLogin: {
                flex: 1,
                opacity: 1
            },
            //显示是否载入?
            isLoadingShow: false
        };
    },

    componentDidMount: function () {
        var that = this;
        //验证token
        AsyncStorage.getItem('token', function (err, token) {
            {
                if (!err && token) {
                    var path = Service.host + Service.loginByToken;
                    Util.post(path, {
                        token: token
                    }, function (data) {
                        if (data.status) {
                            //针对token状况来重新设定登录状态
                            that.setState({
                                //关闭登录页
                                showLogin: {
                                    height: 0,
                                    width: 0,
                                    flex: 0,
                                },
                                //显示主页
                                showIndex: {
                                    flex: 1,
                                    opacity: 1
                                },
                                isLoadingShow: false
                            });
                        }
                    });
                } else {
                    //否则要求重新登录
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
            }
        });

        //获取一次消息
        var path = Service.host + Service.getMessage;
        var that = this;
        Util.post(path, {
            key: Util.key
        }, function (data) {
            //在状态内设定getState.data.data->交给消息界面
            that.setState({
                data: data
            });
        });
    },

    //设定选择的选项卡
    _selectTab: function (tabName) {
        this.setState({
            selectedTab: tabName
        });
    },

    //添加跳转器
    _addNavigator: function (component, title) {
        //默认是不需要传输数据的
        var data = null;
        //但是如果是在公告页
        if (title === '公告') {
            //那么将消息传入data里
            data = this.state.data;
        }
        //然后塞进去
        return <NavigatorIOS
            //设置样式
            style={{flex:1}}
            //颜色
            barTintColor='#007AFF'
            titleTextColor="#fff"
            tintColor="#fff"
            //是否半透明
            translucent={false}
            //跳转路由
            initialRoute={{
            //通过给定的参数来决定跳转的模块
              component: component,
              title: title,
              //并向下一个页面传输数据
              passProps:{
                data: data
              }
            }}
        />;
    },

    //获取登录页的email
    _getEmail: function (val) {
        var email = val;
        this.setState({
            email: email
        });
    },

    //获取密码
    _getPassword: function (val) {
        var password = val;
        this.setState({
            password: password
        });
    },

    //登录操作
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
            //变为载入
            isLoadingShow: true
        });


        //AdSupport?
        AdSupportIOS.getAdvertisingTrackingEnabled(function () {
            //得到广告的ID?
            AdSupportIOS.getAdvertisingId(
                //传入的参数是设备的ID?
                function (deviceId) {
                    //传入email和password,以及设备信息进行登录
                    Util.post(path, {
                            email: email,
                            password: password,
                            deviceId: deviceId,
                        },
                        //得到返回信息
                        function (data) {
                            if (data.status) {
                                //登录成功,则缓存
                                var user = data.data;
                                //加入数据到本地
                                //在异步存储中进行记录它的基本信息
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
                                        //成功的话赶紧隐藏掉登录页和轮子吧!
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
                                //如果登录失败,那么提示一下
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
        return (
            //主View
            <View style={{flex:1}}>
                <!-- 这个是覆盖了整个页面的滚动条,如果isLoadingShow字段为true,那么显示,直到基本信息储存完成 -->
                {this.state.isLoadingShow ?
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <!-- 可以自定义载入界面,例如加一个gif啥的 -->
                        <ActivityIndicatorIOS size="small" color="#268DFF"></ActivityIndicatorIOS>
                    </View> :
                    null
                }
                <!-- 和上面一样,如果载入完成,那么显示Tab选项卡 -->
                {!this.state.isLoadingShow ?
                    <View style={this.state.showIndex}>
                        <TabBarIOS barTintColor="#FFF">
                            <TabBarIOS.Item
                                //终于找到图标系列
                                icon={require('image!phone_s')}
                                title="首页"
                                selected={this.state.selectedTab === 'home'}
                                //选定home所绑定的View
                                onPress={this._selectTab.bind(this, 'home')}
                            >
                                {this._addNavigator(Home, '主页')}
                            </TabBarIOS.Item>

                            <TabBarIOS.Item
                                title="公告"
                                //这个image怎么设置的呢?
                                icon={require('image!gonggao')}
                                selected={this.state.selectedTab === 'message'}
                                //同理
                                onPress={this._selectTab.bind(this, 'message')}
                            >
                                {this._addNavigator(Message, '公告')}
                            </TabBarIOS.Item>

                            <TabBarIOS.Item
                                title="管理"
                                icon={require('image!manager')}
                                selected={this.state.selectedTab === 'manager'}
                                onPress={this._selectTab.bind(this, 'manager')}
                            >
                                {this._addNavigator(Manager, '管理')}
                            </TabBarIOS.Item>

                            <TabBarIOS.Item
                                title="关于"
                                icon={require('image!about')}
                                selected={this.state.selectedTab === 'about'}
                                onPress={this._selectTab.bind(this, 'about')}
                            >
                                {this._addNavigator(About, '关于')}
                            </TabBarIOS.Item>
                        </TabBarIOS>
                    </View> : null
                }
                <!-- 选项卡完成,开始整体 -->
                <ScrollView style={[this.state.showLogin]}>
                    <View style={styles.container}>
                        <!-- 载入页面 -->
                        <View>
                            <!-- logo -->
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
                            <!-- 绑定登录 -->
                            <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login}>
                                <Text style={{color:'#fff'}}>登录</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>

            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        marginTop: 50,
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
    }
});

//注册组件作为主体
AppRegistry.registerComponent('address_book', () => Address);
