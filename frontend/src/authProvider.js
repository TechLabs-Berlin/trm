import { decode } from 'jsonwebtoken'

import config from './config'

const authProvider = {
  login: ({ code }) =>  {
      const request = new Request(config.authFnURL, {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      return fetch(request)
          .then(response => {
              if (response.status < 200 || response.status >= 300) {
                  throw new Error(response.statusText);
              }
              return response.json();
          })
          .then(({ token }) => {
              localStorage.setItem('token', token);
          });
  },
  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
  checkAuth: (args) => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject()
  },
  checkError: (err) => {
    if('graphQLErrors' in err) {
      for(const gqlerr of err.graphQLErrors) {
        if('code' in gqlerr.extensions) {
          if(gqlerr.extensions.code === 'invalid-jwt') {
            return Promise.reject('Please log in again')
          }
        }
      }
    }
    return Promise.resolve()
  },
  getPermissions: () => {
    const token = localStorage.getItem('token')
    if(!token) {
      return Promise.reject()
    }
    return Promise.resolve(getRoles())
  }
}

export const getRoles = () => {
  const token = localStorage.getItem('token')
  const { roles } = decode(token)
  return roles
}

export default authProvider;
