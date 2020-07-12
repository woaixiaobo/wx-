import request from "../../utils/request"
import moment from "moment"
import PubSub from "pubsub-js"
//获取全局app实例
let appInstance = getApp();
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
    afterCurrentTime:0,//拖动后的播放时间
    progressMove:0,//进度条更新进度
    rotate:-20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options.id);
    //得到歌曲的id,路由传参
    let ids = options.id
    //获取音乐详情
    this.getSongPlay(ids)
    //获取歌曲详情数据
    let result = await request('/song/detail',{ids})
     //消息订阅
    PubSub.subscribe('songId',async(msg,data)=>{
      result = await request('/song/detail',{ids:data})
      this.setData({
        songDetail:result.songs[0],
        ids:result.songs[0].id,
      })
      let {ids} = this.data
      //跟新音乐播放地址
      this.getSongPlay(ids)
      //歌曲初始化
      this.songInit(result,ids);
    }) 
    //歌曲初始化
    this.songInit(result,ids);
  },

  //歌曲初始化
  async songInit(result,ids){
     //歌曲总时长
    let momentTime = moment(result.songs[0].dt).format('mm:ss');
    this.setData({
      ids,
      songDetail:result.songs[0],
      momentTime,
    })
      //设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name,
      success: function(res) {
        // success
      }
    })
    // console.log(appInstance.globalData.isMusicolay,appInstance.globalData.musicId, this.data.ids);
    
    //创建音频上下文
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    //判断当前歌曲是否再播放
    if(appInstance.globalData.isMusicolay&&appInstance.globalData.musicId === this.data.ids){
      //当前页面在播放
      this.setData({
        isPlay:true,
      })
      this.BackgroundAudioManager.onTimeUpdate(()=>{
        // console.log(this.InnerAudioContext.currentTime/this.InnerAudioContext.duration);
        this.setData({
          currentTime:moment(this.BackgroundAudioManager.currentTime*1000).format('mm:ss'),
          progressMove:this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration*100,
        })
      })
    }
    //部署监听（播放，暂停，停止）
    this.BackgroundAudioManager.onPlay(()=>{
      console.log('play');
      //修改全局的状态
      appInstance.globalData.isMusicolay=true;
      appInstance.globalData.musicId=this.data.ids;
      //更新播放图标状态
      this.setData({
        isPlay:true,
        rotate:0
      })
      
    })
    this.BackgroundAudioManager.onPause(()=>{
      console.log('pause');
        //修改全局的状态
      appInstance.globalData.isMusicolay=false;
      //更新播放图标状态
      this.setData({
        isPlay:false,
      })
    })
    this.BackgroundAudioManager.onStop(()=>{
      console.log('stop');
       //修改全局的状态
      appInstance.globalData.isMusicolay=false;
      //更新播放图标状态
      this.setData({
        isPlay:false,
      })
    })
    
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
      
        //播放title 必填
        this.BackgroundAudioManager.title=this.data.songDetail.ar[0].name
        //播放地址
        this.BackgroundAudioManager.src = this.data.songPlay[0].url; 
        //播放
        this.BackgroundAudioManager.autoplay=true
        this.BackgroundAudioManager.onTimeUpdate(()=>{
          // console.log(this.InnerAudioContext.currentTime/this.InnerAudioContext.duration);
          if(!appInstance.globalData.flag){
            this.setData({
              currentTime:moment(this.BackgroundAudioManager.currentTime*1000).format('mm:ss'),
              progressMove:this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration*100,
            })
          }
        })
      // }
    }else{
      //暂停播放
      this.BackgroundAudioManager.pause();
    }
  },
  //上一首
  preSong(){
    this.BackgroundAudioManager.stop();
    this.setData({
      isPlay:false
    })
    PubSub.publish('preSong', 'pre');
  },
  //下一首
  nextSong(){
    this.setData({
      isPlay:false
    })
    this.BackgroundAudioManager.stop();
    PubSub.publish('nextSong', 'next');
  },
  //点击进度条
  touchStart(event){
    let {progressMove} = this.data
    //进度条百分比进度
    progressMove = (event.touches[0].clientX-84)/225 * 100
    console.log(progressMove/100);
    //获取歌曲总时长，并且转化进度条对应的百分比
    let {dt} = this.data.songDetail
    let currentTime = Math.floor(dt * (progressMove/100))/1000
    console.log(currentTime);
    //跳到指定位置播放
    this.BackgroundAudioManager.seek(currentTime)
    this.setData({
      progressMove
    })
  },
  //拖动进度条
  touchMove(event){
     //拖动状态
    appInstance.globalData.flag=true;
    let {progressMove} = this.data
    //进度条百分比进度
    progressMove = (event.changedTouches[0].clientX-84)/225 * 100
    // console.log(progressMove/100);
    //获取歌曲总时长，并且转化进度条对应的百分比
    let {dt} = this.data.songDetail
    let afterCurrentTime = Math.floor(dt * (progressMove/100))/1000
    // console.log(afterCurrentTime);
    console.log(moment(afterCurrentTime*1000).format('mm:ss'));
    //跟新状态
    // let update = this.throttle(()=>{
      this.setData({
        progressMove,
        currentTime:moment(afterCurrentTime*1000).format('mm:ss'),
        afterCurrentTime,
      })
    // },100)
    // update();
  },
  //触点结束，只有拖动时才触发
  touchEnd(event){
    console.log(appInstance.globalData.flag);
    if(appInstance.globalData.flag){
      this.BackgroundAudioManager.seek(this.data.afterCurrentTime)
      appInstance.globalData.flag=false;
    }
  },
  //自定义节流
  throttle(callback,deplay){
    let pre = 0;
    return function(event){
      const current = Date.now();
      if(current-pre>deplay){
        callback.call(this,event)
        pre = current
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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