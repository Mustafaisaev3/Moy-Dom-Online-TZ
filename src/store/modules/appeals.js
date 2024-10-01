import axios from 'axios';

const state = {
  appeals: [],
  count: 0,
  pages: 0,
  page: 1,
  page_size: 10,
  page_next: null,
  page_previous: null,
  premises: [],
  apartments: [],
};

const mutations = {
  setAppeals(state, { results, count, pages, page, page_size, page_next, page_previous }) {
    state.appeals = results;
    state.count = count;
    state.pages = pages;
    state.page = page;
    state.page_size = page_size;
    state.page_next = page_next;
    state.page_previous = page_previous;
  },
  setPremises(state, { results }) {
    state.premises = results;
  },
  setApartments(state, { results }) {
    state.apartments = results;
  },
};

const actions = {
  async fetchAppeals({ commit }, { page = 1, page_size = 10, search = '', premise_id = null }) {
    try {
      const response = await axios.get('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', {
        params: { page, page_size, search, premise_id },
      });
      commit('setAppeals', response.data);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      throw error;
    }
  },
  async createAppeal({ commit }, appeal) {
    try {
      const response = await axios.post('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', appeal);
      return response.data;
    } catch (error) {
      console.error('Error creating appeal:', error);
      throw error;
    }
  },
  async updateAppeal({ commit }, { id, appeal }) {
    try {
      const response = await axios.patch(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${id}/`, appeal);
      return response.data;
    } catch (error) {
      console.error('Error updating appeal:', error);
      throw error;
    }
  },
  async fetchPremises({ commit }, { search = '' }) {
    try {
      const response = await axios.get('https://dev.moydomonline.ru/api/geo/v2.0/user-premises/', {
        params: { search },
      });
      commit('setPremises', response.data);
    } catch (error) {
      console.error('Error fetching premises:', error);
      throw error;
    }
  },
  async fetchApartments({ commit }, { premise_id, search = '' }) {
    try {
      const response = await axios.get(`https://dev.moydomonline.ru/api/geo/v1.0/apartments/?premise_id=${premise_id}`, {
        params: { search },
      });
      commit('setApartments', response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  },
};

const getters = {
  appeals: state => state.appeals,
  count: state => state.count,
  pages: state => state.pages,
  page: state => state.page,
  page_size: state => state.page_size,
  page_next: state => state.page_next,
  page_previous: state => state.page_previous,
  premises: state => state.premises,
  apartments: state => state.apartments,
};

export default {
  state,
  mutations,
  actions,
  getters,
};