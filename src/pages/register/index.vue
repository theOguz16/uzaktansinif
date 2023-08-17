<script setup>
// import axios from "@/plugins/appAxios";
import cities from "@/data/cities.json";
import district from "@/data/district.json";
import { reactive } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

const formData = reactive({
  name: "",
  surname: "",
  dateOfBirth: "",
  city: null,
  district: "",
  gender: "",
  userName: "",
  emailAddress: "",
  password: "",
  passwordRepeat: "",
  dirty: false,
  error: {},
});

const districtData = computed(() => {
  return district.filter((item) => {
    if (item.il == formData.city) {
      return item;
    }
  });
});

const genderList = reactive({
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
});
</script>
<template>
  <div class="container flex mx-auto mt-14 bg-white p-0 gap-4">
    <div id="image-container" class="">
      <img src="public\image\uzaktansinifbanner.png" alt="login-image" />
    </div>
    <div
      id="register"
      class="max-w-[560px] mx-auto border-slate-100 rounded-md border p-6 bg-white"
    >
      <h3 class="mb-5 text-dark-purple text-center">Kayıt Ol</h3>
      <form class="grid grid-rows-3 gap-5">
        <div class="flex gap-5">
          <InputText label="Ad" type="text" placeholder="Ad" required />

          <InputText label="Soyad" type="text" placeholder="Soyadı" required />
        </div>

        <div class="flex gap-5">
          <InputSelect
            :items="cities"
            itemKey="il"
            itemValue="il"
            label="Seçiniz(İl)"
            defaultOptions="Lütfen bir şehir seçiniz"
            v-model="formData.city"
            :onKeyup="cityValidation"
            :element="formData"
            field="city"
            required
            :disabled="loader"
          ></InputSelect>
          <InputSelect
            :items="districtData"
            itemKey="ilce"
            itemValue="ilce"
            label="Seçiniz(İlçe)"
            v-model="formData.district"
            :onKeyup="districtValidation"
            :element="formData"
            field="district"
            required
            :disabled="loader"
          ></InputSelect>
        </div>
        <div class="flex gap-5">
          <InputDate
            type="date"
            value="gg.aa.yyyy"
            label="Doğum Tarihi"
            required
          />
          <InputSelect
            :items="genderList"
            itemKey="value"
            itemValue="gender"
            defaultOptions="Lütfen bir cinsiyet seçiniz"
            label="Seçiniz(Cinsiyetiniz)"
            required
          >
          </InputSelect>
        </div>

        <div>
          <InputText
            label="Kullanıcı Ad"
            type="text"
            placeholder="Kullanıcı Adı"
            required
          />
        </div>
        <div>
          <InputText
            label="E-Posta Adresi"
            type="email"
            placeholder="E-Posta Adresi"
            required
          />
        </div>
        <div>
          <InputText
            label="Şifre"
            type="password"
            placeholder="Şifre"
            field="password"
            required
          />
        </div>
        <div>
          <InputText
            label="Şifre Tekrar"
            type="password"
            placeholder="Şifre Tekrar"
            required
          />
        </div>
        <div class="mt-5">
          <InputButton
            class="w-full bg-dark-purple"
            type="submit"
            text="Kayıt Ol!"
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
