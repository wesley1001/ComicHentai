/**
 * Created by hope6537 on 16/1/30.
 * 主页用TabBar
 */
var React = require('react-native');

var {
    AppRegistry,
    Component,
    Image,
    StyleSheet,
    Text,
    View,
    TabBarIOS,
    NavigatorIOS
    } = React;

var SearchScreen = require('./SearchScreen.js');
var Explore = require('./Explore.js');
var User = require('./User.js');

function _icon(imageUri) {
    return {
        uri: imageUri,
        isStatic: true
    };
}

class IndexTab extends Component {
    //默认选择欢迎页
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'comicList'
        };
    }

    render() {
        return (
            <TabBarIOS selectedTab={this.state.selectedTab}>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'comicList'}
                    icon={_icon('favorites')}
                    title='首页'
                    onPress={() => { this.setState({ selectedTab: 'comicList', }); }}>
                    <NavigatorIOS
                        //这样就讲Navigator套在了SearchScreen里
                        style={styles.container}
                        initialRoute={{title: '漫画绅士',component: SearchScreen}}
                    />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'welcome'}
                    title='探索'
                    onPress={() => { this.setState({ selectedTab: 'welcome', }); }}>
                    <Explore/>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'more'}
                    title='我的'
                    onPress={() => { this.setState({ selectedTab: 'more', }); }}>
                    <User/>
                </TabBarIOS.Item>
            </TabBarIOS> );
    }
}
;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

module.exports = IndexTab;
