<template>
  <label class="input-field" :class="{ 'input-field--filled': value }">
    <span class="input-field__label-text">
      {{ label }}
    </span>
    <div class="input-field__input-wrapper">
      <slot name="icon"></slot>
      <input
        v-model="formattedValue"
        :placeholder="placeholder"
        :type="inputType"
        class="input-field__input"
        @input="handleInput"
        @focus="focus = true"
        @blur="focus = false"
      />
      <span v-if="type === 'password'" class="input-field__toggle-password" @click="togglePasswordVisibility">
        <img v-if="!showPassword" src="@/assets/images/icons/eye-invisible.svg" alt="Lock" class="input-icon" />
        <img v-else src="@/assets/images/icons/eye-visible.svg" alt="Lock" class="input-icon" />
      </span>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    placeholder: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      focus: false,
      formattedValue: '',
      showPassword: false,
    };
  },
  computed: {
    inputType() {
      return this.type === 'password' && this.showPassword ? 'text' : this.type;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.formattedValue = newValue;
      },
    },
  },
  methods: {
    handleInput(event) {
      this.formattedValue = event.target.value;
      this.$emit('input', this.formattedValue);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>