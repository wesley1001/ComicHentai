/**
 * 首页的第一页,展示部门
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
//将通讯录View得到,这是之后要跳转的
var Address = require('./address');
//得到远程调用接口
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    } = React;

//每个单项组件
var ItemBlock = React.createClass({
    render: function () {
        //定义每个部门的长宽和颜色
        var size = {
            width: parseInt(this.props.width),
            height: parseInt(this.props.width),
            backgroundColor: this.props.color,
        };
        return (
            //引用可以点击的高亮按钮,并将底层颜色设为白色.当点击时调用loadPage方法
            <TouchableHighlight underlayColor="#fff" onPress={this._loadPage}>
                <!-- 每个按钮下嵌套一个View,并遵循size样式 -->
                <View style={[styles.itemBlock, size]}>
                    <!-- View下再嵌套 -->
                    <View>
                        <!-- 第一个Text显示类别 -->
                        <Text style={styles.font18}>{this.props.title}</Text>
                    </View>
                    <View>
                        <!-- 第二个Text显示部门 -->
                        <Text style={styles.font10}>{this.props.partment}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    //加载页面
    _loadPage: function (e) {
        //获得当前的nav跳转
        var nav = this.props.nav;
        //拿到需要远程调用的key
        var key = Util.key;
        //获得当前选中的部门名称
        var partment = this.props.partment;
        //url是host+"/user/get"
        var path = Service.host + Service.getUser;

        //进行远程调用,塞参数
        Util.post(path, {
                key: key,
                partment: partment
            },
            //将返回的数据获取
            function (data) {
                //并确定nav下一步的位置
                nav.push({
                    //哪一步的title是当前标签
                    title: this.props.tag,
                    //要跳转的组件是通讯录
                    component: Address,
                    //传递的数据是刚刚获取的data
                    passProps: {
                        data: data
                    }
                });
                //绑定到主页可以让他能跳转回来
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

//最后导出
module.exports = ItemBlock;