<script setup>
import cities from "@/data/cities.json";
import district from "@/data/district.json";
import { reactive } from "@vue/reactivity";

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
  <Header></Header>
  <div
    class="container bg-body-bg py-10 px-32 flex items-start justify-center gap-10 max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:p-2 max-lg:p-0"
  >
    <div class="w-full max-sm:w-full">
      <div
        id="register"
        class="w-full border-slate-200 rounded-md border p-6 bg-white md:w-full"
      >
        <h3 class="mb-5">Profil Bilgileriniz</h3>
        <form class="grid grid-cols-1 gap-4">
          <div class="flex items-center gap-2">
            <div class="shrink-0">
              <img
                src="@/assets/images/person.png"
                class="h-16 w-16 object-cover rounded-full"
                alt="Current profile photo"
              />
            </div>
            <label class="block">
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-dark-purple hover:file:bg-orange-100 cursor-pointer"
              />
            </label>
          </div>
          <div class="flex gap-5 max-sm:flex-col">
            <InputText label="Ad" type="text" placeholder="Ad" required />

            <InputText
              label="Soyad"
              type="text"
              placeholder="Soyadı"
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
              required
            ></InputSelect>
            <InputSelect
              :items="district"
              itemKey="ilce"
              itemValue="ilce"
              label="Seçiniz(İlçe)"
              required
            ></InputSelect>
          </div>
          <div class="flex gap-5 max-sm:flex-col">
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
          <div class="mt-5">
            <InputButton
              class="w-full bg-dark-purple"
              type="submit"
              text="Profili Güncelle"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
