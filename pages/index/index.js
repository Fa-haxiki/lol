//index.js
const app = getApp()

Page({
  data: {
    hero: []
  },

  onLoad: function () {
    this.getHerosList()
  },

  getHerosList() {
    var that = this;
    wx.request({
      url: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js',
      dataType: 'json',
      method: 'GET',
      success(res) {
        that.setData({
          hero: res.data.hero
        })
      }
    })
  },

  goToDetail(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/heroDetail/heroDetail?id=' + id,
    })
  }

})
