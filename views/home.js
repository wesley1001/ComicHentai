/**
 * 主页
 * Created by hope6537 on 16/01/30
 */

var React = require('react-native');
var Util = require('./util');
var ItemBlock = require('./home/itemblock');
var Service = require('./service')

var {
    Text,
    View ,
    ScrollView,
    StyleSheet,
    TextInput,
    TimerMixin,
    AlertIOS,
    AsyncStorage,
    ListView,
    RefreshControl,
    TouchableHighlight,
    } = React;

var REQUEST_COMIC_URL = Service.host + Service.getComic;
var PAGE = 0;
var Home = React.createClass({


    clearData: function () {
        this.setState({
            items: []
        });
    },

    fetchData: function (page) {
        if (page == null || page == undefined) {
            page = 0;
        }
        var that = this;
        //TODO:之后去掉
        AsyncStorage.getItem('token', function (err, token) {
            if (!err && token) {
                var data = {
                    key: Util.key,
                    page: page
                };
                var fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                fetch(REQUEST_COMIC_URL, fetchOptions)
                    .then((response) => response.json())
                    .then((responseText) => {
                        //创建ListView
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        that.setState({
                            items: that.state.items.concat(responseText.data),
                            dataSource: ds.cloneWithRows(that.state.items.concat(responseText.data)),
                            loadNext: false
                        });
                    }).done();
            } else {
                console.log("尚未登录");
            }
        });
    },


    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(Util.size.width);
        if (this.props.requestUrl != undefined) {
            console.log("请求变更为" + this.props.requestUrl);
            REQUEST_COMIC_URL = this.props.requestUrl;
        }
        return {
            isLoadingTail: false,
            isRefreshing: false,
            width: width,
            items: [],
            thumbIndex: 0,
            loadNext: false
        };
    },

    componentWillMount: function () {
        this.fetchData(0);

    },

    componentDidMount: function () {
        console.log("navigator undefined ? home =[" + this.props.navigator == undefined + "]");
    },

    _onRefresh() {
        PAGE = 0;
        this.setState({isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this.clearData();
            this.fetchData(0);
            this.setState({
                isRefreshing: false,
            });
        }, 1000);
    },

    _onLoadNext: function () {
        this.setState({
            loadNext: true
        })
    },

    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10}}>
                    正在读取中...
                </Text>
            </View>
        );
    },

    renderLoadingNextView: function () {
        if (!this.state.loadNext) {
            return;
        }
        return (
            <View style={{flex:1,height:12}}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:0}}>
                    载入中...
                </Text>
            </View>
        );
    },

    renderRow: function (rowData) {
        return (<ItemBlock
            key={rowData.comicId}
            comic={rowData}
            width={this.state.width}
            nav={this.props.navigator}
        />);
    },

    renderRefresh: function () {
        return (<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#ff0000"
            title="刷新中..."
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
        />);
    },

    renderComic: function () {
        return (
            <ListView
                onEndReached={this.renderNextPage}
                contentLength={25}
                dataSource={this.state.dataSource}
                renderRow={(rowData) => this.renderRow(rowData)}
                refreshControl={this.renderRefresh()}/>
        );
    },

    renderNextPage: function (e) {
        console.log('onEndReached', this.state.isLoadingTail);
        if (this.state.isLoadingTail) {
            // We're already fetching
            return;
        }
        this.setState({
            isLoadingTail: true
        });
        this.setState({
            isLoadingTail: false
        });
        this._onLoadNext();
        PAGE += 1;
        this.fetchData(PAGE);
    },

    render: function () {
        if (!this.state.items || this.state.items.length == 0) {
            return this.renderLoadingView();
        }
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 1,marginBottom:80}}>
                    {this.renderComic()}
                </View>
                <View>
                    {this.renderLoadingNextView()}
                </View>
            </View>
        );
    }


});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 80,
    },
    search: {
        fontSize: 14,
        height: 20,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Home;
