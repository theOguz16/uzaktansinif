<script>
import LikeAndComment from "@/components/global/LikeAndComment.vue";
import { eventBus } from "@/main.js";
import Soru from "@/components/global/Soru.vue";
import axios from "axios";
import axiosInstance from "@/lib/axios";

export default {
  components: {
    appSoru: Soru,
    LikeAndComment: LikeAndComment,
  },
  data() {
    return {
      soruList: [],
      today: "",
      questions: [],
    };
  },
  methods: {
    async getPostsFromServer() {
      try {
        const response = await axios.get("http://localhost:3000/sorular");
        this.soruList = response.data;
        console.log("Sorular başarıyla alındı");
      } catch (error) {
        console.error("sorulist" + error);
      }
    },

    getToday() {
      const date = new Date();
      this.today = date.toLocaleDateString();
    },
    async soruSil(itemToDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/sorular/${itemToDelete._id}`
        );
        // Başarılı yanıt alındığında, itemToDelete'i frontend'den kaldırabilirsiniz.
        this.soruList = this.soruList.filter((soru) => soru !== itemToDelete);
      } catch (error) {
        console.error("Soru silme hatası:", error);
      }
    },
  },

  created() {
    eventBus.$on("soruEklendi", (soru) => {
      this.soruList.push(soru);
    });
    this.getPostsFromServer();
  },
  mounted() {
    setInterval(() => {
      this.getPostsFromServer(); // Belirli aralıklarla verileri güncelle
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
    this.getToday();
  },
};
</script>
<style>
.soru-resim {
  margin: 0px auto;
}
</style>
<template>
  <appSoru v-for="soru in soruList">
    <div class="mt-24 bg-white flex flex-col gap-4 p-8">
      <div id="soru-header" class="flex items-center justify-between">
        <div id="soru-paylasan" class="flex items-center gap-2">
          <img
            src="image/person.png"
            alt="person"
            class="w-[8%] rounded-[50%]"
          />
          <span class="text-body-color font-bold">admin</span>
          <p class="text-text-color">tarafından</p>
        </div>
        <div>
          <div id="soru-onay mb-2">
            <div
              class="flex items-center justify-end mr-4 cursor-pointer max-sm:items-left"
            >
              <fai @click="soruSil(soru)" icon="trash"></fai>
            </div>
          </div>
          <div id="soru-tarih">
            <span class="text-text-color">{{ this.today }}</span>
          </div>
        </div>
      </div>
      <div id="soru-icerigi" class="flex flex-col gap-4">
        <div id="soru-basligi">
          <h2 class="text-body-color">{{ soru.soruBasligi }}</h2>
        </div>
        <div id="soru-icerigi">
          <p class="text-text-color">
            {{ soru.soruAciklamasi }}
          </p>
        </div>
        <div id="soru-resmi">
          <img
            class="soru-resim"
            :src="'http://localhost:3000/image/' + soru.imageUrl"
            :alt="soru.title"
          />
        </div>
      </div>
      <div
        class="p-2 rounded text-white bg-dark-pink w-[23%] text-center max-sm:w-full"
      >
        {{ soru.konu }}
      </div>
      <hr />
      <LikeAndComment :soru="soru"></LikeAndComment>
    </div>
  </appSoru>
</template>
