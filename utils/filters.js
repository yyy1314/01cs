const timeConversion = function(val, type) {
  if (val && new Date(Number(val))) {
    var now = new Date(Number(val) * 1000)
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var date = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()
    var second = now.getSeconds()

    if (type === 'Y-M-D H:M:D') {
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    } else if (type === 'Y-M-D') {
      return year + '-' + month + '-' + date
    } else if (type === 'H:M:D') {
      return hour + ':' + minute + ':' + second
    }
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  }
}
// 活动状态
const activityState_description = function(val) {
  return ['', '活动中', '报名截止', '活动结束'][val]
}

// 上下架状态
const activityState = function(val) {
  return ['', '活动中', '报名截止', '活动结束'][val]
}

// 文本省略
const textEllipsis = function(val,length=12) {
  if(val.length > length){
    return val.substr(0,12) + '...';
  }else{
    return val;
  }
}

export {
  timeConversion,
  activityState_description,
  activityState,
  textEllipsis
}
