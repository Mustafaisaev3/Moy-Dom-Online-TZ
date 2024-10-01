import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import './assets/styles/scss/global.scss';

Vue.config.productionTip = false;

axios.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
