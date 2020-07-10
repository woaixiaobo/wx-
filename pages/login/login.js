import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//用户名
    password:'',//密码
  },

  //监听表单项，收集表单项数据
  handleInput(event){
    /**使用id传值 */
    // let type = event.currentTarget.id
    //使用data-type传值
    let type = event.target.dataset.type
    this.setData({
      [type]:event.detail.value
    })
  },

  //登录
  async login(){
    /**
     * 1.收集表单项数据
     * 2.前端验证
     * 3.后端验证
     */
    //1.收集数据
    let {phone,password} = this.data
    //2.前端验证
    if(!phone || !password){
      //前端验证不通过
      this.showToast('用户名密码错误')
    }else{//前端验证通过
      //3.后端验证
      let result = await request(`/login/cellphone?phone=${phone}&password=${password}`,{isLogin:true})
      console.log(result);
      if(result.code===400){//手机号错误
        this.showToast('手机号错误')
      }else if(result.code===502){//密码错误
        this.showToast('密码错误')
      }else if(result.code===200){//登录成功
        this.showToast('登录成功','success')
        //保存用户数据到本地
        wx.setStorageSync('userInfo',JSON.stringify(result.profile));
        //跳转到个人中心
        wx.switchTab({
          url: '/pages/personal/personal',
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }
    }
  },
  showToast(title='',icon='none'){
    wx.showToast({
      title:title,
      icon
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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