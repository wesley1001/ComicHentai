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
    TimerMixin,
    AsyncStorage,
    ListView,
    RefreshControl,
    TouchableHighlight,
    } = React;

var REQUEST_COMIC_URL = Service.host + Service.getComic;
var PAGE = 0;
var Home = React.createClass({

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
                            dataSource: ds.cloneWithRows(that.state.items.concat(responseText.data))
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
        return {
            isRefreshing: false,
            width: width,
            items: [],
            thumbIndex: 0,
        };
    },

    componentWillMount: function () {
        this.fetchData(0);
    },

    _onRefresh() {
        PAGE = 0;
        this.setState({isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this.fetchData(0);
            this.setState({
                isRefreshing: false,
            });
        }, 1000);
    },

    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text>
                    正在读取中...
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
            <ListView style={styles.container}
                      onEndReached={this.renderNextPage}
                      dataSource={this.state.dataSource}
                      renderRow={(rowData) => this.renderRow(rowData)}
                      refreshControl={this.renderRefresh()}
            />
        );
    },

    renderNextPage: function () {
        console.log("nextPage");
        PAGE += 1;
        this.fetchData(PAGE);
    },

    render: function () {
        if (!this.state.items || this.state.items.length == 0) {
            return this.renderLoadingView();
        }
        return this.renderComic()
    }


});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 80,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Home;
