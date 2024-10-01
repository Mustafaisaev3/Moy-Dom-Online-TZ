<template>
  <div class="dropdown-autocomplete">
    <div class="dropdown-autocomplete__label">
      <span>{{ label }}</span>
      <div class="dropdown-autocomplete__input-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @input="debouncedSearch"
          @focus="showOptions = true"
          @blur="hideOptions"
          class="dropdown-autocomplete__input"
          :placeholder="placeholder"
        />
        <div class="dropdown-autocomplete__underline"></div>
      </div>
    </div>
    <ul v-if="showOptions && options.length" class="dropdown-autocomplete__options">
      <li v-for="option in options" :key="option.id" @click="selectOption(option)" class="dropdown-autocomplete__option">
        {{ displayField ? option[displayField] : option.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  props: {
    label: String,
    placeholder: String,
    value: [String, Number],
    displayField: String,
    options: Array,
  },
  data() {
    return {
      searchQuery: '',
      showOptions: false,
    };
  },
  watch: {
    value(newVal) {
      // Обновляем searchQuery при изменении value
      if (this.options.length) {
        const selectedOption = this.options.find(option => option.id === newVal);
        if (selectedOption) {
          this.searchQuery = selectedOption[this.displayField] || selectedOption.title;
        }
      }
    },
  },
  methods: {
    debouncedSearch: debounce(function() {
      this.$emit('search', this.searchQuery);
    }, 500),
    selectOption(option) {
      this.searchQuery = option[this.displayField] || option.title;
      this.$emit('input', option.id);
      this.$emit('select', option);
      this.showOptions = false;
    },
    hideOptions() {
      setTimeout(() => {
        this.showOptions = false;
      }, 200); // Задержка для предотвращения скрытия дропдауна при клике на опцию
    },
  },
};
</script>
