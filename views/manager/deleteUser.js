var React = require('react-native');
var Util = require('./../util');
var Service = require('../service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    AlertIOS,
    AsyncStorage,
    } = React;

var DeleteUser = React.createClass({

    render: function () {
        return (
            <ScrollView>

                <View style={{height:35, marginTop:30,}}>
                    <!-- 每次输入更新状态变量的email字段 -->
                    <TextInput style={styles.input} placeholder="请输入用户的邮箱" onChangeText={this._getEmail}/>
                </View>

                <View>
                    <!-- 点击时更新 -->
                    <TouchableOpacity onPress={this._deleteUser}>
                        <View style={styles.btn}>
                            <Text style={{color:'#FFF'}}>删除用户</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },

    _getEmail: function (val) {
        this.setState({
            email: val
        });
    },

    _deleteUser: function () {
        var that = this;
        //调用内部Alert
        AlertIOS.alert('提示', '确认删除该用户？', [
            //删除按钮
            {
                text: '删除', onPress: function () {
                var path = Service.host + Service.deleteUser;
                //AsyncStorage异步获取token
                AsyncStorage.getItem('token', function (err, data) {
                    if (!err) {
                        Util.post(path, {
                            token: data,
                            email: that.state.email
                        }, function (data) {
                            //判断restful接口状态
                            if (data.status) {
                                AlertIOS.alert('成功', '删除成功');
                            } else {
                                AlertIOS.alert('失败', '删除失败');
                            }
                        });
                    } else {
                        AlertIOS.alert('提示', '没有权限');
                    }
                });
                }
            },
            //取消按钮¬
            {text: '取消', onPress: ()=>null},
        ]);
    }

});

var styles = StyleSheet.create({
    input: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingLeft: 5,
        fontSize: 13,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#1DB8FF',
        height: 38,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 4,
    }
});

module.exports = DeleteUser;