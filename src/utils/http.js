import Axios from 'axios'

const http = {
  // HEAD requests
  checkValid: key => Axios.head(`users/${key}`),
  checkCourse: name => Axios.head(`courses/${name}`),

  // GET requests
  getPosts: ({ search, tags, sort, page, size = 10 }) => {
    let url = 'forum/posts?'
    if (search) url += `search=${search}&`
    if (tags) url += `tags=${tags.join(',')}&`
    if (sort) url += `sort=${sort}&`
    if (page) url += `page=${page}&`
    url += `size=${size}`
    return Axios.get(url)
  },
  readCourse: courseId => Axios.get(`courses/${courseId}`),
  getPost: ({ id, size = 10 }) => Axios.get(`/forum/posts/${id}?size=${size}`),
  getComments: ({ id, page, reply }) => {
    let url = `/forum/posts/${id}/comments?`
    if (page) url += `page=${page}&`
    else if (reply) url += `reply=${reply}&`
    else if (reply && page) url += `page=${page}&reply=${reply}`
    return Axios.get(url)
  },
  magicCubeFinished: _id => Axios.get(`game/${_id}/magic-cube`),
  solveThemFinished: _id => Axios.get(`game/${_id}/solve-them`),
  getFollowingActivities: () => Axios.get('user/updates'),

  // POST request
  registerUser: (username, password, email, resend) => Axios.post('users', { username, password, email, resend }),
  verifyUser: (username, token, cancel) => Axios.post(`auth/verify/${username}`, { token, cancel }),
  activateUser: (username, role, firstName, lastName, gender, school, interests) => Axios.post(`auth/activate/${username}`, { role, firstName, lastName, gender, school, interests }),
  forgotPassword: (username, email) => Axios.post('auth/forgot-password', { username, email }),
  updateUser: (username, email, firstName, lastName, school, interests) => Axios.post(`users/update/${username}`, { email, firstName, lastName, school, interests }),
  updateUserWithPassword: (username, password, email, firstName, lastName, school, interests) => Axios.post(`users/update-with-password/${username}`, { password, email, firstName, lastName, school, interests }),
  cancelToken: (username, token) => Axios.post(`auth/cancel-token/${token}`, { username }),
  resetPassword: (username, password, token) => Axios.post('auth/reset-password', { username, password, token }),
  createCourse: ({ name, description, tags, chapters }) => Axios.post('courses', { name, description, tags, chapters }),
  createPost: (title, content, tags) => Axios.post('forum/posts', { title, content, tags }),
  createComment: (id, content, reply) => Axios.post(`/forum/posts/${id}/comments`, { content, reply }),
  publishCourse: _id => Axios.post(`courses/${_id}/publish`),
  unpublishCourse: _id => Axios.post(`courses/${_id}/unpublish`),
  reactPost: (id, payload) => Axios.post(`forum/posts/${id}/react`, payload),
  reactComment: (pid, cid, payload) => Axios.post(`forum/posts/${pid}/comments/${cid}/react`, payload),
  updateUserMeterLevel: (userId, level) => Axios.post(`users/${userId}/update-level`, { level }),
  followUser: (id) => Axios.post(`/users/${id}/followers`),

  // PUT request
  updateCourse: ({ _id, name, description, tags, chapters }) => Axios.put(`courses/${_id}`, { name, description, tags, chapters }),
  updatePost: ({ id, title, content, tags }) => Axios.patch(`forum/posts/${id}`, { title, content, tags }),
  unfollowUser: (id) => Axios.put(`/users/${id}/followers`),

  // DELETE request
  deleteCourse: courseId => Axios.delete(`courses/${courseId}`),
  deletePost: postId => Axios.delete(`forum/posts/${postId}`)

}
export default http
