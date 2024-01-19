<script>
import LikeAndComment from "@/components/global/LikeAndComment.vue";
import { eventBus } from "@/main.js";
import Soru from "@/components/global/Soru.vue";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import jwt_decode from "jwt-decode";
import box from "@/store/box.js";
import Loader from "@/components/global/Loader.vue";

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
      username: null,
      user: {},
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
    async getPostsFromServer() {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3000/sorular"
        );
        this.soruList = response.data;
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
        // Sadece admin veya soruyu soran kişi silebilir
        if (
          this.username !== "admin" &&
          this.username !== itemToDelete.username
        ) {
          box.addError(
            "Üzgünüm",
            "Bu soruyu sadece öğretmen veya soruyu soran kişi silebilir."
          );
          return;
        }

        const response = await axiosInstance.delete(
          `http://localhost:3000/sorular/${itemToDelete._id}`
        );

        this.user.sorulanSoru--;

        // Başarılı yanıt alındığında, itemToDelete'i frontend'den kaldırabilirsiniz.
        this.soruList = this.soruList.filter((soru) => soru !== itemToDelete);
        box.addSuccess("Tebrikler", "Soru Silme İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");
        console.error("Soru silme hatası:", error);
      }
    },
  },

  created() {
    this.usernameBul(); // Kullanıcı adını almak için bu yöntemi çağırın
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
  height: 250px;
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
            class="w-[8%] rounded-[50%] max-sm:w-[32px]"
          />
          <RouterLink :to="`/sinif-uyeleri/${soru.username}`">
            <span class="text-body-color font-bold"
              >{{ soru.username }}
            </span></RouterLink
          >
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
            <span class="text-text-color">{{
              formatTarih(soru.createdAt)
            }}</span>
          </div>
        </div>
      </div>
      <div id="soru-icerigi" class="flex flex-col gap-4">
        <div id="soru-basligi">
          <h2 class="text-body-color max-sm:text-left">
            {{ soru.soruBasligi }}
          </h2>
        </div>
        <div id="soru-icerigi">
          <p class="text-text-color max-sm:text-left">
            {{ soru.soruAciklamasi }}
          </p>
        </div>
        <div id="soru-resmi">
          <img
            class="soru-resim"
            :src="soru.imageUrl"
            :alt="soru.soruBasligi"
          />
        </div>
      </div>
      <div
        class="p-2 rounded text-white bg-dark-pink w-[23%] text-center max-sm:w-full"
      >
        <!-- {{ soru.konu }} -->
        <RouterLink :to="`/konular/${soru.konu}`">{{ soru.konu }}</RouterLink>
      </div>
      <hr />
      <LikeAndComment :soru="soru"></LikeAndComment>
    </div>
  </appSoru>
</template>
