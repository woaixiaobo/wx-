// pages/video/video.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//视频导航标签属性
    navId:null,//导航标识
    videoList:[],//视频列表数据
    videoContent:'',
    videoId:'',
    isFresh:false,//是否以下拉
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    //验证是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      //提示用户登录
      wx.showToast({
        title:'请先登录'
      })
      //跳转
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }
    let videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupList.data.slice(0,14),
      navId:videoGroupList.data[0].id,//设置默认的选中底部边框
    })
    this.getVideoList(this.data.navId)
  },
  //获取列表视频数据
  async getVideoList(navId){
    let videoList = await request(`/video/group`,{id:navId})
    //关闭消息提示框
    wx.hideLoading();
    this.setData({
      videoList:videoList.datas,
      isFresh:false,//下拉刷新回去
    })
  },
  //点击切换视频分类
  handleNavId(event){//注意原本得到的数据是number类型的。但是在传递过程中（event）变为了string类型
    this.setData({
      // navId:+event.currentTarget.id
      // navId:event.currentTarget.id *1
      navId:event.currentTarget.id>>>0,//强制转换成number类型
      videoList:[],//清空之前视频数据
    })
    wx.showLoading({
      title:'正在加载'
    })
    this.getVideoList(this.data.navId)
  },
  //播放
  handlePlay(event){
    /**
     * 1.点击新的video视频的时候关掉之前播放的视频
     * 2.通过 API 当中的wx.createVideoContext(string id, Object this) 创建上下文对象
     */
    /*if(!this.data.videoContent){
      let videoContent = wx.createVideoContext(event.currentTarget.id)
      this.setData({
        videoContent,
      })
      }else{
        this.data.videoContent.stop();
        let videoContent = wx.createVideoContext(event.currentTarget.id)
        this.setData({
          videoContent,
        })
      }*/
        //保存点击的视频的id
        let vid = event.currentTarget.id;
        this.setData({
          videoId:vid,
        })
        //创建这个视频的上下文
        this.videoContent = wx.createVideoContext(vid)
        //虚拟机中多个视频轮流点击时，标签元素虽然消失了但是声音还在，所以用seek方法解决，
        //自动播放使用video的属性 autoplay
        this.videoContent.seek();

        //判断上一次是否执行了播放，是的话调用保存的上下文停止播放
      // this.vid!==vid&&this.videoContent && this.videoContent.stop()
      //保存这次播放的ID
      // this.vid = vid;
      //保存这次的播放视频的上下文
      // this.videoContent = wx.createVideoContext(vid)
  },
  //下拉回调
  handleFresh(){
    //请求最新的数据
    this.getVideoList(this.data.navId)
  },
  handleTolower(){
    // console.log(1);
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
    console.log(1);
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面到底啦~');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/pages/video/video',
      // imageUrl: '/static/images/nvsheng.jpg'
    }
  }
})