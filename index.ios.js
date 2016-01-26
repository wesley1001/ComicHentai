var React = require('react-native');
var Welcome = require('./welcome.ios.js');
var More = require('./more.ios.js');
var ComicList = require('./comicList.ios.js')
var {
    AppRegistry,
    Component,
    Image,
    StyleSheet,
    Text,
    View,
    TabBarIOS
    } = React;

function _icon(imageUri) {
    return {
        uri: imageUri,
        isStatic: true
    };
}


class ComicHentai extends Component {

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
                <ComicList/>
            </TabBarIOS.Item>
            <TabBarIOS.Item
                selected={this.state.selectedTab === 'welcome'}
                title='探索'
                onPress={() => { this.setState({ selectedTab: 'welcome', }); }}>
                <Welcome/>
            </TabBarIOS.Item>
            <TabBarIOS.Item
                selected={this.state.selectedTab === 'more'}
                title='我的'
                onPress={() => { this.setState({ selectedTab: 'more', }); }}>
                <More/>
            </TabBarIOS.Item>
        </TabBarIOS> );
    }
}

//最后注册组件
AppRegistry.registerComponent('ComicHentai', () => ComicHentai);
