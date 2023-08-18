<script setup>
import konuListesi from "@/data/konu.json";
</script>
<template>
  <div class="bg-white">
    <div class="cursor-pointer" id="soru-header">
      <h1 class="p-4 pr-0 w-[30%] text-dark-purple border-r-2 max-sm:w-full">
        Soru Sor
      </h1>
    </div>
    <form @submit.prevent="createSurvey">
      <div id="soru-olustur" class="flex flex-col gap-4 py-8 p-24 max-sm:p-0">
        <div>
          <InputText
            placeholder="Soru Başlığı"
            type="text"
            required
            field="title"
            v-model="soru.title"
          ></InputText>
        </div>
        <div>
          <InputTextarea
            placeholder="Soru Açıklaması"
            type="text"
            v-model="soru.explain"
          ></InputTextarea>
        </div>
        <div
          class="py-3 px-4 text-base border-2 rounded-[5px] outline-dark-purple"
        >
          <img
            class="h-24 w-24 text-center mb-2"
            :src="soru.img == null ? 'public/image/addimg.png' : soru.img"
          />
          <input
            class="hidden"
            ref="file"
            type="file"
            @change="onChange($event)"
          />
          <button
            class="btn btn-outline-secondary text-text-color max-sm:flex"
            type="button"
            @click="$refs.file.click()"
          >
            Resim Seç
          </button>
        </div>
        <div>
          <InputSelect
            class="text-text-color outline-dark-purple"
            :items="konuListesi"
            v-model="soru.konuListesi"
            itemKey="value"
            itemValue="konu"
            defaultOptions="Konu"
            requried
          >
          </InputSelect>
        </div>
        <div class="flex justify-center">
          <InputButton
            @:click="soruOlustur"
            @click="reset"
            class="bg-dark-purple w-full outline-none"
            type="submit"
            text="Soru Gönder"
          ></InputButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { eventBus } from "../../main.js";

export default {
  data() {
    return {
      soru: {
        //yorumlar diye bir array oluştur
        konuListesi: null,
        title: null,
        explain: null,
        img: null,
        likeCount: 0,
        yorumCount: 0,
        yorumlar: [],
      },
    };
  },
  methods: {
    onChange(e) {
      const file = e.target.files[0];
      this.soru.img = URL.createObjectURL(file);
    },

    soruOlustur() {
      if (this.soru.title !== null) {
        eventBus.$emit("soruEklendi", this.soru);
      }
    },
    reset() {
      this.soru = {
        konuListesi: null,
        title: null,
        explain: null,
        img: null,
        likeCount: 0,
        yorumCount: 0,
        yorumlar: [],
      };
    },
  },
};
</script>
