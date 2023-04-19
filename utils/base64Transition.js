
const getBase64 = function(file) {
  console.log(file)
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file.raw)
    reader.onload = function() {
      imgResult = reader.result
    }
    reader.onerror = function(error) {
      reject(error)
    }
    reader.onloadend = function() {
      resolve(imgResult)
    }
  })
}
export default getBase64
