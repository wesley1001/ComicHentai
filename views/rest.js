/**
 * RESTFul Service Interfaces
 * see at https://github.com/ComicHentai/comic-doc/blob/master/interface.md
 * @type {{host: string, user: {signIn: string, signUp: string, updated: string, volatileUser: string}, welcome: {index: string}, comic: {index: string}, search: {index: string, result: string}, classification: {index: string, details: string}, mine: {index: string, collection: string, special: string, special_content: string, history: string}}}
 */
var RESTFulService = {
    host: 'http://ding.hope6537.com:8080',
    user: {
        signIn: 'user/signIn',
        signUp: '/user/signUp',
        updated: "/user/updated",
        volatileUser: 'user/volatileUser',
    },
    welcome: {
        index: '/welcome/index',
    },
    comic: {
        index: '/comic/index'
    },
    search: {
        index: '/search/index',
        result: '/search/result'
    },
    classification: {
        index: "/classification/index",
        details: "/classification/details"
    },
    mine: {
        index: "/mine/index",
        collection: '/mine/collection',
        special: '/mine/special',
        special_content: '/mine/special/content',
        history: "history"
    }
};
module.exports = RESTFulService;