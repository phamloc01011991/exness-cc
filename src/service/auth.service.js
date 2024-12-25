import request from '../utils/request'
import { setAuth } from '../utils/request'
const API_URL = 'auth/signin'

class AuthService {
  async login(user) {
    console.log('user:', user)
    const postData = {
      phone: user.user.sdt,
      password: user.user.password
    }
    return await request
      .post(API_URL, postData)
      .then((response) => {
        console.log('a');
        localStorage.setItem('user', JSON.stringify(response.data))
        setAuth()
        return response.data
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  logout() {
    localStorage.removeItem('user')
  }
}

export default new AuthService()
