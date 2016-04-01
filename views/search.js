/**
 * Search View
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
var Item = require('./message/item');
var Detail = require('./message/detail');
var Service = require('./service');
var Home = require('./home');

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
var PAGE = 0;
var Search = React.createClass({

    getInitialState: function () {
        return ({
            hasKeyWord: false,
            lastEditTime: 0,
            searchHistory: null
        })
    },

    componentWillMount: function () {
        var that = this;
        AsyncStorage.getItem("searchHistory", function (err, searchHistory) {
            if (!searchHistory) {
                searchHistory = "[]";
            }
            searchHistory = JSON.parse(searchHistory);
            that.setState({
                searchHistory: searchHistory
            });
        }).done();
    },

    autoComplete: function (val) {
        console.log("值为" + val);
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
            console.log("超过1500毫秒,发送请求");
            this.setState({
                keyWord: val,
                lastEditTime: thisTime,
                hasKeyWord: true
            })
        } else {
            console.log("太快,不发送");
            this.setState({
                lastEditTime: thisTime
            })
        }

    },

    submitKeyWord: function (val) {
        var that = this;
        console.log("值为" + val);
        var keyWord = val;
        if (keyWord == null || keyWord == undefined || keyWord == "") {
            this.setState({
                keyWord: keyWord,
                lastEditTime: 0,
                hasKeyWord: false
            })
        }
        AsyncStorage.getItem("searchHistory", function (err, searchHistory) {
            if (!searchHistory) {
                searchHistory = "[]";
            }
            searchHistory = JSON.parse(searchHistory);
            searchHistory.push(keyWord);
            AsyncStorage.setItem("searchHistory", JSON.stringify(searchHistory)).done();
            that.setState({
                hasKeyWord: false
            });
            that.setState({
                searchHistory: searchHistory,
                keyWord: keyWord,
                lastEditTime: 0,
                hasKeyWord: true
            });
        }).done();


    },

    renderHistory: function () {
        var history = this.state.searchHistory;
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
        return (<View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
            <Home
                navigator={this.props.navigator}
                requestUrl={REQUEST_COMIC_URL}
                keyWord={this.state.keyWord}
            />
        </View>);
    },

    render: function () {
        var content = this.renderNormalScreen();
        if (this.state.hasKeyWord) {
            content = this.renderSearchResult();
        }
        return (
            <View style={styles.container}>
                <View>
                    <TextInput style={styles.search} placeholder="搜索漫画/标签/作者...." clearButtonMode="always"
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