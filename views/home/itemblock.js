var React = require('react-native');
var Address = require('./address');
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    } = React;

//每个单项组件
var ItemBlock = React.createClass({
    render: function () {
        var colors = ['#E20079', '#FFD602', '#25BFFE', '#F90000', '#04E246', '#04E246', '#00AFC9'];
        var color = {
            backgroundColor: colors[parseInt(Math.random() * 7)]
        };
        var comic = this.props.comic;
        console.log(comic)

        //i中的每个元素都是一个专题的具体信息,一个专题内部会有多个漫画
        return (
            <TouchableOpacity onPress={this._loadPage.bind(this,comic.comicId)}>
                <View key={'comic' + this.props.key} style={styles.row}>
                    <View style={[styles.text, color]}>
                        <Text style={{fontSize:25, color:'#fff', fontWeight:'bold'}}>
                            {comic.comicTitle.substr(0, 1) || '未'}
                        </Text>
                    </View>
                    <View style={styles.part}>
                        <Text>
                            {comic.comicTitle}
                        </Text>
                        <Text style={styles.unColor}>
                            {comic.author}
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.link}>
                            {comic.updatedContent}
                        </Text>
                        <Text style={styles.link}>
                            {comic.status ? "已完结" : "未完结"}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
    //加载页面
    _loadPage: function (data) {
        var nav = this.props.nav;
        var key = Util.key;
        var path = Service.host + Service.getComic;
        var comicId = data;
        Util.post(path, {
            key: key,
            comicId: comicId
        }, function (data) {
            nav.push({
                title: "漫画详情",
                component: Address,
                passProps: {
                    comicId: comicId,
                    comicData: data
                }
            });
        }.bind(this));
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
        marginLeft: 0,
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

module.exports = ItemBlock;