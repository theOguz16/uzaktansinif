<script>
import Yorum from "./Yorum.vue";
import { eventBus } from "@/main.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import box from "@/store/box.js";
import axiosInstance from "@/lib/axios";

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
      yorumlarWUsername: [],
      username: null,
    };
  },
  methods: {
    formatTarih(tarih) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Date(tarih).toLocaleString("tr-TR", options);
    },
    async usernameBul() {
      const token = localStorage.getItem("token");

      if (token) {
        // Token varsa, çözme işlemine başlayabilirsiniz
        const decodedToken = jwt_decode(token); // jwt_decode, token'ı çözmek için kullanılan bir fonksiyon

        // Token içindeki verilere erişin
        this.username = decodedToken.username;

        // Kullanıcı adını kullanabilirsiniz
      } else {
        // Token bulunamadı veya localStorage'da saklanmamış
      }
    },
    async getYorumlarFromServer() {
      try {
        const soruID = this.soru._id;
        const response = await axiosInstance.get(
          `http://185.114.192.249:3000/soru/${soruID}/yorumlar`
        );
        const yeniYorumlar = response.data;

        for (const yeniYorum of yeniYorumlar) {
          const mevcutYorum = this.yorumList.find(
            (yorum) => yorum._id === yeniYorum._id
          );

          if (!mevcutYorum) {
            // Yeni yorumu yerel veri listesine ekleyin
            this.yorumList.push(yeniYorum);
          } else {
            // Yorum zaten yerel veri listesinde varsa, sadece güncelleme yapın
            mevcutYorum.commentExplain = yeniYorum.commentExplain;
            mevcutYorum.likeCount = yeniYorum.likeCount;
            mevcutYorum.questionCount = yeniYorum.questionCount;
            mevcutYorum.isLiked = yeniYorum.isLiked;
            mevcutYorum.isQuestion = yeniYorum.isQuestion;
            mevcutYorum.greenBg = yeniYorum.greenBg;
            mevcutYorum.blueBg = yeniYorum.blueBg;
            mevcutYorum.imageUrl = yeniYorum.img;
          }
        }
      } catch (error) {
        console.error("Yorum ayrıntılarını alma hatası:", error);
      }
    },

    async questionBegen(yorum) {
      try {
        const response = await axiosInstance.post(
          "http://185.114.192.249:3000/question-begen",
          {
            commentExplain: yorum.commentExplain,
          }
        );

        yorum.questionCount = response.data.questionCount;
        yorum.isQuestion = response.data.isQuestion;

        box.addSuccess("Tebrikler", "Yorum Anlamadım İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      }
    },
    async yorumBegen(yorum) {
      try {
        const response = await axiosInstance.post(
          "http://185.114.192.249:3000/yorum-begen",
          {
            commentExplain: yorum.commentExplain,
          }
        );

        // Beğeni işlemi sonrası cevaptan gelen veriyi kullanabilirsiniz
        // Örneğin:
        yorum.likeCount = response.data.likeCount;
        yorum.isLiked = response.data.isLiked;
        box.addSuccess("Tebrikler", "Yorum Beğenme İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      }
    },

    async yorumSil(yorum) {
      try {
        // Sadece admin veya soruyu soran kişi silebilir
        const requestData = {
          username: this.username,
        };
        if (this.username !== "admin" && this.username !== yorum.username) {
          box.addError(
            "Üzgünüm",
            "Bu yorumu sadece öğretmen veya soruyu soran kişi silebilir."
          );
          return;
        }

        const response = await axiosInstance.delete(
          `http://185.114.192.249:3000/yorumlar/${yorum._id}`,
          {
            data: {
              username: this.username,
              soruID: this.soruID,
            },
          }
        );

        this.yorumList = this.yorumList.filter((yorum) => yorum !== yorum);
        box.addSuccess("Tebrikler", "Yorum Silme İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");
        console.error("Yorum silme hatası:", error);
      }
    },
    likeCounter(yorum) {
      yorum.isLiked = !yorum.isLiked;
      yorum.greenBg = !yorum.greenBg;

      if (yorum.isLiked) {
        yorum.likeCount++;
      } else {
        yorum.likeCount--;
      }
    },

    questionCounter(yorum) {
      yorum.isQuestion = !yorum.isQuestion;
      yorum.blueBg = !yorum.blueBg;

      if (yorum.isQuestion) {
        yorum.questionCount++;
      } else {
        yorum.questionCount--;
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
    }, 60000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
    this.getToday();
  },
  created() {
    this.usernameBul();
    // this.usernameBul(); // Kullanıcı adını almak için bu yöntemi çağırın
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
            src="@/assets/images/person.png"
            alt="person"
            class="w-[8%] rounded-[50%] max-sm:w-[32px]"
          />
          <RouterLink :to="`/sinif-uyeleri/${yorum.username}`">
            <span class="text-body-color font-bold"
              >{{ yorum.username }}
            </span></RouterLink
          >
          <p class="text-text-color">tarafından</p>
        </div>
        <div id="soru-onay ">
          <div
            class="flex items-center mr-4 cursor-pointer max-sm:items-right text-right max-sm:relative max-sm:left-[7.5rem] max-sm:top-[0.5rem]"
          >
            <fai @click="yorumSil(yorum)" icon="trash"></fai>
          </div>
        </div>
        <div>
          <span class="text-text-color">{{
            formatTarih(yorum.createdAt)
          }}</span>
        </div>
      </div>
      <div id="soru-resmi">
        <img
          class="soru-resim"
          :src="yorum.imageUrl"
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
              @click="yorumBegen(yorum)"
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
              @click="questionBegen(yorum)"
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
