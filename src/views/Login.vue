<template>
  <div class="login-background">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
.login-background {
  background-image: url('@/assets/images/login-background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  position: relative;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.login-background > .login-form {
  position: relative;
  z-index: 2;
}
</style>