<script setup>
import cities from "@/data/cities.json";

const genderList = {
  male: {
    gender: "Erkek",
    value: 0,
  },
  female: {
    gender: "Kadın",
    value: 1,
  },
  other: {
    gender: "Diğer",
    value: 2,
  },
};
</script>
<template>
  <div class="container flex mx-auto mt-14 bg-white p-0 gap-4 max-sm:flex-col">
    <div id="image-container" class="">
      <img src="@/assets/images/uzaktansinifbanner.png" alt="register-image" />
    </div>
    <div
      id="register"
      class="max-w-[560px] mx-auto border-slate-100 rounded-md border p-6 bg-white"
    >
      <h3 class="mb-5 text-dark-purple text-center">Kayıt Ol</h3>
      <form
        @submit.prevent="createUsers"
        class="grid grid-rows-3 gap-5 max-sm:flex max-sm:flex-col"
      >
        <div class="flex gap-5 max-sm:flex-col">
          <InputText
            label="Ad"
            type="text"
            placeholder="Ad"
            required
            v-model="formData.name"
          />

          <InputText
            label="Soyad"
            type="text"
            placeholder="Soyadı"
            required
            v-model="formData.surname"
          />
        </div>

        <div class="flex gap-5">
          <InputDate
            type="date"
            value="gg.aa.yyyy"
            label="Doğum Tarihi"
            v-model="formData.dateOfBirth"
            required
          />
        </div>
        <div class="flex gap-5 max-sm:flex-col">
          <InputSelect
            :items="cities"
            itemKey="il"
            itemValue="il"
            label="Seçiniz(İl)"
            defaultOptions="Lütfen bir şehir seçiniz"
            v-model="formData.city"
            required
          ></InputSelect>
          <InputSelect
            :items="genderList"
            itemKey="value"
            itemValue="gender"
            defaultOptions="Lütfen bir cinsiyet seçiniz"
            label="Seçiniz(Cinsiyetiniz)"
            v-model="formData.gender"
            required
          >
          </InputSelect>
        </div>

        <div>
          <InputText
            label="Kullanıcı Ad"
            type="text"
            placeholder="Kullanıcı Adı"
            v-model="formData.username"
            required
          />
        </div>
        <div>
          <InputText
            label="E-Posta Adresi"
            type="email"
            placeholder="E-Posta Adresi"
            v-model="formData.emailAddres"
            required
          />
        </div>
        <div>
          <InputText
            label="Şifre"
            type="password"
            placeholder="Şifre"
            field="password"
            v-model="formData.password"
            required
          />
        </div>
        <div class="mt-5">
          <InputButton
            class="w-full bg-dark-purple"
            type="submit"
            text="Kayıt Ol!"
            :click="userOlustur"
          />
        </div>
        <div id="register" class="mt-2">
          <p class="text-sm">
            Bir hesabın var mı ?
            <router-link class="text-dark-pink" to="/login"
              >Giriş Yap!</router-link
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { eventBus } from "@/main.js";
import box from "@/store/box.js";
import axios from "axios";
export default {
  data() {
    return {
      users: [],
      formData: {
        name: "",
        surname: "",
        dateOfBirth: "",
        city: null,
        gender: "",
        username: "",
        emailAddres: "",
        password: "",
        dirty: false,
        error: {},
      },
    };
  },

  methods: {
    userOlustur() {
      if (this.formData.username !== null) {
        eventBus.$emit("userEklendi", this.formData);
      }
    },

    async createUsers() {
      try {
        const response = await axios.post(
          "http://185.114.192.249:3000/register",
          {
            username: this.formData.username,
            name: this.formData.name,
            surname: this.formData.surname,
            dateOfBirth: this.formData.dateOfBirth,
            city: this.formData.city,
            gender: this.formData.gender,
            district: this.formData.district,
            emailAddres: this.formData.emailAddres,
            password: this.formData.password,
          }
        );

        this.users.push(response.data);

        localStorage.setItem("token", response.data.token);

        box.addSuccess("Tebrikler", "Kayıt Olma Başarılı!");

        this.$router.push("/profile");
        // this.reset();
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");
        console.error(error);
      }
    },
    async fetchQuestions() {
      try {
        const response = await axios.get(
          "http://185.114.192.249:3000/register"
        );
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    // reset() {
    //   this.soru = {
    //     konuListesi: null,
    //     title: null,
    //     explain: null,
    //     img: null,
    //     likeCount: 0,
    //      isLiked: false,
    //     yorumCount: 0,
    //      isCommanted: false,

    //     yorumlar: [],
    //   };
    // },
  },
  created() {
    this.fetchQuestions();
  },
};
</script>
