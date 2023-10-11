// pages/heroDetail/heroDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curSwiper: 1,
    curIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      id: options.id
    })
    that.getHeroDetail(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getHeroDetail(id) {
    var that = this;
    var heroId = Number(id);
    wx.request({
      url: 'https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_' + heroId + '.js',
      dataType: 'json',
      method: 'GET',
      success(res) {
        var data = res.data.split("CHAMPION_DETAIL_" + heroId + "=")[1].split(";")[0];
        var detail = JSON.parse(data);
        that.setData({
          version: detail.gameVer
        })
        var championLane = detail.list.championLane;
        var placeName = {
          'bottom': '下路',
          'jungle': '打野',
          'mid': '中单',
          'support': '辅助',
          'top': '上单'
        };
        var newData = [];
        for(let k in championLane) {
          championLane[k].lanrate_tag = championLane[k].lanrate / 100 + '%'; //分路占比率
          championLane[k].lanewinrate_tag = championLane[k].lanewinrate / 100 + '%'; //胜率
          championLane[k].lanshowrate_tag = (Number(championLane[k].lanshowrate) / 100).toFixed(2) + '%'; //分路登场率
          championLane[k].placeName = placeName[k]; //分路名称
          if (Number(championLane[k].lanshowrate) > 40) { //登场率大于40
            newData.push(championLane[k]);
          }
          var temp = 0, max;
        }
        newData.forEach(item => {
          if (item.lanrate > temp) {
            temp = item.lanrate;
            max = item;
          }
        });
        that.setData({
          mainLane: max
        })
      }
    })

    wx.request({
      url: 'https://ossweb-img.qq.com/images/lol/act/img/js/hero/' + heroId + '.js',
      dataType: 'json',
      method: 'GET',
      success(res) {
        that.setData({
          heroBackImg: res.data.skins.filter(item => item.mainImg),
          heroName: res.data.hero.name,
          heroTitle: res.data.hero.title,
          heroRole: res.data.hero.roles,
          heroInfo: [{
              info: '攻',
              value: res.data.hero.attack,
              color: '#8B4513'
            },{
              info: '法',
              value: res.data.hero.magic,
              color: '#FF0000'
            }, {
              info: '防',
              value: res.data.hero.defense,
              color: '#2E8B57'
            }, {
              info: '难度',
              value: res.data.hero.difficulty,
              color: '#00BFFF'
            }
          ],
          heroSpells:res.data.spells.filter(v => v.spellKey == 'passive')
          .concat(res.data.spells.filter(v => v.spellKey == 'q'))
          .concat(res.data.spells.filter(v => v.spellKey == 'w'))
          .concat(res.data.spells.filter(v => v.spellKey == 'e'))
          .concat(res.data.spells.filter(v => v.spellKey == 'r')),
          heroIntro: res.data.hero.shortBio,
          allyTip: res.data.hero.allytips,
        })
        wx.setNavigationBarTitle({
          title: that.data.heroName
        })
      }
    })
  },

  switchSpell(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    that.setData({
      curIndex: index
    })
  },

  change(e) {
    this.setData({
      curSwiper: e.detail.current + 1
    })
  }
})