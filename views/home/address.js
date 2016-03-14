/**
 * 通讯录界面
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
//引入工具
var Util = require('../util');
var ActionSheetIOS = require('ActionSheetIOS');
//引入远程服务接口
var Service = require('./../service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableHighlight,
    LinkingIOS,
    AlertIOS,
    } = React;

//创建通讯录View
var Address = React.createClass({
    //最终渲染方式
    render: function () {
        //view将作为数组存在
        var view = [];
        //view中的item(人员数据),通过判断当前data的状态来返回实际数据
        var items = this.props.data.status ? this.props.data.data : [];
        //7种颜色枚举
        var colors = ['#E20079', '#FFD602', '#25BFFE', '#F90000', '#04E246', '#04E246', '#00AFC9'];
        //随机生成背景颜色
        var color = {
            backgroundColor: colors[parseInt(Math.random() * 7)]
        };
        //讲item中的每一个数据迭代出来
        for (var i in items) {
            //将其塞入到view中,通过view.push方法
            view.push(
                //数据View,key即为第几个,style继承了样式表
                <View key={'addressItem' + i} style={styles.row}>
                    <!-- View中分为以下三块 ,分别是左侧名称图标-->
                    <View style={[styles.text, color]}>
                        <!-- 首字母的第一个字 -->
                        <Text style={{fontSize:25, color:'#fff', fontWeight:'bold'}}>
                            {items[i].username.substr(0, 1) || '未'}
                        </Text>
                    </View>
                    <!-- 在第二块View中 展示全名和部门 -->
                    <View style={styles.part}>
                        <Text>
                            <!-- 提取出具体的属性 -->
                            {items[i].username}
                        </Text>
                        <Text style={styles.unColor}>
                            {(items[i].partment || '') + '部－' + (items[i].tag || '') + '人员'}
                        </Text>
                    </View>
                    <!-- 在第三块中显示电话号和邮件地址 -->
                    <View style={{flex:1}}>
                        <!-- 调用点击即高亮模块 -->
                        <TouchableHighlight underlayColor="#fff"
                            //点击后调用showActionSheet方法进行跳转
                                            onPress={this.showActionSheet.bind(this, items[i].tel, items[i].email, items[i].username)}>
                            <Text style={styles.link}>
                                {items[i].tel}
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#fff"
                                            onPress={this.showActionSheet.bind(this, items[i].tel, items[i].email, items[i].username)}>
                            <Text style={styles.link}>
                                {items[i].email}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        }
        return (
            //完成后,使用可以滚动的View将已经组合完毕的View结合
            <ScrollView>
                {view}
            </ScrollView>
        );
    },

    /**
     * 调用iOS接口进行跳转
     * @param tel
     * @param email
     * @param name
     */
    showActionSheet(tel, email, name) {
        //声明一个选项数组
        var options = [];
        //添加选项
        options.push('拨打电话给：' + name);
        options.push('发送短信给：' + name);
        options.push('发送邮件给：' + name);
        options.push('取消');

        //声明一个事件数组,与选项数组一一对应
        var events = [];
        events.push(function () {
            //连接到IOS,并打开特定URL
            LinkingIOS.openURL('tel://' + tel);
        });
        events.push(function () {
            LinkingIOS.openURL('sms://' + tel);
        });
        events.push(function () {
            LinkingIOS.openURL('mailto://' + email);
        });


        //调用控件中的方法,[显示动作表通过选项]
        ActionSheetIOS.showActionSheetWithOptions({
                options: options,
                //讲选项传入,并指定取消按钮
                cancelButtonIndex: options.length - 1,
            },
            //讲方法传入,将得到的Index通过events进行执行
            function (index) {
                events[index] && events[index]();
            }
        );
    }
});

var styles = StyleSheet.create({
    row: {
        height: 80,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E30082',
    },
    part: {
        marginLeft: 5,
        flex: 1,
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
    }
});

//导出通讯录栏模块
module.exports = Address;