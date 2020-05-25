<template>
  <div class="loginmain"></div>
</template>
<script>
export default {
  name: 'login',
  data: function () {
    return {
      account: '',
      password: ''
    }
  },
  mounted: function () {
    this.login()
  },
  methods: {
    login () {
      // TODO 用户登录问题
      localStorage.setItem('login', true)
      this.$router.push('home')
    }
  }
}
</script>
