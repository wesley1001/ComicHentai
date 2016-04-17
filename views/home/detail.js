var React = require('react-native');
var Util = require('../util');
var Chapter = require("./chapter")
var RESTFulService = require('./../rest')
var {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    } = React;

var number = Math.floor(Util.size.width - 20);
var Detail = React.createClass({

    /**
     * 初始化状态
     */
    getInitialState: function () {
        return ({
            chapters: []
        })
    },
    /**
     * 进入阅读界面
     * @private
     */
    _startRead: function (comicId, chapterId) {
        var passProps = {
            comicId: comicId,
            chapterId: chapterId,
            items: JSON.parse(this.props.comicData.contentTitle)
        };
        console.log(passProps);
        this.props.navigator.push({
            title: "章节",
            component: Chapter,
            passProps: passProps,
            canRefresh: false
        });
    },
    /**
     * 收藏操作
     * @private
     */
    _favorite: function (comicId) {
        var that = this;
        AsyncStorage.getItem('token', function (err, token) {
            if (!err && token) {
                var path = RESTFulService.host + RESTFulService.comic;
                var param = {
                    data: Util.encrypt(JSON.stringify({
                        token: token,
                        deviceId: token,
                        comic: {
                            id: comicId
                        }
                    }))
                }
                Util.post_json(path, param, function (data) {
                    console.log("响应信息为");
                    console.log(data);
                    if (data.success) {
                        AlertIOS.alert("收藏", "收藏成功")
                    } else {
                        AlertIOS.alert("收藏", "收藏失败")
                    }
                })
            } else {
                AlertIOS.alert("用户信息", "您尚未登录")
            }

        });

    },

    render: function () {
        var comic = this.props.comicData;
        var comicTitle = comic.title;
        if (comicTitle.length > 40) {
            if (comicTitle.contains("]")) {
                comicTitle = comicTitle.split("]")[1].split("[")[0]
            }
            comicTitle = comicTitle.substring(1, 40) + (comicTitle.length > 39 ? "..." : "");
        }
        var timestamp = comic.updated;
        var date = new Date(timestamp * 1000);
        var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

        var status = comic.status;
        if (status == 0) {
            status = "已完结"
        } else if (status == 1) {
            status = "未更新"
        }
        return (
            <ScrollView style={styles.container}>
                <View key={'comic' + this.props.key} style={styles.row}>
                    <Image
                        style={[styles.img]}
                        source={{uri: comic.coverTitle}}
                    />
                    <View>
                        <Text style={styles.noColor}>
                            {"名称:" + comicTitle}
                        </Text>
                        <Text style={styles.unColor}>
                            {"作者:" + comic.author}
                        </Text>
                        <Text style={styles.unColor}>
                            {"最新更新时间:" + formattedDate}
                        </Text>
                        <Text style={styles.unColor}>
                            {"漫画状态:" + status}
                        </Text>
                    </View>
                </View>
                <View key={'chapter' + this.props.key} style={[styles.row,{marginTop:5,flex:1}]}>
                    <TouchableOpacity underlayColor="#fff" style={styles.btn}
                                      onPress={this._startRead.bind(this,comic.id,0)}>
                        <Text style={{color:'#fff'}}>开始阅读</Text>
                    </TouchableOpacity>
                    <TouchableHighlight underlayColor="#fff" style={styles.btn}
                                        onPress={this._favorite(this,comic.id)}>
                        <Text style={{color:'#fff'}}>收藏漫画</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView key={'info' + this.props.key} style={[styles.row,{marginTop:5,flex:1}]}>
                    <View>
                        <Text style={[styles.noColor,{marginLeft:5}]}>
                            {"漫画标签:" + comic.comicTag}
                        </Text>
                        <Text style={[styles.unColor,{marginLeft:5}]}>
                            {"漫画类别:" + comic.comicCategory}
                        </Text>
                        <Text style={[styles.unColor,{marginLeft:5}]}>
                            {"漫画描述:" + comic.introduction}
                        </Text>
                    </View>
                </ScrollView>
                <View style={{height:Util.size.height/2,marginTop:5}}>
                    <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:12,marginTop:10}}>
                        即将开放的评论区
                    </Text>
                </View>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 80,
    },
    row: {
        flex: 1,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 4,
        marginLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noColor: {
        width: Util.size.width,
        alignSelf: 'stretch',
        fontSize: 12,
        marginLeft: 5
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        width: Util.size.width,
        alignSelf: 'stretch',
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
        marginLeft: 5
    },
    btn: {
        margin: 10,
        flex: 1,
        width: 80,
        height: 40,
        backgroundColor: '#3BC1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    }
});

module.exports = Detail;