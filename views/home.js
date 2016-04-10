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
    ActivityIndicatorIOS,
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

    /**
     * 初始化状态
     * @returns {{canRefresh: boolean, canLoadNext: boolean, isLoadingTail: boolean, isRefreshing: boolean, width: number, items: *, dataSource: null, loadNext: boolean, keyWord: *}}
     */
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(Util.size.width);
        var keyWord = null;
        if (this.props.requestUrl != undefined) {
            REQUEST_COMIC_URL = this.props.requestUrl;
            keyWord = this.props.keyWord;
        }
        return {
            canRefresh: this.props.canRefresh == undefined ? true : this.props.canRefresh, //可以刷新
            canLoadNext: this.props.canLoadNext == undefined ? true : this.props.canLoadNext, //可以载入下一页
            canFilter: this.props.canFilter == undefined ? false : this.props.canFilter,//可以过滤
            beforeFilterItems: null, //过滤前的临时数据,初始为null,如果什么源数据都没有将会变成[]
            isLoadingTail: false, //是否还在读取
            isRefreshing: false, //是否在刷新是否还在读取
            width: width, //当前宽度
            items: this.props.items == undefined ? undefined : this.props.items, //漫画列表
            dataSource: this.props.items == undefined ? null : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.items),
            loadNext: false, //是否载入下一页
            keyWord: keyWord //搜索关键字
        };
    },

    /**
     * 在渲染前读取
     */
    componentWillMount: function () {
        this.setState({keyWord: this.props.keyWord});
        this.fetchData(0, this.state.keyWord);
    },


    /**
     * 刷新时的操作
     * @private
     */
    _onRefresh() {
        if (!this.state.canRefresh) {
            return;
        }
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
     * 载入时更新状态
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
                if (this.state.beforeFilterItems[i].comicTitle.indexOf(val) != -1) {
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
        PAGE = 0;
        this.setState({
            items: undefined,
            dataSource: this.state.dataSource.cloneWithRows([]),
        });
    },

    /**
     * 远端读取数据
     * @param page
     * @param keyWord
     */
    fetchData: function (page, keyWord) {
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
                fetch(REQUEST_COMIC_URL, fetchOptions)
                    .then((response) => response.json())
                    .then((responseText) => {
                        //创建ListView
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        that.setState({
                            items: items.concat(responseText.data),
                            dataSource: ds.cloneWithRows(items.concat(responseText.data)),
                            loadNext: false
                        });
                    }).done();
            } else {
                console.log("尚未登录");
            }
        });
    },

    /**
     * 载入页
     * @returns {XML}
     */
    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10,marginBottom:10}}>
                    正在读取漫画中...
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
     * 加载中
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
     * @param rowData 是一个JSONArray 包含对象
     * @returns {XML}
     */
    renderRow: function (rowData) {
        return (<ItemBlock
            key={rowData.comicId}
            comic={rowData}
            width={this.state.width}
            nav={this.props.navigator}
        />);
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
     * 渲染漫画
     * @returns {XML}
     */
    renderComic: function () {
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
        PAGE += 1;
        this.fetchData(PAGE, this.state.keyWord);
    },

    /**
     * 渲染过滤搜索框
     * @returns {XML}
     */
    renderFilter: function () {
        var placeHolder = "在专题内搜索漫画..";
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
        if (!this.state.items || this.state.items == undefined) {
            return this.renderLoadingView();
        }
        else if (this.state.items.length == 0) {
            return (<View style={{ flex: 1}}>{extra}{this.renderNoItemView()}</View>);
        }
        return (
            <View style={{ flex: 1}}>
                {extra}
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

module.exports = Home;
