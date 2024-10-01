<template>
  <label class="textarea" :class="{ 'textarea--filled': value }">
    <span class="textarea__label-text">
      {{ label }}
    </span>
    <div class="textarea__input-wrapper">
      <slot name="icon"></slot>
      <textarea
        v-model="value"
        :placeholder="placeholder"
        v-bind="$attrs"
        class="textarea__textarea"
        @input="$emit('input', $event.target.value)"
        @focus="focus = true"
        @blur="focus = false"
      ></textarea>
    </div>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true,
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
    };
  },
};
</script>