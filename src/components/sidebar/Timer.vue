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
        .post("http://localhost:3000/user/updateTime", {
          userId: this.user._id, // veya kullanıcı kimliğinizi nasıl tanımlıyorsanız ona göre
          newTime: this.user.time,
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  async mounted() {
    setInterval(() => {
      this.time++;
      localStorage.setItem("time", this.time.toString());
      this.user.time = this.time;
      this.sendPostRequest();
    }, 1000);

    const result = await axiosInstance.get("http://localhost:3000/profile");

    this.user = result.data.user;
  },
};
</script>
