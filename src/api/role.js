import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/system/getRoleWithPrivilege',
    method: 'get'
  })
}

export function getAllUser() {
  return request({
    url: '/system/all',
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: `/system/setUserRole`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
