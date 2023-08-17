<script setup>
const props = defineProps({
  type: {
    required: false,
    default: "text",
  },
  label: {
    required: false,
    default: "",
  },
  modelValue: {
    required: false,
    default: "",
  },
  placeholder: {
    required: false,
    default: "",
  },
  onKeyup: {
    required: false,
    default: () => void 0,
  },
});
</script>
<template>
  <div class="">
    <input
      placeholder="Arama Yap... "
      @keyup="onKeyup"
      :class="' w-[450px] py-2 px-3 focus:border-none outline-none text-base max-sm:w-[80px] max-lg:w-[225px]  '"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      @input="(e) => $emit('update:modelValue', e.target.value)"
    />
  </div>
</template>
