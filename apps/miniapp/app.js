App({
  globalData: {
    appName: 'LOVEQIGU'
  },

  onLaunch() {
    wx.setStorageSync('appName', this.globalData.appName);
  }
});
