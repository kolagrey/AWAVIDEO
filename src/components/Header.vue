<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand" v-on:click="popNav()">
      <div class="navbar-item">
        <img src="../assets/logo.png" width="28" height="28">
      </div>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navMenu" class="navbar-menu">
      <div class="navbar-start" v-on:click="popNav()">
        <router-link class="navbar-item" to="/">Home</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div v-on:click="popNav()" class="buttons">
            <router-link class="button is-link" to="/console/dashboard">
              <strong>Partner Console</strong>
            </router-link>
            <button v-if="storeState.isAuthenticated" class="button is-danger" v-on:click="logout">
              <strong>Logout</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: "Header",
  data(){
    return {
      storeState: this.$root.$data.state
    }
  },
  methods: {
    logout() {
      this.$root.$data.logout();
      this.$router.push('/login');
    },
    popNav() {
      document.getElementById("navMenu").classList.toggle("is-active");
    }
  }
};
</script>