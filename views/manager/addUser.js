/**
 * 添加用户View
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./../util');
var Service = require('./../service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    PickerIOS,
    AlertIOS,
    } = React;

var AddUser = React.createClass({

    //得到前一个View传来的值,并且初始化当前值
    getInitialState: function () {
        //这个不太明白?是数据库记录字段?
        var items = ['A', 'B', 'C', 'D', 'E', 'F'];
        //定义部门标签
        var tags = ['框架研发', 'BU产品', 'BU研发', '启明星', '项目管理', '公共产品'];
        //讲item,tags传入,
        return {
            items: items,
            tags: tags,
            //选中后的颜色
            selectA: {
                backgroundColor: '#3BC1FF',
                borderColor: '#3BC1FF'
            },
            //选中后的字体颜色
            select_A: {
                color: '#FFF'
            },
            //类别选中
            yan: {
                backgroundColor: '#3BC1FF',
                borderColor: '#3BC1FF'
            },
            //类别选中字体
            yan_text: {
                color: '#FFF'
            },
            //默认值
            tag: '研发',
            partment: '框架研发'
        };
    },

    //具体渲染
    render: function () {
        var tagOne = [];
        //第一行标签
        for (var i = 0; i < 3; i++) {
            tagOne.push(
                //插入 获取到items[i],当进行点击的时候,进行选中操作[即调用select方法],讲当前的数据绑定
                <TouchableOpacity key={this.state.items[i]} onPress={this._select.bind(this, this.state.items[i])}>
                    <!-- 具体显示字体 切换样式 -->
                    <View style={[styles.part, this.state['select' + this.state.items[i]]]}>
                        <!-- 将具体的部门名称显示,并切换选中样式 -->
                        <Text style={this.state['select_' + this.state.items[i]]}>{this.state.tags[i]}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        //第二行标签,同上
        var tagTwo = [];
        for (var i = 3; i < 6; i++) {
            tagTwo.push(
                <TouchableOpacity key={this.state.items[i]} onPress={this._select.bind(this, this.state.items[i])}>
                    <View style={[styles.part, this.state['select' + this.state.items[i]]]}>
                        <Text style={this.state['select_' + this.state.items[i]]}>{this.state.tags[i]}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        //得到了装满数据的tagOne和tagTwo

        return (
            //滚动View
            <ScrollView style={{paddingTop:30}}>
                <View style={styles.row}>
                    <Text style={styles.label}>姓名</Text>
                    <TextInput style={styles.input} onChangeText={this._setName}/>
                </View>
                <!-- 通常信息 -->
                <View style={styles.row}>
                    <Text style={styles.label}>用户名</Text>
                    <TextInput style={styles.input} onChangeText={this._setUserName}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>密码</Text>
                    <TextInput style={styles.input} password={true} placeholder="初始密码"
                               onChangeText={this._setPassword}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>邮箱</Text>
                    <TextInput style={styles.input} onChangeText={this._setEmail}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>电话</Text>
                    <TextInput style={styles.input} onChangeText={this._setTel}/>
                </View>

                <!-- 选择标签信息 -->
                <View style={styles.partment}>
                    {tagOne}
                </View>
                <View style={styles.partment}>
                    {tagTwo}
                </View>

                <!-- 选择种类 -->
                <View style={{marginTop:30,flexDirection:'row', justifyContent:'center'}}>
                    <!-- 选择时触发_selectType方法 -->
                    <TouchableOpacity onPress={this._selectType.bind(this, 'yan')}>
                        <View style={[styles.part, this.state.yan]}>
                            <Text style={this.state.yan_text}>研发</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._selectType.bind(this, 'chan')}>
                        <View style={[styles.part, this.state.chan]}>
                            <Text style={this.state.chan_text}>产品</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._selectType.bind(this, 'project')}>
                        <View style={[styles.part, this.state.project]}>
                            <Text style={this.state.project_text}>项目</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <!-- 完成的确定按钮 -->
                <View style={{marginTop:30, alignItems:'center', justifyContent:'center'}}>
                    <!-- 触发addUser事件 -->
                    <TouchableOpacity onPress={this._addUser}>
                        <View style={styles.btn}>
                            <Text>创建用户</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },

    /**
     * 选中
     * @param id
     * @private
     */
    _select: function (id) {
        //样式表
        var obj = {};
        var color = {};
        var items = {
            A: {},
            B: {},
            C: {},
            D: {},
            E: {},
            F: {}
        };

        //加上选中效果
        obj['select' + id] = {
            backgroundColor: '#3BC1FF',
            borderColor: '#3BC1FF'
        };
        //文字变白
        color['select_' + id] = {
            color: '#fff',
        };
        //设置选中的样式表和颜色
        this.setState(obj);
        this.setState(color);
        this.setState();
        //清除其他选中效果
        delete items[id];
        for (var i in items) {
            var newObj = {};
            newObj['select' + i] = {
                backgroundColor: '#FFF',
                borderColor: '#ddd'
            };
            var newColor = {};
            newColor['select_' + i] = {
                color: '#000',
            };
            //for循环迭代并将新样式保存
            this.setState(newObj);
            this.setState(newColor);
        }
        //具体选中的部门信息
        var partment = '框架研发';
        switch (id) {
            case 'A':
                partment = this.state.tags[0];
                break;
            case 'B':
                partment = this.state.tags[1];
                break;
            case 'C':
                partment = this.state.tags[2];
                break;
            case 'D':
                partment = this.state.tags[3];
                break;
            case 'E':
                partment = this.state.tags[4];
                break;
            case 'F':
                partment = this.state.tags[5];
                break;
        }
        //然后保存
        this.setState({
            partment: partment
        });
    },
    //同上
    _selectType: function (id) {
        var obj = {};
        var color = {};
        var items = {
            yan: {},
            chan: {},
            project: {}
        };
        //加上选中效果
        obj[id] = {
            backgroundColor: '#3BC1FF',
            borderColor: '#3BC1FF'
        };
        color[id + '_text'] = {
            color: '#fff',
        };
        this.setState(obj);
        this.setState(color);

        //清除其他选中效果
        delete items[id];
        for (var i in items) {
            var newObj = {};
            newObj[i] = {
                backgroundColor: '#FFF',
                borderColor: '#ddd'
            };
            var newColor = {};
            newColor[i + '_text'] = {
                color: '#000',
            };
            this.setState(newObj);
            this.setState(newColor);
        }
        //增加变量
        var tag = '研发';
        switch (id) {
            case 'yan':
                tag = '研发';
                break;
            case 'chan':
                tag = '产品';
                break;
            case 'project':
                tag = '项目';
                break;
            default :
                break;
        }

        this.setState({
            tag: tag
        });

    },

    /**
     * 在状态里增加变量 设置名字\密码等
     * @param val
     * @private
     */
    _setName: function (val) {
        this.setState({
            name: val
        });
    },

    _setUserName: function (val) {
        this.setState({
            username: val
        });
    },

    _setPassword: function (val) {
        this.setState({
            password: val
        });
    },

    _setEmail: function (val) {
        this.setState({
            email: val
        });
    },

    _setTel: function (val) {
        this.setState({
            tel: val
        });
    },

    /**
     * 最后保存用户信息
     * @returns {*}
     * @private
     */
    _addUser: function () {
        //从状态获取信息
        var username = this.state.username;
        var email = this.state.email;
        var password = this.state.password;
        //之前选中的部门
        var partment = this.state.partment;
        //之前选中的类别
        var tag = this.state.tag;
        var tel = this.state.tel;

        //校验
        if (!username || !email || !password || !tel) {
            return AlertIOS.alert('提示', '用户名、初始密码、邮箱电话、必填，请确认!');
        }
        var obj = {
            username: username,
            email: email,
            password: password,
            partment: partment,
            tag: tag,
            tel: tel
        };

        //服务地址
        var path = Service.host + Service.createUser;
        //将obj作为参数传入
        Util.post(path, obj, function (data) {
            if (data.status) {
                AlertIOS.alert('成功', '创建用户成功，请告知用户初始密码');
            } else {
                AlertIOS.alert('失败', '创建用户失败');
            }
        });

    }

});


var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
    },
    label: {
        width: 50,
        marginLeft: 10,
    },
    input: {
        borderWidth: Util.pixel,
        height: 35,
        flex: 1,
        marginRight: 20,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingLeft: 5,
        fontSize: 14,
    },
    partment: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    part: {
        width: 65,
        height: 30,
        borderWidth: Util.pixel,
        borderColor: '#ddd',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    btn: {
        borderColor: '#268DFF',
        height: 35,
        width: 200,
        borderRadius: 5,
        borderWidth: Util.pixel,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//导出添加用户模块
module.exports = AddUser;