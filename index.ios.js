'use strict';
var React = require('react-native');
var AdSupportIOS = require('AdSupportIOS');
var Home = require('./views/home');
var About = require('./views/about');
var User = require('./views/user');
var Explore = require('./views/explore');
var Search = require('./views/search');
var Service = require('./views/service')

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
        if(tabName == "home"){
            console.log("back to home");
        }
        this.setState({
            selectedTab: tabName
        });
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

    renderHome: function () {
        var initialRoute = {
            component: Home,
            title: "漫画绅士",
            rightButtonIcon: require('image!31'),
            onRightButtonPress: this._toSearchComic,
            passProps: {
                requestUrl: Service.host + Service.getComic
            }
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
    },

    renderExplore: function () {
        var initialRoute = {
            component: Explore,
            title: "探索",
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
    },

    renderUser: function () {
        var initialRoute = {component: User, title: "我的",};
        return (<NavigatorIOS
            style={{flex:1}}
            barTintColor='#007AFF'
            titleTextColor="#fff"
            tintColor="#fff"
            translucent={false}
            initialRoute={initialRoute}
        />)
    },

    renderAbout: function () {
        var initialRoute = {component: About, title: "关于",};
        return (<NavigatorIOS
            style={{flex:1}}
            barTintColor='#007AFF'
            titleTextColor="#fff"
            tintColor="#fff"
            translucent={false}
            initialRoute={initialRoute}
        />)
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
                            {this.renderHome()}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="探索"
                            icon={require('image!4')}
                            selected={this.state.selectedTab === 'explore'}
                            onPress={this._selectTab.bind(this, 'explore')}
                        >
                            {this.renderExplore()}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="我的"
                            icon={require('image!1')}
                            selected={this.state.selectedTab === 'user'}
                            onPress={this._selectTab.bind(this, 'user')}
                        >
                            {this.renderUser()}
                        </TabBarIOS.Item>

                        <TabBarIOS.Item
                            title="关于"
                            icon={require('image!62')}
                            selected={this.state.selectedTab === 'about'}
                            onPress={this._selectTab.bind(this, 'about')}
                        >
                            {this.renderAbout()}
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
