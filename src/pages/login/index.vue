<script>
import axios from "axios";
import box from "@/store/box.js";

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
        const response = await axios.post("http://185.114.192.249:3000/login", {
          username: this.username,
          password: this.password,
        });

        if (response.status === 200) {
          box.addSuccess("Tebrikler", "Giriş Başarılı!");
          const token = response.data.token;
          localStorage.setItem("token", token);
          this.$router.push("/profile");
        } else {
          box.addError("Üzgünüm", "Bir Hata Oluştu!");

          console.error(
            "Kimlik doğrulama başarısız. Sunucu cevabı: ",
            response.data.message
          );
        }
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

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
        <img src="@/assets/images/uzaktansinifbanner.png" alt="login-image" />
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
          <div id="register" class="mt-2">
            <p class="text-sm">
              Henüz kayıt olmadın mı ?
              <router-link class="text-dark-pink" to="/register"
                >Kayıt Ol!</router-link
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
