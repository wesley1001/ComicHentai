/**
 * Search View
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
var Service = require('./service');
var Home = require('./home');
var Explore = require('./explore');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    AsyncStorage,
    Image,
    TouchableOpacity,
    } = React;

var REQUEST_COMIC_URL = Service.host + Service.searchComic;
var REQUEST_SPECAIL_URL = Service.host + Service.searchSpecial;
var PAGE = 0;
var Search = React.createClass({

    getInitialState: function () {
        //查询类型
        var type = this.props.type;
        return ({
            hasKeyWord: false,
            lastEditTime: 0,
            searchComicHistory: [],
            searchSpecialHistory: [],
            type: type
        })
    },

    componentWillMount: function () {
        var that = this;
        if (this.state.type == "comic") {
            AsyncStorage.getItem("searchComicHistory", function (err, searchHistory) {
                if (!searchHistory) {
                    searchHistory = "[]";
                }
                searchHistory = JSON.parse(searchHistory);
                that.setState({
                    searchComicHistory: searchHistory
                });
            }).done();
        }
        if (this.state.type == "special") {
            AsyncStorage.getItem("searchSpecialHistory", function (err, searchHistory) {
                if (!searchHistory) {
                    searchHistory = "[]";
                }
                searchHistory = JSON.parse(searchHistory);
                that.setState({
                    searchSpecialHistory: searchHistory
                });
            }).done();
        }
    },

    autoComplete: function (val) {
        if (val == null || val == undefined || val == "") {
            this.setState({
                keyWord: val,
                lastEditTime: thisTime,
                hasKeyWord: false
            })
        }
        var thisTime = Math.floor(Date.now());
        var divide = thisTime - this.state.lastEditTime;
        if (divide > 1500) {
            this.setState({
                hasKeyWord: false
            });
            this.setState({
                keyWord: val,
                lastEditTime: thisTime,
                hasKeyWord: true
            })
        } else {
            this.setState({
                lastEditTime: thisTime
            })
        }

    },

    submitKeyWord: function (val) {
        var that = this;
        var keyWord = val;
        if (keyWord == null || keyWord == undefined || keyWord == "") {
            this.setState({
                keyWord: keyWord,
                lastEditTime: 0,
                hasKeyWord: false
            })
        }
        if (this.state.type == "comic") {
            AsyncStorage.getItem("searchComicHistory", function (err, searchHistory) {
                if (!searchHistory) {
                    searchHistory = "[]";
                }
                searchHistory = JSON.parse(searchHistory);
                searchHistory.push(keyWord);
                AsyncStorage.setItem("searchComicHistory", JSON.stringify(searchHistory)).done();
                that.setState({
                    hasKeyWord: false
                });
                that.setState({
                    searchComicHistory: searchHistory,
                    keyWord: keyWord,
                    lastEditTime: 0,
                    hasKeyWord: true
                });
            }).done();
        }
        if (this.state.type == "special") {
            AsyncStorage.getItem("searchSpecialHistory", function (err, searchHistory) {
                if (!searchHistory) {
                    searchHistory = "[]";
                }
                searchHistory = JSON.parse(searchHistory);
                searchHistory.push(keyWord);
                AsyncStorage.setItem("searchSpecialHistory", JSON.stringify(searchHistory)).done();
                that.setState({
                    hasKeyWord: false
                });
                that.setState({
                    searchSpecialHistory: searchHistory,
                    keyWord: keyWord,
                    lastEditTime: 0,
                    hasKeyWord: true
                });
            }).done();
        }


    },

    renderHistory: function () {
        var history = []
        if (this.state.type == "comic") {
            history = this.state.searchComicHistory;
        }
        if (this.state.type == "special") {
            history = this.state.searchSpecialHistory;
        }
        if (!history || history == "[]" || history == []) {
            return (<Text style={styles.unColor}>无历史记录</Text>);
        }
        var recordCount = 0;
        var item = [];
        for (var i = history.length; i > 0; i--) {
            if (history[i] == "" || history[i] == undefined || history == null) {
                continue;
            }
            item.push(
                <View style={styles.row} key={history[i]+Math.random()+"_history_view"}>
                    <Text style={styles.unColor} key={history[i]+"_history"}>{history[i]}</Text>
                </View>
            );
            recordCount++;
            if (recordCount > 15) {
                break;
            }
        }
        return (
            <View style={{flex:1}}>
                <Text style={[styles.noColor,{marginBottom:5}]}>搜索历史记录</Text>
                <ScrollView style={{flex:1}}>{item}</ScrollView>
            </View>);
    },

    renderNormalScreen: function () {
        var history = this.renderHistory();
        return (
            <View style={{flex: 1,marginTop:10}}>
                <Text style={[styles.unColor,{marginBottom:80}]}>
                    这里将来是一堆标签的按钮
                </Text>
                {history}
            </View>);
    },

    renderSearchResult: function () {
        var request_url = undefined;
        if (this.state.type == "comic") {
            request_url = REQUEST_COMIC_URL;
            return (<View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                <Home
                    navigator={this.props.navigator}
                    requestUrl={request_url}
                    keyWord={this.state.keyWord}
                />
            </View>);
        }
        if (this.state.type == "special") {
            request_url = REQUEST_SPECAIL_URL;
            return (<View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                <Explore
                    navigator={this.props.navigator}
                    requestUrl={request_url}
                    keyWord={this.state.keyWord}
                />
            </View>);
        }


    },

    render: function () {
        var content = this.renderNormalScreen();
        if (this.state.hasKeyWord) {
            content = this.renderSearchResult();
        }
        var placeHolder = "";
        if (this.state.type == "comic") {
            placeHolder = "搜索漫画/标签/作者....";
        }
        if (this.state.type == "special") {
            placeHolder = "搜索专题....";
        }
        return (
            <View style={styles.container}>
                <View>
                    <TextInput style={styles.search} placeholder={placeHolder} clearButtonMode="always"
                               autoCapitalize="none" autoCorrect={false} onChangeText={(val)=>this.autoComplete(val)}
                               onSubmitEditing={(val)=>this.submitKeyWord(val.nativeEvent.text)}/>
                </View>
                {content}
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    search: {
        height: 35,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    row: {
        height: 25,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    },
    noColor: {
        fontSize: 12,
        marginLeft: 5
    },
    unColor: {
        color: '#575656',
        fontSize: 12,
        marginLeft: 5
    }
});

module.exports = Search;