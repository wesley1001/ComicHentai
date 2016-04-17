var React = require('react-native');
var Detail = require('./detail');
var RESTFulService = require('./../rest')
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


        //i中的每个元素都是一个专题的具体信息,一个专题内部会有多个漫画
        return (
            <TouchableOpacity onPress={this._loadPage.bind(this,comic.id)}>
                <View key={'comic' + this.props.key} style={styles.row}>
                    <Image
                        style={[styles.text]}
                        source={{uri: comic.coverTitle}}
                    />
                    <View>
                        <Text style={styles.noColor}>
                            {comicTitle}
                        </Text>
                        <Text style={styles.unColor}>
                            {"作者:" + comic.author}
                        </Text>
                        <Text style={styles.unColor}>
                            {"最近更新时间:" + formattedDate}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
    //加载页面
    _loadPage: function (data) {
        var nav = this.props.nav;
        var comicId = data;
        var param = encodeURIComponent(Util.encrypt(JSON.stringify({
            comic: {id: comicId}
        })));
        var path = RESTFulService.host + RESTFulService.comic.index + "?data=" + param;
        Util._get(path, function (resp) {
            nav.push({
                title: "漫画详情",
                component: Detail,
                passProps: {
                    comicId: comicId,
                    comicData: resp.data.category.relation.comic
                }
            });
        }.bind(this));
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 80,
    },
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

module.exports = ItemBlock;