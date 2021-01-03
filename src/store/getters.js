const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  email: state => state.user.email,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles
}
export default getters