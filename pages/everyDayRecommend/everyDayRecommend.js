import request from "../../utils/request"
import PubSub from "pubsub-js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList:[],//歌曲数据
    month:0,
    day:0,
    index:0,//当前歌曲的下标
    songId:null,//歌曲id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取每日推荐歌曲数据
    let result = await request('/recommend/songs')
    // console.log(result);
    //获取当前日期
    // let Date = new Date()
    let month = new Date().getDate()
    let day = new Date().getMonth()+1
    // console.log(month,day);
    //更新数据状态
    this.setData({
      songList:result.recommend,
      month,
      day,
    })
    //订阅消息
    PubSub.subscribe('preSong', (msg,data)=>{
      let {index,songList} = this.data
       //根据下标找到对应的id
      if(index===0){
        index=songList.length-1
      }
      let songId = songList[index-1].id
      //跟新id
      this.setData({
        songId,
        index:index-1,
      })
      // 跳转到音乐页面
      // wx.navigateTo({
      //   url: "/pages/songDetail/songDetail?id="+songId,
      // })
      PubSub.publish('songId', songId);
    }); 
    PubSub.subscribe('nextSong', (msg,data)=>{
      let {index,songList} = this.data
       //根据下标找到对应的id
      if(index===songList.length-1){
        index=0
      }
      let songId = songList[index+1].id
      //跟新id
      this.setData({
        songId,
        index:index+1,
      })
       // 跳转到音乐页面
      // wx.redirectTo({
      //   url: "/pages/songDetail/songDetail?id="+songId,
      // })
      PubSub.publish('songId', songId);
    }); 
  },
  //点击获取音乐详情
  handleId(event){
    //保存音乐详情的id和音乐的名字
    wx.setStorageSync('songId', JSON.stringify(event.currentTarget.dataset.id))
    //保存当前下标
    let index = event.currentTarget.dataset.index;
    //跟新状态
    this.setData({
      index,
    })
    // 跳转到音乐页面
    wx.navigateTo({
      url: "/pages/songDetail/songDetail?id="+event.currentTarget.dataset.id,
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