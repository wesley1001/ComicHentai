var React = require('react-native');
var Util = require('../util');
var {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    } = React;

var number = Math.floor(Util.size.width - 20);
var Detail = React.createClass({
    render: function () {

        var comic = this.props.comicData;
        var rank = ['E', 'D', 'C', 'B', 'A', 'S']
        var comicTitle = comic.comicTitle;
        if (comicTitle.length > 40) {
            if (comicTitle.contains("]")) {
                comicTitle = comicTitle.split("]")[1].split("[")[0]
            }
            comicTitle = comicTitle.substring(1, 40) + (comicTitle.length > 39 ? "..." : "");
        }
        return (
            <ScrollView style={styles.container}>
                <View key={'comic' + this.props.key} style={styles.row}>
                    <Image
                        style={[styles.img]}
                        source={{uri: comic.comicCover}}
                    />
                    <View>
                        <Text style={styles.noColor}>
                            {"名称:" + comicTitle}
                        </Text>
                        <Text style={styles.unColor}>
                            {"最新更新时间:" + comic.comicDate}
                        </Text>
                        <Text style={styles.unColor}>
                            {"平均评分:" + rank[comic.comicRank]}
                        </Text>
                    </View>
                </View>
                <View key={'info' + this.props.key} style={[styles.row,{marginTop:5}]}>
                    <View>
                        <Text style={[styles.noColor,{marginLeft:5}]}>
                            {"漫画标签:" + comic.comicTag}
                        </Text>
                        <Text style={[styles.unColor,{marginLeft:5}]}>
                            {"漫画类别:" + comic.comicCategory}
                        </Text>
                        <Text style={[styles.unColor,{marginLeft:5}]}>
                            {"漫画描述:" + comic.comicTitle}
                        </Text>
                    </View>
                </View>
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
        height: 110,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center'
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
    }
});

module.exports = Detail;