<script>
import axiosInstance from "@/lib/axios";
import SoruSor from "@/components/global/SoruSor.vue";
import SoruListesi from "@/components/global/SoruListesi.vue";
import CanliDers from "@/components/sidebar/CanliDers.vue";
import SinifUyeleri from "@/components/sidebar/SinifUyeleri.vue";
import Takvim from "@/components/sidebar/Takvim.vue";
import Kategoriler from "@/components/sidebar/Kategoriler.vue";
import LikeAndComment from "@/components/global/LikeAndComment.vue";

export default {
  components: {
    SoruSor,
    SoruListesi,
    CanliDers,
    SinifUyeleri,
    Takvim,
    Kategoriler,
    LikeAndComment,
  },

  data() {
    return {
      sorular: [],
      konu: "",
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
    async getKategoriler() {
      try {
        const response = await axiosInstance.get(
          `http://localhost:3000/sorular/konular/${this.$route.params.konu}`
        );
        this.sorular = response.data;
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    },
    async soruSil(itemToDelete) {
      try {
        const response = await axiosInstance.delete(
          `http://localhost:3000/sorular/${itemToDelete._id}`,
          {}
        );

        // this.user.sorulanSoru--;

        // Başarılı yanıt alındığında, itemToDelete'i frontend'den kaldırabilirsiniz.
        this.sorular = this.sorular.filter((soru) => soru !== itemToDelete);
      } catch (error) {
        console.error("Soru silme hatası:", error);
      }
    },
  },
  created() {
    this.getKategoriler();
  },
  mounted() {
    setInterval(() => {
      this.getKategoriler();
    }, 10000);
  },
};
</script>
<template>
  <Header></Header>
  <div
    class="container mt-6 flex gap-8 items-start justify-center flex-row max-sm:p-4 max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:text-center max-lg:flex-col"
  >
    <div class="w-[50%] max-sm:w-full">
      <CanliDers></CanliDers>
      <Kategoriler></Kategoriler>
    </div>
    <div class="w-full">
      <div v-for="soru in sorular">
        <div class="bg-white flex flex-col gap-4 p-8 mb-10 max-sm:text-left">
          <div id="soru-header" class="flex items-center justify-between">
            <div id="soru-paylasan" class="flex items-center gap-2">
              <img
                src="@/assets/images/person.png"
                alt="person"
                class="w-[8%] rounded-[50%]"
              />
              <span class="text-body-color font-bold">{{ soru.username }}</span>
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
                :src="soru.imageUrl"
                :alt="soru.soruBasligi"
              />
            </div>
          </div>
          <div
            class="p-2 rounded text-white bg-dark-pink w-[23%] text-center max-sm:w-full"
          >
            {{ soru.konu }}
          </div>
          <LikeAndComment :soru="soru"></LikeAndComment>
        </div>
      </div>
    </div>
    <div class="max-sm:w-full">
      <Takvim
        class="mb-6 max-lg:items-center max-lg:flex max-lg:justify-center"
      ></Takvim>
      <SinifUyeleri></SinifUyeleri>
    </div>
  </div>
</template>
