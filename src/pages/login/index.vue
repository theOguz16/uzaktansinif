<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      user: {},
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          username: this.username,
          password: this.password,
        });

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          this.$router.push("/profile");
        } else {
          console.error(
            "Kimlik doğrulama başarısız. Sunucu cevabı: ",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    },
  },
};
</script>
<template>
  <div>
    <div class="container flex bg-white mt-14 p-0">
      <div id="image-container" class="w-[50%]">
        <img src="image/uzaktansinifbanner.png" alt="login-image" />
      </div>
      <div id="form-container" class="my-auto mx-auto">
        <form @submit.prevent="login" class="flex flex-col gap-4">
          <div>
            <h2 class="text-dark-purple text-center mb-4">Giriş Yap</h2>
          </div>
          <div>
            <InputText
              placeholder="Kullanıcı Adı"
              type="text"
              required
              v-model="username"
            ></InputText>
          </div>
          <div>
            <InputText
              placeholder="Şifre"
              type="password"
              required
              v-model="password"
            ></InputText>
          </div>
          <div class="flex justify-center">
            <InputButton
              class="bg-dark-purple w-full"
              type="submit"
              text="Giriş Yap"
            ></InputButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
