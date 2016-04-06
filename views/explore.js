/**
 * Created by hope6537 on 16/3/19.
 */
/**
 * Created by vczero on 15/7/12.
 */

var React = require('react-native');
var Util = require('./util');
var Item = require('./explore/item');
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

var REQUEST_SPECIAL_URL = Service.host + Service.getSpecial;
var PAGE = 0;
var Explore = React.createClass({

    clearData: function () {
        this.setState({
            items: []
        });
    },

    fetchData: function (page, keyWord) {
        if (page == null || page == undefined) {
            page = 0;
        }
        if (keyWord == null || keyWord == undefined) {
            keyWord = "";
        }
        var that = this;
        //TODO:之后去掉
        AsyncStorage.getItem('token', function (err, token) {
            if (!err && token) {
                var data = {
                    key: Util.key,
                    page: page,
                    keyWord: keyWord
                };
                var fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                fetch(REQUEST_SPECIAL_URL, fetchOptions)
                    .then((response) => response.json())
                    .then((responseText) => {
                        //创建ListView
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        //在这里将数据处理下,读取老数据,并让其每4个Object放在一行
                        var data = that.state.items.concat(responseText.data);
                        var rowCount = (data.length / 3) + 1;
                        var totalData = [];
                        for (var i = 0; i < rowCount; i++) {
                            var rowData = [];
                            for (var j = 0; j < 3; j++) {
                                var index = i * 3 + j;
                                if (index >= data.length) {
                                    break;
                                }
                                rowData.push(data[index]);
                            }
                            totalData.push(rowData);
                        }
                        //添加查询出来的数据
                        that.setState({
                            items: that.state.items.concat(responseText.data),
                            dataSource: ds.cloneWithRows(totalData),
                            loadNext: false
                        });
                    }).done();
            } else {
                console.log("尚未登录");
            }
        });
    },


    /**
     * 初始化页面状态
     * @returns {{isLoadingTail: boolean, isRefreshing: boolean, width: number, items: Array, loadNext: boolean, keyWord: *}}
     */
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(((Util.size.width - 40)) / 3);
        var keyWord = null;
        if (this.props.requestUrl != undefined) {
            REQUEST_SPECIAL_URL = this.props.requestUrl;
            keyWord = this.props.keyWord;
        }
        return {
            isLoadingTail: false, //是否还在读取
            isRefreshing: false, //是否在刷新
            width: width, //当前宽度
            items: [], //漫画列表
            loadNext: false, //是否载入下一页
            keyWord: keyWord //搜索关键字
        };
    },
    /**
     * 在完成渲染前读取数据
     */
    componentWillMount: function () {
        this.setState({keyWord: this.props.keyWord});
        this.fetchData(0, this.state.keyWord);
    },


    /**
     * 刷新界面
     * @private
     */
    _onRefresh() {
        PAGE = 0;
        this.setState({isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this.clearData();
            this.fetchData(0, this.state.keyWord);
            this.setState({
                isRefreshing: false,
            });
        }, 1000);
    },

    /**
     * 读取下一页
     * @private
     */
    _onLoadNext: function () {
        this.setState({
            loadNext: true
        })
    },

    /**
     * 正在读取页
     * @returns {XML}
     */
    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10}}>
                    正在读取专题中...
                </Text>
            </View>
        );
    },

    /**
     * 查询无结果
     * @returns {XML}
     */
    renderNoItemView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10}}>
                    什么都没有哟...
                </Text>
            </View>
        );
    },

    /**
     * 读取下一页时展示的View
     * @returns {XML}
     */
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

    /**
     * 每一行的数据
     * @param rowData 是一个JSONArray [1,2,3,4]
     * @returns {XML}
     */
    renderRow: function (rowData) {
        var itemList = [];
        var colors = ['#E20079', '#FFD602', '#25BFFE', '#F90000', '#04E246', '#04E246', '#00AFC9'];
        for (var index = 0; index < rowData.length; index++) {
            itemList.push(
                <Item
                    key={rowData[index].id}
                    id={rowData[index].id}
                    title={rowData[index].title}
                    coverImage={rowData[index].coverImage}
                    width={this.state.width}
                    color={colors[index].color}
                    nav={this.props.navigator}
                />
            );
        }
        return (<View style={styles.itemRow} key={Math.random()+"_key"}>
            {itemList}
        </View>);
    },

    /**
     * 渲染刷新按钮
     * @returns {XML}
     */
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

    /**
     * 渲染专题
     */
    renderSpecial: function () {
        return (
            <ListView
                onEndReached={this.renderNextPage}
                contentLength={25}
                dataSource={this.state.dataSource}
                renderRow={(rowData) => this.renderRow(rowData)}
                refreshControl={this.renderRefresh()}/>
        );
    },

    /**
     * 渲染下一页
     * @param e
     */
    renderNextPage: function (e) {
        if (this.state.isLoadingTail) {
            //已经读取过一次了
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
        this.fetchData(PAGE, this.state.keyWord);
    },

    /**
     * 渲染界面
     * @returns {*}
     */
    render: function () {
        //没数据
        if (!this.state.items || this.state.items == undefined) {
            return this.renderLoadingView();
        }
        //数据为空
        else if (this.state.items.length == 0) {
            return this.renderNoItemView();
        }
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 1}}>
                    {this.renderSpecial()}
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
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Explore;