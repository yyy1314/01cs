import uploadRequest from '@/utils/uploadRequest'
import request from '@/utils/request'

export function uploadImages(file) {
  console.log(file)
  return uploadRequest({
    url: '/base64',
    method: 'POST',
    data: { base64: file.data }
  })
}

// 上传base64 图片
export function putFile(data) {
  return request({
    url: '/putFile',
    method: 'POST',
    data
  })
}

