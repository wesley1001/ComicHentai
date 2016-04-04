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

    fetchData: function (page, keyWord) {
        if (!this.state.canLoadNext) {
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


    /**
     * 初始化状态
     * @returns {{canRefresh: boolean, canLoadNext: boolean, isLoadingTail: boolean, isRefreshing: boolean, width: number, items: *, dataSource: null, loadNext: boolean, keyWord: *}}
     */
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(Util.size.width);
        var keyWord = null;
        if (this.props.requestUrl != undefined) {
            console.log("请求变更为" + this.props.requestUrl);
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
            items: this.props.items == undefined ? [] : this.props.items, //漫画列表
            dataSource: this.props.items == undefined ? null : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.items),
            loadNext: false, //是否载入下一页
            keyWord: keyWord //搜索关键字
        };
    },

    componentWillMount: function () {
        this.setState({keyWord: this.props.keyWord});
        this.fetchData(0, this.state.keyWord);
    },


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

    _onLoadNext: function () {
        this.setState({
            loadNext: true
        })
    },

    _onFilter: function (val) {
        console.log("值为" + val);
        //先保存一发初始值
        if (this.state.beforeFilterItems == null) {
            console.log("过滤前的值为空,需要保存");
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
            console.log(filterData);
            this.clearData();
            this.setState({
                items: filterData,
                dataSource: this.state.dataSource.cloneWithRows(filterData),
            });
            console.log(this.state.items);
        }

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

    renderNoItemView: function () {
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'stretch',textAlign: 'center',fontSize:14,marginTop:10}}>
                    什么都没有哟...
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

    renderNextPage: function (e) {
        console.log('onEndReached', this.state.isLoadingTail);
        if (!this.state.canLoadNext) {
            return;
        }
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
        this.fetchData(PAGE, this.state.keyWord);
    },

    renderFilter: function () {
        var placeHolder = "专题内搜索.."
        return (<View style={{height:35}}>
            <TextInput style={styles.search} placeholder={placeHolder} clearButtonMode="always"
                       autoCapitalize="none" autoCorrect={false} onChangeText={(val)=>this._onFilter(val)}
                       onSubmitEditing={(val)=>this._onFilter(val.nativeEvent.text)}/>
        </View>)
    },

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
