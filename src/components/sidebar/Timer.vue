<template>
  <div class="flex justify-end">
    <p class="text-sm text-white">Süre: {{ time }} saniye</p>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     startTime: localStorage.getItem("item"),
  //     elapsedTime: 0,
  //     timerInterval: null,
  //   };
  // },
  // created() {
  //   this.startTime = Date.now();
  //   this.timerInterval = setInterval(this.updateElapsedTime, 1000);
  // },
  // methods: {
  //   updateElapsedTime() {
  //     this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
  //     localStorage.setItem("time", this.elapsedTime);
  //   },
  // },
  // beforeDestroy() {
  //   // localStorage.removeItem("time");
  // },

  data() {
    return {
      time: localStorage.getItem("time") ?? 0,
    };
  },

  mounted() {
    setInterval(() => {
      this.time++;
      localStorage.setItem("time", this.time);
    }, 1000);
  },
};
</script>
