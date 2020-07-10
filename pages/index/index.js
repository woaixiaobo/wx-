// pages/index/index.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//banner 轮播图数据
    recommendListData:[],//推荐歌曲数据
    topList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    //轮播图数据请求
    let bannerListData = await request('/banner',{type:2});
    this.setData({
      bannerList:bannerListData.banners,
    })
    //推荐歌曲请求数据
    let recommendListData = await request('/personalized')
    this.setData({
      recommendListData:recommendListData.result,
    })
    //排行榜数据请求
    //定义数组容器
    let topArr=[];
    //需要排行榜的个数
    let topNum = 4;
    for(let i = 0;i<topNum;i++){
      let topList = await request(`/top/list?idx=${i}`)
      topArr.push({playlistName:topList.playlist.name,tracks:topList.playlist.tracks.slice(0,3)})
    }
    //更新数据状态
    this.setData({
      topList:topArr,
    })
  },
  //跳转到每日推荐页面
  everyDayRecomment(){
    wx.navigateTo({
      url: '/pages/everyDayRecommend/everyDayRecommend',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})