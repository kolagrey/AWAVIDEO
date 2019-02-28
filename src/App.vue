<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer company="Awa Video owned by Ipin Technology Limited" copyright="A.R.T"/>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Header,
    Footer
  }
};
</script>

<style>
@import "~bulma/css/bulma.css";
</style>