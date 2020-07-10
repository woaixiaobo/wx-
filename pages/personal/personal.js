// pages/personal/personal.js
import request from "../../utils/request"
/**点击拖动的距离变量定义 */
let startY = 0;//起始坐标
let moveY = 0;//移动是实时坐标位置
let distance = 0; //移动是实时距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'',//位移的距离
    coverTransition:'',//过渡
    userInfo:{},//用户信息
    recentPlayList:[]
  },
  //点击登录
  login(){
    let {userInfo} = this.data
    if(!userInfo.avatarUrl){
      wx.navigateTo({
        url:"/pages/login/login"
      })
    }else{
      return
    }
  },
  handleStart(event){
    //获取起始坐标,以第一个手指为准
    startY = event.touches[0].clientY;
    // console.log(startY);
    //清除上次的过渡效果
    this.setData({
      coverTransition:'',
    })
  },
  handleMove(event){
    //获取手指移动的实时位置坐标
    moveY = event.touches[0].clientY;
    //计算实时距离
    distance = moveY - startY;
    //不能向上拖动
    if(distance<=0) return;
    //只能向下拖动，并且有临界值
    if(distance>=80){
      distance = 80;
      //动态跟新coverTransform的值
      this.setData({        
        coverTransform:`translateY(${distance}rpx)`
      })
    }
  },
  handleEnd(){//松开时下拉的部分回弹
    // console.log('end');
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition:`transform .5s linear`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //  //判断本地是否有用户登录的信息数据
    //  let userInfo = wx.getStorageSync('userInfo');
    //  if(userInfo){
    //    this.setData({
    //      userInfo:JSON.parse(userInfo)
    //    })
    //  }    
    //  //请求播放记录
    //  let result = await request(`/user/record?uid=${this.data.userInfo.userId}&type=1`)
    //  console.log(result);
     
    //  this.setData({
    //    recentPlayList:result.weekData
    //  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //判断本地是否有用户登录的信息数据
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
    }    
    //请求播放记录
    let result = await request(`/user/record?uid=${this.data.userInfo.userId}&type=1`)
    console.log(result);
    
    this.setData({
      recentPlayList:result.weekData
    })
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