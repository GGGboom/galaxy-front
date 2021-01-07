import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/blog/all',
    method: 'get',
    params: query
  })
}

export function fetchBLog(id) {
  return request({
    url: '/blog/getBlog',
    method: 'get',
    params: { blogId: id }
  })
}

export function deleteBlog(blogId) {
  return request({
    url: '/blog/delete',
    method: 'get',
    params: { blogId }
  })
}

export function createBlog(data) {
  return request({
    url: '/blog/add',
    method: 'post',
    data
  })
}

export function updateBlog(data) {
  return request({
    url: '/blog/update',
    method: 'post',
    data
  })
}

export function fetchMyBlog() {
  return request({
    url: '/blog/mine',
    method: 'get'
  })
}
