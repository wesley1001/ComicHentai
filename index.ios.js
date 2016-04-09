'use strict';
var React = require('react-native');
var AdSupportIOS = require('AdSupportIOS');
var Home = require('./views/home');
var About = require('./views/about');
var User = require('./views/user');
var Explore = require('./views/explore');
var Search = require('./views/search');

var {
    StyleSheet,
    View,
    TabBarIOS,
    NavigatorIOS,
    AppRegistry,
    StatusBarIOS,
    } = React;


var navigator = null;
StatusBarIOS.setStyle('light-content');
var ComicHentai = React.createClass({
    statics: {
        title: '主页',
        description: '选项卡'
    },

    getInitialState: function () {
        return {
            selectedTab: 'home',
        };
    },
    _selectTab: function (tabName) {
        this.setState({
            selectedTab: tabName
        });
    },

    _addNavigator: function (component, title) {
        var data = null;
        if (title === '探索') {
            data = this.state.data;
        }
        var initialRoute;
        if (title == "漫画绅士") {
            initialRoute = {
                component: component,
                title: title,
                rightButtonIcon: require('image!31'),
                onRightButtonPress: this._toSearchComic
            }
            return (<NavigatorIOS
                ref={"comic_nav"}
                style={{flex:1}}
                barTintColor='#007AFF'
                titleTextColor="#fff"
                tintColor="#fff"
                translucent={false}
                initialRoute={initialRoute}
            />)
        }
        else if (title == "探索") {
            initialRoute = {
                component: component,
                title: title,
                rightButtonIcon: require('image!31'),
                onRightButtonPress: this._toSearchSpecial
            }
            return (<NavigatorIOS
                ref={"explore_nav"}
                style={{flex:1}}
                barTintColor='#007AFF'
                titleTextColor="#fff"
                tintColor="#fff"
                translucent={false}
                initialRoute={initialRoute}
            />)
        }
        else {
            initialRoute = {component: component, title: title, passProps: {data: data}};
            return (<NavigatorIOS
                style={{flex:1}}
                barTintColor='#007AFF'
                titleTextColor="#fff"
                tintColor="#fff"
                translucent={false}
                initialRoute={initialRoute}
            />)
        }

    },

    _toSearchComic: function () {
        if (this.refs.comic_nav == undefined) {
            return;
        }
        this.refs.comic_nav.push({
            component: Search,
            title: '搜索页',
            passProps: {type: "comic"}
        });
    },

    _toSearchSpecial: function () {
        if (this.refs.explore_nav == undefined) {
            return;
        }
        this.refs.explore_nav.push({
            component: Search,
            title: '搜索页',
            passProps: {type: "special"}
        });
    },

    render: function () {
        navigator = this.props.navigator;
        return (
            <View style={{flex:1}}>
                <View style={{ flex: 1, opacity: 1}}>
                    <TabBarIOS barTintColor="#FFF">
                        <TabBarIOS.Item
                            icon={require('image!29')}
                            title="首页"
                            selected={this.state.selectedTab === 'home'}
                            onPress={this._selectTab.bind(this, 'home')}
                        >
                            {this._addNavigator(Home, '漫画绅士')}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="探索"
                            icon={require('image!4')}
                            selected={this.state.selectedTab === 'explore'}
                            onPress={this._selectTab.bind(this, 'explore')}
                        >
                            {this._addNavigator(Explore, '探索')}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="我的"
                            icon={require('image!1')}
                            selected={this.state.selectedTab === 'user'}
                            onPress={this._selectTab.bind(this, 'user')}
                        >
                            {this._addNavigator(User, '我的')}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="关于"
                            icon={require('image!62')}
                            selected={this.state.selectedTab === 'about'}
                            onPress={this._selectTab.bind(this, 'about')}
                        >
                            {this._addNavigator(About, '关于')}
                        </TabBarIOS.Item>
                    </TabBarIOS>
                </View>
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginBottom: 150,
        alignItems: 'center',
    },
});

AppRegistry.registerComponent('ComicHentai', () => ComicHentai);
