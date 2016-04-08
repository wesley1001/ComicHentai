var Service = {
    host: 'http://ding.hope6537.com:3000',
    login: '/user/login',
    loginByToken: '/user/login/token',
    getUser: '/user/get',
    createUser: '/user/create',
    getMessage: '/message/get',
    getChapter: '/message/chapter',
    getSpecial: '/special/get',
    searchSpecial: '/special/search',
    getComic: '/comic/get',
    searchComic: '/comic/search',
    getUserFavorite: '/user/favorite',
    getUserSpecial: '/user/special',
    addMessage: '/message/add',
    updatePassword: '/user/password/update',
    deleteUser: '/user/delete'
};

module.exports = Service;