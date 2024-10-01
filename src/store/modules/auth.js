import axios from 'axios';

const state = {
  token: localStorage.getItem('token') || '',
  status: '',
};

const mutations = {
  auth_success(state, token) {
    state.token = token;
  },
  auth_error(state) {
    state.status = 'error';
  },
  logout(state) {
    state.token = '';
  },
};

const actions = {
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('https://dev.moydomonline.ru/api/auth/login/', user)
        .then(response => {
          const token = response.data.key;
          localStorage.setItem('token', token);
          commit('auth_success', token);
          resolve(response);
        })
        .catch(error => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(error);
        });
    });
  },
  logout({ commit }) {
    commit('logout');
    localStorage.removeItem('token');
  },
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
