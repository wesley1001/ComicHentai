/**
 * Created by vczero on 15/7/12.
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
    RefreshControl,
    TouchableHighlight,
    } = React;

var REQUEST_COMIC_URL = Service.host + Service.getComic;
var Home = React.createClass({

    fetchData: function () {
        var data = {
            "key": Util.key
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
                console.log(responseText);
                this.setState({
                    items: responseText.data.comicList
                });
            }).done();
    },


    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(Util.size.width);
        return {
            isRefreshing: false,
            width: width,
            items: null
        };

    },

    componentDidMount: function () {
        this.fetchData()
    },

    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this.fetchData()
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

    renderComic: function (items) {
        console.log("当前漫画");
        console.log(items);

        var comicList = [];
        for (var i = 0; i < items.length; i++) {
            comicList.push(
                <ItemBlock
                    key={items[i].comicId}
                    comic={items[i]}
                    width={this.state.width}
                    nav={this.props.navigator}
                />
            );
        }
        return (
            <ScrollView style={styles.container} refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#ff0000"
                title="刷新中..."
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor="#ffff00"
              />
            }>
                {comicList}
            </ScrollView>
        );
    },


    render: function () {
        if (!this.state.items) {
            return this.renderLoadingView();
        }
        var items = this.state.items;
        return this.renderComic(items)
    }


});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Home;
