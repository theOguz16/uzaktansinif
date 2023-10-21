<script setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "Submit",
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
});
</script>
<template>
  <button
    class="bg-dark-pink py-2 px-6 rounded-[4px] text-white text-center flex items-center justify-center"
    :type="type"
  >
    <span class="text-center"> {{ text }}</span>
  </button>
</template>
