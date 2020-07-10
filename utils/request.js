import config from "./config"
export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.netHost+url,
      data,
      method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        cookie:JSON.parse(wx.getStorageSync('cookies')||'[]').toString()
      }, // 设置请求的 header
      success: (res)=>{
        // success
        console.log(res.data);
        if(data.isLogin){//如果是登录请求
          wx.setStorage({
            key: 'cookies',
            data:JSON.stringify(res.cookies),
          })
        }
        resolve(res.data)
      },
      fail: function(err) {
        // fail
        console.log(err);
        reject(err)
      },
      complete: function() {
        // complete
      }
    })
  })
}