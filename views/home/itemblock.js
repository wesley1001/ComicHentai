var React = require('react-native');
var Address = require('./address');
var Service = require('./../service');
var Util = require('../util');

var {
    View,
    Text,
    Image,
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
        var rank = ['E', 'D', 'C', 'B', 'A', 'S']
        var comic = this.props.comic;
        var comicTitle = comic.comicTitle;
        if (comicTitle.length > 30) {
            if (comicTitle.contains("]")) {
                comicTitle = comicTitle.split("]")[1].split("[")[0]
            }
            comicTitle = comicTitle.substring(1, 30) + "...";
        }


        //i中的每个元素都是一个专题的具体信息,一个专题内部会有多个漫画
        return (
            <TouchableOpacity onPress={this._loadPage.bind(this,comic.comicId)}>
                <View key={'comic' + this.props.key} style={styles.row}>
                    <Image
                        style={[styles.text]}
                        source={{uri: comic.comicCover}}
                    />
                    <View>
                        <Text style={styles.noColor}>
                            {comicTitle}
                        </Text>
                        <Text style={styles.unColor}>
                            {"最新更新时间:" + comic.comicDate}
                        </Text>
                        <Text style={styles.unColor}>
                            {"平均评分:" + rank[comic.comicRank]}
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
        width: 75,
        height: 75,
        borderRadius: 4,
        marginLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noColor: {
        fontSize: 12,
        marginLeft:5
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
        marginLeft:5
    }
});

module.exports = ItemBlock;