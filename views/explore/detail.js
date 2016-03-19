var React = require('react-native');
var Util = require('../util');
var ActionSheetIOS = require('ActionSheetIOS');
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


/**
 * 专题具体内容
 */
var Detail = React.createClass({
    render: function () {
        var view = [];
        var items = this.props.data.status ? this.props.data.data : [];
        var colors = ['#E20079', '#FFD602', '#25BFFE', '#F90000', '#04E246', '#04E246', '#00AFC9'];
        var color = {
            backgroundColor: colors[parseInt(Math.random() * 7)]
        };
        //i中的每个元素都是一个专题的具体信息,一个专题内部会有多个漫画
        for (var i in items) {
            var comicList = items[i].comic;
            for (var comicIndex in comicList) {
                view.push(
                    <View key={'comic' + comicIndex} style={styles.row}>
                        <View style={[styles.text, color]}>
                            <Text style={{fontSize:25, color:'#fff', fontWeight:'bold'}}>
                                {comicList[comicIndex].comicTitle.substr(0, 1) || '未'}
                            </Text>
                        </View>
                        <View style={styles.part}>
                            <Text>
                                {comicList[comicIndex].comicTitle}
                            </Text>
                            <Text style={styles.unColor}>
                                {comicList[comicIndex].author}
                            </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TouchableHighlight underlayColor="#fff"
                                                onPress={this.showActionSheet.bind(this, comicList[comicIndex].author, comicList[comicIndex].author, comicList[comicIndex].author)}>
                                <Text style={styles.link}>
                                    {comicList[comicIndex].updatedContent}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#fff"
                                                onPress={this.showActionSheet.bind(this, comicList[comicIndex].author, comicList[comicIndex].author, comicList[comicIndex].author)}>
                                <Text style={styles.link}>
                                    {comicList[comicIndex].status ? "已完结" : "未完结"}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                );
            }
        }
        return (
            <ScrollView>
                {view}
            </ScrollView>
        );
    },

    showActionSheet(tel, email, name) {
        var options = [];
        options.push('拨打电话给：' + name);
        options.push('发送短信给：' + name);
        options.push('发送邮件给：' + name);
        options.push('取消');

        var events = [];
        events.push(function () {
            LinkingIOS.openURL('tel://' + tel);
        });
        events.push(function () {
            LinkingIOS.openURL('sms://' + tel);
        });
        events.push(function () {
            LinkingIOS.openURL('mailto://' + email);
        });


        ActionSheetIOS.showActionSheetWithOptions({
                options: options,
                cancelButtonIndex: options.length - 1,
            },
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

module.exports = Detail;