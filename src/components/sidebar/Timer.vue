<template>
  <div class="flex justify-end">
    <p class="text-sm text-white">
      Süre: <span>{{ formatTime(time) }}</span>
    </p>
  </div>
</template>

<script>
import axiosInstance from "@/lib/axios";
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      time: parseInt(localStorage.getItem("time")) || 0,
      timerInterval: null,
    };
  },
  methods: {
    formatTime() {
      const hours = Math.floor(this.time / 3600);
      const minutes = Math.floor((this.time % 3600) / 60);
      const remainingSeconds = this.time % 60;

      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
        remainingSeconds
      )}`;
    },
    pad(value) {
      return value.toString().padStart(2, "0");
    },
    sendPostRequest() {
      axios
        .post("https://185.114.192.249:3000/user/updateTime", {
          userId: this.user._id,
          newTime: this.user.time,
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },

  async mounted() {
    this.timerInterval = setInterval(() => {
      this.time++;
      localStorage.setItem("time", this.time.toString());
      this.user.time = this.time;

      if (this.time % 10 === 0) {
        // Sadece her 5 saniyede bir gönder
        this.sendPostRequest();
      }
    }, 1000);

    try {
      const response = await axiosInstance.get(
        "https://185.114.192.249:3000/profile"
      );
      this.user = response.data.user;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>
