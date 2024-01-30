<script>
import axiosInstance from "@/lib/axios";
import jwt_decode from "jwt-decode";

export default {
  data() {
    return {
      users: [],
      username: "",
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
        const response = await axiosInstance.get(
          `https://api.fizikodev.com:3000/register/time`
        );

        this.users = response.data;
      } catch (error) {
        console.error("user getirme hatası:", error);
      }
    },
    async userKendiKontrol() {
      // Token'ı localStorage'dan alın
      const token = localStorage.getItem("token");

      if (token) {
        // Token varsa, çözme işlemine başlayabilirsiniz
        const decodedToken = jwt_decode(token); // jwt_decode, token'ı çözmek için kullanılan bir fonksiyon

        // Token içindeki verilere erişin
        this.username = decodedToken.username;

        // Kullanıcı adını kullanabilirsiniz
      } else {
        console.log("hata");
      }
    },
    async goProfile() {
      await this.userKendiKontrol(); // userKendiKontrol tamamlanana kadar bekleyin
      this.$router.push("/profile");
    },
  },
  created() {
    this.getUsers();
    this.userKendiKontrol();
  },
  async mounted() {
    setInterval(() => {
      this.getUsers();
      this.userKendiKontrol();
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
  },
};
</script>
<template>
  <div class="container">
    <ul class="flex flex-col bg-white rounded-[5px]">
      <RouterLink :to="`/calismasureleri`">
        <span
          class="font-bold text-sm text-theme-primary border-b-2 py-6 block text-center"
          >EN ÇOK ÇALIŞAN SINIF UYELERİ</span
        >
      </RouterLink>
      <li v-for="user in users" class="border-b-2 px-6 py-6">
        <RouterLink
          v-if="this.username == user.username"
          class="items-center font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex gap-4"
          :to="`/profile`"
        >
          <img
            class="w-10 h-10 rounded-[50%]"
            src="@/assets/images/person.png"
            alt="user-profile-image"
          />

          {{ user.name }} {{ user.surname }}
        </RouterLink>
        <Router-link
          v-else
          class="items-center font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex gap-4"
          :to="`/sinif-uyeleri/${user.username}`"
        >
          <img
            class="w-10 h-10 rounded-[50%]"
            src="@/assets/images/person.png"
            alt="user-profile-image"
          />
          {{ user.name }} {{ user.surname }}
        </Router-link>
        <span
          >Çalışılan Süre: <span>{{ formatTime(user.time) }}</span></span
        >
      </li>
    </ul>
  </div>
</template>
