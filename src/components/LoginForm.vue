<template>
  <div class="login">
    <div class="login__body">
      <div class="login__header">Авторизация</div>
      <form @submit.prevent="login" class="login__form">
        <div class="login__form-row">
          <Input
            v-model="username"
            label="Логин или Телефон"
            placeholder="Имя пользователя"
          >
            <template v-slot:icon>
              <img src="@/assets/images/icons/call.svg" alt="Phone" class="input__icon" />
            </template>
          </Input>
        </div>
        <div class="login__form-row">
          <Input
            v-model="password"
            label="Пароль"
            placeholder="Пароль"
            type="password"
          >
            <template v-slot:icon>
              <img src="@/assets/images/icons/blok.svg" alt="Lock" class="input__icon" />
            </template>
          </Input>
        </div>
        <Button type="submit" class="login__button">Войти</Button>
      </form>
      <p v-if="error" class="login__error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import Input from './ui/Input.vue';
import Button from './ui/Button.vue';

export default {
  components: {
    Input,
    Button
  },
  data() {
    return {
      username: '',
      password: '',
      error: false,
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', { username: this.username, password: this.password })
        .then(() => {
          this.$router.push('/');
        })
        .catch((error) => {
          this.error = error.response.data.detail;
        });
    },
  },
};
</script>