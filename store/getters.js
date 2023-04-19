const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
  role_id: state => state.user.role_id,
  permissions: state => state.user.permissions,
  visitedViews: state => state.tagsView.visitedViews,
  loadingInstance: state => state.app.loadingInstance,
  isLoading: state => state.app.isLoading
}
export default getters
