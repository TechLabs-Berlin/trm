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
    console.log(`checkError: ${err}`)
    return Promise.resolve()
  },
  getPermissions: () => {
    const role = localStorage.getItem('permissions');
    return role ? Promise.resolve(role) : Promise.reject();
  }
};

export default authProvider;
