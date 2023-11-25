<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      users: [],
      sorular: [],
      odevler: [],
      username: "",
    };
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get(
          `http://localhost:3000/sinif-uyeleri/${this.$route.params.username}`
        );
        this.users = response.data;

        this.diziyiCevir();
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    },
    async getOdev() {
      try {
        const response = await axios.get(
          `http://localhost:3000/odevler/${this.$route.params.username}`
        );
        this.odevler = response.data;
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    },
    async getSoru() {
      try {
        const response = await axios.get(
          `http://localhost:3000/sorular/${this.$route.params.username}`
        );
        this.sorular = response.data;
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    },
    diziyiCevir() {
      this.users.forEach((user) => {
        this.user = user;
      });
    },
  },
  created() {
    this.getUser();
    this.getOdev();
    this.getSoru();
  },
  async mounted() {
    await this.getUser();
    await this.getOdev();
    await this.getSoru();
  },
};
</script>
<template>
  <Header></Header>
  <div class="container mt-12">
    <div class="w-full">
      <div class="h-[300px] bg-slate-300 border-lg shadow-lg"></div>
      <div
        class="bg-white grid md:grid-cols-3 grid-cols-1 items-center justify-center md:px-12 px-4 py-4 relative"
      >
        <div class="flex flex-col items-center gap-2">
          <h5 class="text-lg text-theme-primary">Sorulan Soru</h5>
          <span class="text-lg font-medium text-text-color">
            {{ this.user.sorulanSoru }}</span
          >
        </div>
        <div
          class="flex flex-col items-center col-span-1 gap-1 relative bottom-[10px] md:bottom-[30px] z-10"
        >
          <div class="p-2 border-2 border-white rounded-[100%] bg-white">
            <img
              src="image/person.png"
              class="rounded-[100%] h-32 w-32 object-cover"
            />
          </div>
          <span
            id="kullanici-adi"
            class="text-2xl font-bold text-theme-primary"
            >{{ this.user.name + " " + this.user.surname }}</span
          >
          <div class="flex gap-2 items-center">
            <span
              id="kullanici-il"
              class="text-base font-medium text-text-color"
              >{{ this.user.city }}</span
            >
          </div>
        </div>

        <div class="flex flex-col items-center gap-1">
          <h5 class="text-lg text-theme-primary">Yapılan Yorum</h5>
          <span
            id="takip-edilen-sayisi"
            class="text-lg font-medium text-text-color"
            >{{ this.user.yapilanYorum }}</span
          >
        </div>
      </div>
    </div>
    <div id="#net-listesi" class="mt-8 grid grid-cols-2">
      <div id="tyt-net-listesi" class="">
        <div>
          <h2 class="text-center">HAFTALIK TYT NETLERİ</h2>
          <ul>
            <li v-for="(netler, key) in user.tytNet" :key="key">
              <div class="flex gap-4 items-center text-center justify-center">
                <h3 class="text-lg">{{ key + 1 }}. HAFTA:</h3>
                <span class="text-lg">
                  {{ netler.net }}
                </span>
              </div>
            </li>
            <br />
          </ul>
        </div>
      </div>
      <div id="ayt-net-listesi">
        <div>
          <h2 class="text-center">HAFTALIK AYT NETLERİ</h2>
          <ul>
            <li v-for="(netler, key) in user.aytNet" :key="key">
              <div class="flex gap-4 items-center text-center justify-center">
                <h3 class="text-lg">{{ key + 1 }}. HAFTA:</h3>
                <span class="text-lg">
                  {{ netler.net }}
                </span>
              </div>
            </li>
            <br />
          </ul>
        </div>
      </div>
    </div>
    <div v-for="soru in sorular">
      <div class="mt-24 bg-white flex flex-col gap-4 p-8">
        <div id="soru-header" class="flex items-center justify-between">
          <div id="soru-paylasan" class="flex items-center gap-2">
            <img
              src="image/person.png"
              alt="person"
              class="w-[8%] rounded-[50%]"
            />
            <span class="text-body-color font-bold">{{ soru.username }}</span>
            <p class="text-text-color">tarafından</p>
          </div>
          <div>
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
      </div>
    </div>
    <div class="mt-20">
      <ul>
        <li class="bg-white w-full p-2 mb-4" v-for="odev in odevler">
          <div class="flex items-center justify-center gap-2">
            <div
              class="flex gap-4 p-4 justify-center items-center text-center max-sm:flex-col max-sm:items-start max-sm:justify-start max-sm:text-left"
            >
              <div class="flex flex-col gap-1 p-2 max-sm:p-0">
                <span>Ödev Açıklaması</span>
                <span class="text-text-color">{{ odev.odevAciklamasi }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span>Kitap Adı</span>
                <span class="text-text-color">{{ odev.kitapAdi }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span>Konu Adı</span>
                <span class="text-text-color">{{ odev.konu }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span>Ödev Teslim Tarihi</span>
                <span class="text-text-color">{{ odev.odevTarihi }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
