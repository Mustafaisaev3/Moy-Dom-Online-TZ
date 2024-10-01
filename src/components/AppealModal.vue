<template>
  <div class="modal" @click="closeModal">
    <div class="modal__body" @click.stop>
      <div class="modal__header">
        <h2>{{ appeal.id ? `Заявка №${appeal.number} ${appeal.due_date ? `(от ${formatDate(appeal.due_date)})` : ''}` : 'Создание заявки'  }}</h2>
        <span>Новая</span>
      </div>
      <form @submit.prevent="saveAppeal" class="modal__form">
        <div class="modal__form-row">
          <DropdownAutocomplete
            v-model="appeal.premise_id"
            placeholder="Дом"
            displayField="short_address"
            :options="premises"
            @search="fetchPremises"
          />
          <DropdownAutocomplete
            v-model="appeal.apartment_id"
            placeholder="Квартира"
            displayField="label_floor_area"
            :options="apartments"
            @search="fetchApartments"
          />
          <Input
            v-model="dateForTimepicker"
            label="Срок"
            placeholder="Срок"
            type="datetime-local"
          />
        </div>
        <div class="modal__form-row">
          <Input
            v-model="appeal.applicant.last_name"
            label="Фамилия"
            placeholder="Фамилия"
          />
          <Input
            v-model="appeal.applicant.first_name"
            label="Имя"
            placeholder="Имя"
          />
          <Input
            v-model="appeal.applicant.patronymic_name"
            label="Отчество"
            placeholder="Отчество"
          />
          <Input
            v-model="appeal.applicant.username"
            label="Телефон"
            placeholder="Телефон"
            :mask="true"
          />
        </div>
        <div class="modal__form-row">
          <Textarea
            v-model="appeal.description"
            label="Описание"
            placeholder="Описание"
            rows="6"
          />
        </div>
        <Button type="submit">{{appeal.id ? 'Cохранить' : 'Создать'}}</Button>
      </form>
      <p v-if="error" class="modal__error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { formatDate, formatDateForTimepicker } from '@/utils/formatDate';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import DropdownAutocomplete from './ui/DropdownAutocomplete.vue';
import Button from './ui/Button.vue';

export default {
  components: {
    Input,
    Textarea,
    DropdownAutocomplete,
    Button,
  },
  props: {
    appeal: {
      type: Object,
      default: () => ({
        premise_id: null,
        apartment_id: null,
        due_date: null,
        applicant: {
          last_name: '',
          first_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        status_id: 1,
      }),
    },
  },
  data() {
    return {
      error: '',
    };
  },
  computed: {
    premises() {
      return this.$store.getters.premises;
    },
    apartments() {
      return this.$store.getters.apartments;
    },
    dateForTimepicker () {
      return formatDateForTimepicker(this.appeal.due_date)
    }
  },
  methods: {
    async saveAppeal() {
      try {
        if (this.appeal.id) {
          await this.$store.dispatch('updateAppeal', { id: this.appeal.id, appeal: this.appeal });
        } else {
          await this.$store.dispatch('createAppeal', this.appeal);
        }
        await this.$store.dispatch('fetchAppeals', { page: this.$store.getters.page });
        this.$emit('close');
      } catch (error) {
        this.error = error.response.data.detail || 'Ошибка при сохранении заявки';
      }
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close');
      }
    },
    async fetchPremises(search) {
      await this.$store.dispatch('fetchPremises', { search });
    },
    async fetchApartments(search) {
      await this.$store.dispatch('fetchApartments', { premise_id: this.appeal.premise_id, search });
    },
    formatDate (isoDateString) {
      return formatDate(isoDateString)
    },
  },
};
</script>