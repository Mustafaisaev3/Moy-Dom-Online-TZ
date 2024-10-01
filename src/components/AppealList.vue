<template>
  <div class="appeals">
    <div class="appeals__header">
      <Button type="submit" @click="editAppeal()">Создать</Button>
    </div>
    <div class="appeals__filters">
      <Input
        placeholder="поиск (№ заявки, название)"
        v-model="searchQuery"
        @input="applyFilters"
      />
      <DropdownAutocomplete
        placeholder="Дом"
        v-model="selectedPremiseId"
        :options="premises"
        displayField="address"
        @search="fetchPremises"
        @select="applyFilters"
      />
    </div>
    <table class="appeals__table">
      <thead class="appeals__table-head">
        <tr class="appeals__table-row">
          <th class="appeals__table-cell">№</th>
          <th class="appeals__table-cell">Создана</th>
          <th class="appeals__table-cell">Адрес</th>
          <th class="appeals__table-cell">Заявитель</th>
          <th class="appeals__table-cell">Описание</th>
          <th class="appeals__table-cell">Срок</th>
          <th class="appeals__table-cell">Статус</th>
        </tr>
      </thead>
      <tbody class="appeals__table-body">
        <tr v-for="appeal in appeals" :key="appeal.id" class="appeals__table-row">
          <td class="appeals__table-cell" @click="editAppeal(appeal)">
            <span>{{ appeal.number }}</span>
          </td>
          <td class="appeals__table-cell">{{ formatDate(appeal.created_at) }}</td>
          <td class="appeals__table-cell">{{ appeal.premise ? `${appeal.premise.address}, ${appeal.apartment ? appeal.apartment.label : ''}` : '' }}</td>
          <td class="appeals__table-cell">{{ appeal.applicant.last_name }} {{ appeal.applicant.first_name }} {{ appeal.applicant.patronymic_name }}</td>
          <td class="appeals__table-cell">{{ appeal.description }}</td>
          <td class="appeals__table-cell">{{ formatDate(appeal.due_date) }}</td>
          <td class="appeals__table-cell">{{ appeal.status.name }}</td>
        </tr>
      </tbody>
    </table>
    <div class="appeals__footer">
      <div class="appeals__info">
        <span>{{ startRecord }}–{{ endRecord }} из {{ count }} записей</span>
        <select v-model="pageSize" @change="changePageSize">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="appeals__pagination">
        <button class="appeals__pagination-button" @click="goToFirstPage" :disabled="!page_previous"><<</button>
        <button class="appeals__pagination-button" @click="prevPage" :disabled="!page_previous"><</button>
        <template v-for="pageNumber in paginationRange">
          <button
            class="appeals__pagination-button"
            :key="pageNumber"
            @click="goToPage(pageNumber)"
            :class="{ 'appeals__pagination-button--active': pageNumber === page }"
          >
            {{ pageNumber }}
          </button>
        </template>
        <button class="appeals__pagination-button" @click="nextPage" :disabled="!page_next">></button>
        <button class="appeals__pagination-button" @click="goToLastPage" :disabled="!page_next">>></button>
      </div>
    </div>
    <AppealModal v-if="showModal" :appeal="selectedAppeal" @close="closeModal" class="appeals__modal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate } from '@/utils/formatDate';
import AppealModal from './AppealModal.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import DropdownAutocomplete from '@/components/ui/DropdownAutocomplete.vue';

export default {
  components: {
    AppealModal,
    Button,
    Input,
    DropdownAutocomplete,
  },
  data() {
    return {
      showModal: false,
      selectedAppeal: null,
      pageSize: 10,
      searchQuery: '',
      selectedPremiseId: null,
    };
  },
  computed: {
    ...mapGetters(['appeals', 'page', 'page_next', 'page_previous', 'count', 'pages', 'premises']),
    startRecord() {
      return (this.page - 1) * this.pageSize + 1;
    },
    endRecord() {
      return Math.min(this.page * this.pageSize, this.count);
    },
    paginationRange() {
      const range = [];
      const totalPages = this.pages;
      const currentPage = this.page;
      const maxPagesToShow = 5;

      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      return range;
    },
  },
  async created() {
    await this.$store.dispatch('fetchAppeals', { page: this.page, page_size: this.pageSize });
    await this.$store.dispatch('fetchPremises');
  },
  methods: {
    editAppeal(appeal) {
      this.selectedAppeal = appeal;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedAppeal = null;
    },
    async prevPage() {
      await this.$store.dispatch('fetchAppeals', { page: this.page - 1, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async nextPage() {
      await this.$store.dispatch('fetchAppeals', { page: this.page + 1, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async goToPage(pageNumber) {
      await this.$store.dispatch('fetchAppeals', { page: pageNumber, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async goToFirstPage() {
      await this.$store.dispatch('fetchAppeals', { page: 1, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async goToLastPage() {
      await this.$store.dispatch('fetchAppeals', { page: this.pages, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async changePageSize() {
      await this.$store.dispatch('fetchAppeals', { page: 1, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async applyFilters() {
      await this.$store.dispatch('fetchAppeals', { page: 1, page_size: this.pageSize, search: this.searchQuery, premise_id: this.selectedPremiseId });
    },
    async fetchPremises(searchQuery) {
      await this.$store.dispatch('fetchPremises', { search: searchQuery });
    },
    formatDate(isoDateString) {
      return formatDate(isoDateString);
    },
  },
};
</script>