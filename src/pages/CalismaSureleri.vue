<script>
import axiosInstance from "@/lib/axios";
import axios from "axios";

export default {
  data() {
    return {
      users: [],
    };
  },
  methods: {
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
        remainingSeconds
      )}`;
    },
    pad(value) {
      return value.toString().padStart(2, "0");
    },
    async getUsers() {
      try {
        const response = await axios.get(`http://localhost:3000/register/time`);

        this.users = response.data;
      } catch (error) {
        console.error("user getirme hatası:", error);
      }
    },
  },
  created() {
    this.getUsers();
  },
  async mounted() {
    setInterval(() => {
      this.getUsers();
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
  },
};
</script>
<template>
  <Header></Header>
  <div class="container">
    <ul class="flex flex-col bg-white rounded-[5px]">
      <span
        class="font-bold text-sm text-theme-primary border-b-2 py-6 block text-center"
        >EN ÇOK ÇALIŞAN SINIF UYELERİ</span
      >
      <li v-for="user in users" class="border-b-2 px-6 py-6">
        <RouterLink
          class="items-center font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex gap-4"
          :to="`/sinif-uyeleri/${user.username}`"
        >
          <img
            class="w-10 h-10 rounded-[50%]"
            src="image/person.png "
            alt="user-profile-image"
          />

          {{ user.name }} {{ user.surname }}
        </RouterLink>
        <span
          >Çalışılan Süre: <span>{{ formatTime(user.time) }}</span></span
        >
      </li>
    </ul>
  </div>
</template>
