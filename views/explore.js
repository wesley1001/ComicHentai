/**
 * Created by hope6537 on 16/3/19.
 */
/**
 * Created by vczero on 15/7/12.
 */

var React = require('react-native');
var Util = require('./util');
var Item = require('./explore/item');
var Service = require('./service');
var RESTFulService = require('./rest')
var {
    Text,
    View ,
    ScrollView,
    StyleSheet,
    ActivityIndicatorIOS,
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

    /**
     * 初始化页面状态
     * @returns {{isLoadingTail: boolean, isRefreshing: boolean, width: number, items: Array, loadNext: boolean, keyWord: *}}
     */
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(((Util.size.width - 40)) / 3);
        var releaseUrl = RESTFulService.host + RESTFulService.classification.index;
        var keyWord = null;
        if (this.props.requestUrl != undefined) {
            keyWord = this.props.keyWord;
        }
        return {
            pageMap: "",
            requestUrl: this.props.requestUrl == undefined ? releaseUrl : this.props.requestUrl,
            canRefresh: this.props.canRefresh == undefined ? true : this.props.canRefresh, //可以刷新
            canLoadNext: this.props.canLoadNext == undefined ? true : this.props.canLoadNext, //可以载入下一页
            canFilter: this.props.canFilter == undefined ? false : this.props.canFilter,//可以过滤
            beforeFilterItems: null, //过滤前的临时数据,初始为null,如果什么源数据都没有将会变成[]
            isLoadingTail: false, //是否还在读取
            isRefreshing: false, //是否在刷新
            width: width, //当前宽度
            items: this.props.items == undefined ? undefined : this.props.items, //专题列表
            dataSource: this.props.items == undefined ? null : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.items),
            loadNext: false, //是否载入下一页
            keyWord: keyWord //搜索关键字
        };
    },
    /**
     * 在完成渲染前读取数据
     */
    componentWillMount: function () {
        this.setState({keyWord: this.props.keyWord});
        //this.fetchData(0, this.state.keyWord);
        this.fetchData(this.state.pageMap, this.state.keyWord, this.state.otherParam);
    },


    /**
     * 刷新界面
     * @private
     */
    _onRefresh() {
        if (!this.state.canRefresh) {
            return;
        }
        this.setState({page: 0, pageMap: "", isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this.clearData();
            this.fetchData(this.state.pageMap, this.state.keyWord, this.state.otherParam);
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
     * 当进行过滤的时候
     * @param val
     * @private
     */
    _onFilter: function (val) {
        //先保存一发初始值
        if (this.state.beforeFilterItems == null) {
            this.setState({
                beforeFilterItems: this.state.items,

            });
        }
        //如果关键词清空状态下,读取原始数据
        if (val == undefined || val == null || val == "") {
            this.setState({
                items: this.state.beforeFilterItems,
                dataSource: this.state.dataSource.cloneWithRows(this.state.beforeFilterItems),
            });
        }
        //否则过滤
        else {
            var filterData = [];
            for (var i = 0; i < this.state.beforeFilterItems.length; i++) {
                if (this.state.beforeFilterItems[i].title.indexOf(val) != -1) {
                    filterData.push(this.state.beforeFilterItems[i]);
                }
            }
            this.clearData();
            this.setState({
                items: filterData,
                dataSource: this.state.dataSource.cloneWithRows(filterData),
            });
        }

    },

    /**
     * 清空当前数据
     */
    clearData: function () {
        this.setState({
            page: 0,
            pageMap: '',
            items: undefined,
            dataSource: this.state.dataSource.cloneWithRows([]),
        });
    },


    fetchData: function (pageMap, keyWord, otherParam) {
        //如果初始化有数据,同时禁用翻页,那就直接展示了
        if (this.props.items != undefined && !this.state.canLoadNext) {
            return;
        }
        if (keyWord == null || keyWord == undefined) {
            keyWord = "";
        }
        var that = this;
        AsyncStorage.getItem('token', function (err, token) {
            if (!err) {
                var fetchOptions = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };
                var items = that.state.items;
                if (items == undefined) {
                    items = [];
                }
                var param = {
                    pageMap: pageMap == undefined ? "" : pageMap,
                    keyWord: keyWord
                };
                if (otherParam != undefined && otherParam != null && otherParam != "") {
                    param = Util.extend(param, otherParam);
                }
                var path = that.state.requestUrl + "?data=" + encodeURIComponent(Util.encrypt(JSON.stringify(param)));
                fetch(path, fetchOptions)
                    .then((response) => response.json())
                    .then((responseText) => {
                        //创建ListView
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        var pageMap = responseText.data.pageMap;
                        var isEnd = responseText.data.isEnd;
                        var dataList = responseText.data.data;
                        var success = responseText.success;
                        var errorMsg = responseText.errorMsg;


                        var data = items.concat(dataList);
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

                        if (success) {
                            that.setState({
                                pageMap: pageMap,
                                items: items.concat(dataList),
                                dataSource: ds.cloneWithRows(totalData),
                                loadNext: false,
                                canLoadNext: !isEnd
                            });
                        } else {
                            AlertIOS.alert('网络错误', errorMsg);
                        }

                    }).done();
            } else {
                console.log("尚未登录");
            }
        });
    },

    /**
     * 远端读取数据
     * @param page
     * @param keyWord
     */
    fetchData_fade: function (page, keyWord) {
        //如果初始化有数据,同时禁用翻页,那就直接展示了
        if (this.props.items != undefined && !this.state.canLoadNext) {
            return;
        }
        if (page == null || page == undefined) {
            page = 0;
        }
        if (keyWord == null || keyWord == undefined) {
            keyWord = "";
        }
        var that = this;
        //TODO:之后去掉
        AsyncStorage.getItem('token', function (err, token) {
            if (!err) {
                var data = {
                    key: Util.key,
                    page: page,
                    keyWord: keyWord,
                    token: token
                };
                var fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                var items = that.state.items;
                if (items == undefined) {
                    items = [];
                }
                fetch(REQUEST_SPECIAL_URL, fetchOptions)
                    .then((response) => response.json())
                    .then((responseText) => {
                        //创建ListView
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        //在这里将数据处理下,读取老数据,并让其每4个Object放在一行
                        var data = items.concat(responseText.data);
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
                            items: items.concat(responseText.data),
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
     * 正在读取页
     * @returns {XML}
     */
    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10,marginBottom:10}}>
                    正在读取专题中...
                </Text>
                <ActivityIndicatorIOS size="large" color="#268DFF"/>
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
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10,marginBottom:10}}>
                    找不到,怪我咯...
                </Text>
                <ActivityIndicatorIOS size="large" color="#268DFF"/>
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
                    coverImage={rowData[index].coverTitle}
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
        //去掉刷新
        if (this.state.canRefresh) {
            return (
                <ListView
                    onEndReached={this.renderNextPage}
                    contentLength={25}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderRow(rowData)}
                    refreshControl={this.renderRefresh()}/>
            );
        } else {
            return (
                <ListView
                    onEndReached={this.renderNextPage}
                    contentLength={25}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderRow(rowData)}
                />
            );
        }

    },

    /**
     * 渲染下一页
     * @param e
     */
    renderNextPage: function (e) {
        if (!this.state.canLoadNext) {
            return;
        }
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
        this.fetchData(this.state.pageMap, this.state.keyWord, this.state.otherParam);
    },

    /**
     * 渲染过滤搜索框
     * @returns {XML}
     */
    renderFilter: function () {
        var placeHolder = "搜索专题..";
        return (<View style={{height:35}}>
            <TextInput style={styles.search} placeholder={placeHolder} clearButtonMode="always"
                       autoCapitalize="none" autoCorrect={false} onChangeText={(val)=>this._onFilter(val)}
                       onSubmitEditing={(val)=>this._onFilter(val.nativeEvent.text)}/>
        </View>)
    },

    /**
     * 渲染界面
     * @returns {*}
     */
    render: function () {
        var extra = null;
        if (this.state.canFilter) {
            extra = this.renderFilter();
        }
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
                {extra}
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
    search: {
        fontSize: 14,
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
    }
});

module.exports = Explore;