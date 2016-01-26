/**
 * 漫画展示List
 * Created by hope6537 on 16/1/26.
 */
import React, {
    AppRegistry,
    Component,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

//之后换成Hope的URL
var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 1;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;
var RESPONSE_DATA = [];


class ComicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
        };
    }

    componentDidMount() {
        //this.fetchData();
        this.fetchDataOffline();
    }

    fetchData() {
        fetch(REQUEST_URL)
        //根据URL得到数据,然后json之
            .then((response) => response.json())
            //将数据转化并放到数据源里
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
                    loaded: true,
                });
            })
            .done();
    }
    //离线假数据
    fetchDataOffline() {
        for(var i = 0 ; i < 25 ; i++){
            RESPONSE_DATA[i]={
                id: i+'-'+parseInt(Math.random()*1000),
                title: '漫画名称'+parseInt(Math.random()*1000),
                author: '漫画作者'+parseInt(Math.random()*1000),
                image: 'http://resizing.flixster.com/6xF9PyshnlqT6g4OU9xVQFLnr9g=/54x80/dkpu1ddg7pbsk.cloudfront.net/movie/11/20/33/11203306_ori.jpg'
            };
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(RESPONSE_DATA),
            loaded: true,
        });
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderMovie}
                style={styles.listView}
            />
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading Comics...
                </Text>
            </View>
        );
    }

    renderMovie(comic) {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: comic.image}}
                    style={styles.thumbnail}
                />
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{comic.title}</Text>
                    <Text style={styles.author}>{comic.author}</Text>
                </View>
            </View>

        );
    }
}
;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    rightContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    author: {
        textAlign: 'center',
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
});


module.exports = ComicList;