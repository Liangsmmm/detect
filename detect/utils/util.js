const formatTime = (date, hasTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let result = [year, month, day].map(formatNumber).join('-')
  if (hasTime) {
    result = result + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return result
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// string to timestamp
const strToDate = str => {
  // return Date.parse('2018-09-18 13:49') / (1000 * 60)
  var stringTime = Date.parse(str.replace(/-/g, "/")) / (1000 * 60);
  var currentTime = parseInt(Date.now() / (1000 * 60));
  return {
    currentTime: currentTime - 0,
    strTime: stringTime - 0,
    deltaTime: stringTime - currentTime
  }
}



const logsFormat = function (rowData, keyword) {
  //by函数接受一个成员名字符串做为参数
  //并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
  var by = function (name) {
    return function (o, p) {
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          var d1 = new Date(a.replace(/-/g, '/')).getTime();
          var d2 = new Date(b.replace(/-/g, '/')).getTime();
          return d2 - d1;
          // return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      }
      else {
        throw ("error");
      }
    }
  }

  return rowData.sort(by(keyword));

}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

module.exports = {
  formatTime: formatTime,
  uuid: uuid,
  strToDate: strToDate,
  logsFormat: logsFormat
}
