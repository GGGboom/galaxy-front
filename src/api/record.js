import request from '@/utils/request'

export function fetchAllRecord(pageNum, pageSize) {
  return request({
    url: '/record/all',
    method: 'get',
    params: { pageNum: pageNum, pageSize: pageSize }
  })
}
