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
            :src="soru.img == null ? 'image/addimg.png' : soru.img"
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
          <Loader v-if="loader" />

          <InputButton
            @click="soruOlustur"
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
//ınput button da bu kod da var @click="reset"
import { eventBus } from "@/main.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import box from "@/store/box.js";
import Loader from "@/components/global/Loader.vue";
import { ref } from "vue";

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
    };
  },

  methods: {
    onChange(event) {
      let data = new FormData();
      let file = event.target.files[0];

      data.append("name", "my-file");
      data.append("file", file);

      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };

      axios.post("/test", data, config).then((response) => {});
    },

    soruOlustur() {
      if (this.soru.title !== null) {
        eventBus.$emit("soruEklendi", this.soru);
      }
    },

    async createSurvey() {
      // Token'ı localStorage'dan alın
      const token = localStorage.getItem("token");

      if (token) {
        // Token varsa, çözme işlemine başlayabilirsiniz
        const decodedToken = jwt_decode(token); // jwt_decode, token'ı çözmek için kullanılan bir fonksiyon

        // Token içindeki verilere erişin
        this.username = decodedToken.username;

        // Kullanıcı adını kullanabilirsiniz
        console.log("Kullanıcı Adı:", this.username);
      } else {
        // Token bulunamadı veya localStorage'da saklanmamış
        console.log("Token bulunamadı.");
      }
      try {
        loader.value = true; // Start the loader
        const response = await axios.post("http://localhost:3000/soru-ekle", {
          title: this.soru.title,
          explain: this.soru.explain,
          konuListesi: this.soru.konuListesi,
          img: this.soru.img,
          likeCount: this.soru.likeCount,
          isLiked: this.soru.isLiked,
          yorumCount: this.soru.yorumCount,
          isCommanted: this.soru.isCommanted,
          username: this.username,
          token: localStorage.getItem("token"),
        });
        this.questions.push(response.data);
        box.addSuccess("Tebrikler", "Soru Oluşturma İşlemi Başarılı!");
        return (loader.value = false);

        // this.reset();
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      } finally {
        loader.value = false; // Stop the loader regardless of success or failure
      }
    },
    async fetchQuestions() {
      try {
        const response = await axios.get("http://localhost:3000/soru-ekle");
        this.questions = response.data;
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
