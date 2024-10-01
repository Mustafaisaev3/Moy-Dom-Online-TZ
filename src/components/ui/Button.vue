<template>
  <button class="button" v-bind="$attrs" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    }
  }
};
</script>