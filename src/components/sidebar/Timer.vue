<template>
  <div class="flex justify-end">
    <p class="text-sm text-white">Süre: {{ elapsedTime }} saniye</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startTime: null,
      elapsedTime: 0,
      timerInterval: null,
    };
  },
  created() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(this.updateElapsedTime, 1000);
  },
  methods: {
    updateElapsedTime() {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
  //   beforeDestroy() {
  //     clearInterval(this.timerInterval);
  //   },
};
</script>
