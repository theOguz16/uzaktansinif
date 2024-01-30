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
    <form @submit.prevent="submitForm">
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
            :src="soru.img == null ? '@/assets/images/person.png' : soru.img"
          />
          <input
            class="hidden"
            ref="file"
            type="file"
            @change="uploadFile($event)"
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
          <Loader v-if="loader" />

          <InputButton
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
import { eventBus } from "@/main.js";
import axios from "axios";
import box from "@/store/box.js";
import Loader from "@/components/global/Loader.vue";
import { ref } from "vue";
import axiosInstance from "@/lib/axios";

const loader = ref(false);

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
        isLiked: false,
        isCommanted: false,
        yorumCount: 0,
        yorumlar: [],
        questions: [],
        username: null,
        token: null,
      },

      formData: null,
    };
  },

  methods: {
    uploadFile(event) {
      this.formData = new FormData();
      const file = event.target.files[0];

      this.formData.append("file", file);
    },

    soruOlustur() {
      if (this.soru.title !== null) {
        eventBus.$emit("soruEklendi", this.soru);
      }
    },

    async submitForm() {
      try {
        this.soruOlustur();
        loader.value = true; // Start the loader

        this.formData.append("title", this.soru.title);
        this.formData.append("explain", this.soru.explain);
        this.formData.append("konuListesi", this.soru.konuListesi);
        this.formData.append("imgUrl", this.soru.img);
        this.formData.append("likeCount", this.soru.likeCount);
        this.formData.append("isLiked", this.soru.isLiked);
        this.formData.append("yorumCount", this.soru.yorumCount);
        this.formData.append("isCommanted", this.soru.isCommanted);

        // this.formData.append("username", this.username);
        this.formData.append("token", localStorage.getItem("token"));

        const response = await axiosInstance.post(
          "https://api.fizikodev.com:3000/soru-ekle",
          this.formData
        );

        this.questions.push(response.data);

        box.addSuccess("Tebrikler", "Soru Oluşturma İşlemi Başarılı!");

        this.resetSoru();

        loader.value = false;

        this.fetchQuestions();
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      } finally {
        loader.value = false; // Stop the loader regardless of success or failure
      }
    },
    resetSoru() {
      this.soru = {
        konuListesi: null,
        title: null,
        explain: null,
        img: null,
        likeCount: 0,
        isLiked: false,
        yorumCount: 0,
        isCommanted: false,
      };
    },
    async fetchQuestions() {
      try {
        const response = await axiosInstance.get(
          "https://api.fizikodev.com:3000/soru-ekle"
        );
        this.questions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.fetchQuestions();
  },
};
</script>
