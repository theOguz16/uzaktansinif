<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async getUsersFromServer() {
      try {
        const response = await axios.get("http://localhost:3000/register");
        this.users = response.data;
        console.log("userlar alındı");
      } catch (error) {
        console.log("userlar alınamadı" + error);
      }
    },
  },
  created() {
    this.getUsersFromServer();
  },
  mounted() {
    setInterval(() => {
      this.getUsersFromServer();
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
  },
};
</script>
<template>
  <ul class="flex flex-col bg-white rounded-[5px]">
    <span
      class="font-bold text-sm text-theme-primary border-b-2 py-6 block text-center"
      >SINIF ÜYELERİ</span
    >
    <li v-for="user in users" :key="user.id" class="border-b-2 px-6 py-6">
      <RouterLink
        class="font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex gap-4"
        :to="`/sinif-uyeleri/${user.username}`"
      >
        <img
          class="w-10 h-10 rounded-[50%]"
          src="image/person.png "
          alt="user-profile-image"
        />

        {{ user.name }} {{ user.surname }}</RouterLink
      >
    </li>
  </ul>
</template>
