'use strict';

var React = require('react-native');
var {
    AppRegistry,
    Navigator,
    StyleSheet,
    TabBarIOS,
    TouchableHighlight,
    Text,
    View,
    } = React;

var Test = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.button} onPress={() => this.props.navigator.pop()}>
                    <Text>Close View</Text>
                </TouchableHighlight>
            </View>
        );
    }
});

var SampleApp = React.createClass({
    renderScene(route, navigator) {
        switch (route.id) {
            case 'tab-bar':
                return <TabBarExample navigator={navigator}/>;
                break;
            case 'test':
                return <Test navigator={navigator}/>;
        }
    },
    render() {
        return (
            <Navigator
                ref="navigator"
                renderScene={this.renderScene}
                initialRoute={{id: 'tab-bar'}}
                configureScene={(route) => {
      		return Navigator.SceneConfigs.FloatFromBottom
        }}
            />
        );
    }
});

var TabBarExample = React.createClass({
    getInitialState: function () {
        return {
            selectedTab: 'redTab',
            notifCount: 0,
            presses: 0,
        };
    },

    _renderContent: function (color, pageText, num) {
        return (
            <View style={styles.container}>
                <Text style={styles.tabText}>{pageText}</Text>
                <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
                <TouchableHighlight style={styles.button} onPress={() => this.props.navigator.push({id: 'test'})}>
                    <Text>Push New Scene</Text>
                </TouchableHighlight>
            </View>
        );
    },

    render: function () {
        return (
            <TabBarIOS
                tintColor="white"
                barTintColor="darkslateblue">
                <TabBarIOS.Item
                    title="Blue Tab"
                    systemIcon="history"
                    selected={this.state.selectedTab === 'blueTab'}
                    onPress={() => {
                    this.setState({
                      selectedTab: 'blueTab',
                    });
                  }}>
                    {this._renderContent('#414A8C', 'Blue Tab')}
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    systemIcon="history"
                    badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                    selected={this.state.selectedTab === 'redTab'}
                    onPress={() => {
            this.setState({
              selectedTab: 'redTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
                    {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    systemIcon="more"
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
                    {this._renderContent('#21551C', 'Green Tab', this.state.presses)}
                </TabBarIOS.Item>
            </TabBarIOS>
        );
    }

});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        margin: 20
    }
});

AppRegistry.registerComponent('SampleApp', () => SampleApp);

module.exports = SampleApp;
