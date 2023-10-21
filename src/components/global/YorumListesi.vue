<script>
import Yorum from "./Yorum.vue";
import { eventBus } from "../../main.js";
import axios from "axios";

export default {
  props: {
    soru: Object,
    yorum: Object,
  },
  components: {
    appYorum: Yorum,
  },
  data() {
    return {
      yorumList: [],
      today: "",
      soruID: null,
      yorumID: null,
    };
  },
  methods: {
    async getYorumlarFromServer() {
      try {
        const soruID = this.soru._id; // Soru kimliğini alın
        const response = await axios.get(
          `http://localhost:3000/soru/${soruID}/yorumlar`
        );
        const yorumlar = response.data; // Sunucudan gelen veriler

        // Eğer sunucudan gelen veri bir dizi değilse, boş bir dizi olarak atayın
        this.yorumList = Array.isArray(yorumlar) ? yorumlar : [];

        // Geçerli yorumları filtrele
        this.yorumList = this.yorumList.filter((yorum) => yorum && yorum._id);

        // Yorumlar için döngüyü başlatın
        for (const yorum of this.yorumList) {
          // Diğer işlemler...
          if (!yorum || !yorum._id) {
            console.error("Geçersiz yorum nesnesi veya _id değeri:", yorum);
            continue;
          }

          // Yorumun kimliğini alın
          const yorumID = yorum._id;

          // Yorumun ayrıntılarını alın
          const yorumDetay = await axios.get(
            `http://localhost:3000/yorumlar/${yorumID}`
          );

          // Yorumun ayrıntılarını güncelleyin
          yorum.commentExplain = yorumDetay.data.commentExplain;
          yorum.likeCount = yorumDetay.data.likeCount;
          yorum.questionCount = yorumDetay.data.questionCount;
          yorum.isLiked = yorumDetay.data.isLiked;
          yorum.isQuestion = yorumDetay.data.isQuestion;
          yorum.greenBg = yorumDetay.data.greenBg;
          yorum.blueBg = yorumDetay.data.blueBg;
          yorum.imageUrl = yorumDetay.data.img;
        }
      } catch (error) {
        console.error("Yorum ayrıntılarını alma hatası:", error);
      }
    },

    async yorumSil(yorum) {
      try {
        const yorumID = yorum._id; // Yorumun _id değerini alın
        console.log(yorumID);
        const response = await axios.delete(
          `http://localhost:3000/yorumlar/${yorum._id}`
        );
        // Başarılı yanıt alındığında, yorumu frontend'den kaldırabilirsiniz.
        this.yorumList = this.yorumList.filter((item) => item._id !== yorumID);
      } catch (error) {
        console.error("Yorum silme hatası:", error);
      }
    },
    likeCounter(yorum) {
      yorum.isLiked = !yorum.isLiked;
      if (yorum.isLiked) {
        yorum.greenBg = !yorum.greenBg;
        parseInt(yorum.likeCount++);
        yorum.isLiked = true;
      } else {
        yorum.greenBg = !yorum.greenBg;
        parseInt(yorum.likeCount--);
        yorum.isLiked = false;
      }
    },
    questionCounter(yorum) {
      yorum.isQuestion = !yorum.isQuestion;
      if (yorum.isQuestion) {
        yorum.blueBg = !yorum.blueBg;
        parseInt(yorum.questionCount++);
        yorum.isQuestion = true;
      } else {
        yorum.blueBg = !yorum.blueBg;
        parseInt(yorum.questionCount--);
        yorum.isQuestion = false;
      }
    },
    getToday() {
      const date = new Date();
      this.today = date.toLocaleDateString();
    },
  },

  mounted() {
    setInterval(() => {
      this.getYorumlarFromServer(); // Belirli aralıklarla verileri güncelle
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
    this.getToday();
  },
  created() {
    //idsine göre yollamam lazım
    eventBus.$on("yorumEklendi", (yorum) => {
      this.yorumList.push(yorum);
    });
    this.getYorumlarFromServer();
  },
};
</script>
<template>
  <appYorum v-for="(yorum, index) in soru.yorumlar" :key="index">
    <div
      :class="{
        'bg-green-100': yorum.greenBg && !yorum.blueBg,
        'bg-body-bg': !yorum.greenBg && yorum.blueBg,
        'bg-blue-100': yorum.blueBg && !yorum.greenBg,
      }"
      class="mt-12 bg-body-bg p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            src="image/person.png"
            alt="person"
            class="w-[8%] rounded-[50%]"
          />
          <span class="text-body-color font-bold">Admin</span>
          <p class="text-text-color">tarafından</p>
        </div>
        <div id="soru-onay mb-2">
          <div
            class="flex items-center mr-4 cursor-pointer max-sm:items-left text-right"
          >
            <fai @click="yorumSil(yorum)" icon="trash"></fai>
          </div>
        </div>
        <div>
          <span class="text-text-color">{{ this.today }}</span>
        </div>
      </div>
      <div id="soru-resmi">
        <img
          class="soru-resim my-4"
          :src="yorum.img"
          :alt="yorum.commentExplain"
        />
      </div>
      <div class="flex flex-col items-start my-4 gap-4">
        <p class="text-text-color">
          {{ yorum.commentExplain }}
        </p>
        <div id="icons" class="flex items-center justify-center gap-2">
          <div class="flex items-center justify-center flex-col gap-1">
            <fai
              @click="likeCounter(yorum)"
              :class="yorum.isLiked ? 'text-dark-purple' : ''"
              class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
              icon="heart"
            />
            <span class="text-body-color font-bold">{{
              yorum.likeCount || 0
            }}</span>
          </div>
          <div class="flex items-center justify-center flex-col gap-1">
            <fai
              @click="questionCounter(yorum)"
              :class="yorum.isQuestion ? 'text-dark-purple' : ''"
              class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
              icon="question"
            />
            <span class="text-body-color font-bold">{{
              yorum.questionCount || 0
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </appYorum>
</template>
