import request from "../../utils/request"
import moment from "moment"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//是否播放
    ids:null,//歌曲id
    songDetail:[],//歌曲详情
    songPlay:[],//歌曲播放地址
    momentTime:0,//歌曲总时长
    currentTime:'00:00',//播放进度时间
    progressMove:0,//进度条更新进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //得到歌曲的id
    let ids = JSON.parse(wx.getStorageSync('songId'))
    //获取歌曲详情数据
    let result = await request('/song/detail',{ids})
    //歌曲总时长
    let momentTime = moment(result.songs[0].dt).format('mm:ss');
    this.setData({
      ids,
      songDetail:result.songs[0],
      momentTime,
    })
    this.getSongPlay(ids)
  },
  //获取歌曲播放地址
  async getSongPlay(songId){
    let songPlay = await request('/song/url',{id:songId})
    //更新状态数据
    this.setData({
      songPlay:songPlay.data
    })
  },
  //点击播放
  play(){
    if(!this.data.isPlay){
      if(this.id&&this.id===this.data.ids ){
        this.InnerAudioContext.play()
         //更新播放图标状态
        this.setData({
          isPlay:true,
        })
        //监听音频播放进度更新事件
        this.InnerAudioContext.onTimeUpdate(()=>{
          console.log(this.InnerAudioContext.currentTime*1000/this.InnerAudioContext.duration);
          
          this.setData({
            currentTime:moment(this.InnerAudioContext.currentTime*1000).format('mm:ss'),
            progressMove:this.InnerAudioContext.currentTime/this.InnerAudioContext.duration*100,
          })
        })
      }else{
        //创建音频上下文
        this.InnerAudioContext = wx.createInnerAudioContext()    
        //播放地址
        this.InnerAudioContext.src = this.data.songPlay[0].url; 
        //播放
        this.InnerAudioContext.autoplay=true
        //保存这次ID
        this.id = this.data.ids;        
        //更新播放图标状态
        this.setData({
          isPlay:true,
        })
        this.InnerAudioContext.onTimeUpdate(()=>{
          // console.log(this.InnerAudioContext.currentTime/this.InnerAudioContext.duration);
          this.setData({
            currentTime:moment(this.InnerAudioContext.currentTime*1000).format('mm:ss'),
            progressMove:this.InnerAudioContext.currentTime/this.InnerAudioContext.duration*100,
          })
        })}
    }else{
      //暂停播放
      this.InnerAudioContext.pause();
      //更新播放图标状态
      this.setData({
        isPlay:false,
      })
    }
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