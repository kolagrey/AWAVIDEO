    export const store = {
    debug: true,
    state: {
        isAuthenticated: sessionStorage.getItem('authState') ? true : false
    },
   authenticated () {
        sessionStorage.setItem('authState', 'true');
        this.state.isAuthenticated = true;
    },
    logout () {
        sessionStorage.clear();
        this.state.isAuthenticated = false;
    }
  }