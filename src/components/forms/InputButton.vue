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
  loader: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
<template>
  <button
    class="bg-dark-pink py-2 px-6 rounded-[4px] text-white text-center flex items-center justify-center"
    :type="type"
    :disabled="loader"
  >
    <Loader class="text-center" v-if="loader" />
    <span v-else> {{ text }}</span>
  </button>
</template>
