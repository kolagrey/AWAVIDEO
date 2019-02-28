<template>
  <footer class="footer is-info mt-60">
    <div class="container has-text-centered">
        <strong>{{ company }}</strong> <br> Product developed by <a href="https://asheori.com" target="_blank">{{ copyright }}</a>.
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    company: String,
    copyright: String
  }
};
</script>
