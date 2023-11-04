<script>
import axiosInstance from "@/lib/axios";
import axios from "axios";

export default {
  data() {
    return {
      tyt: null,
      ayt: null,
      tytKontrol: false,
      aytKontrol: false,
      tytList: [],
      aytList: [],
      user: {},
      sorular: [],
    };
  },
  methods: {
    async tytListEkle() {
      if (this.tyt.trim() !== "") {
        try {
          // Backend'e TYT netini eklemek için POST isteği gönder
          await axios.post(
            `http://localhost:3000/users/${this.user._id}/tyt-net`,
            {
              week: this.tytList.length + 1, // Haftayı belirlemek için mevcut hafta sayısını kullanabilirsiniz.
              net: this.tyt,
            }
          );
          this.tytList.push(this.tyt);
          this.tyt = ""; // Input alanını sıfırla
        } catch (error) {
          console.error("TYT net kaydetme hatası:", error);
        }
      }
    },

    async aytListEkle() {
      if (this.ayt.trim() !== "") {
        try {
          // Backend'e TYT netini eklemek için POST isteği gönder
          await axios.post(
            `http://localhost:3000/users/${this.user._id}/ayt-net`,
            {
              week: this.aytList.length + 1, // Haftayı belirlemek için mevcut hafta sayısını kullanabilirsiniz.
              net: this.ayt,
            }
          );
          this.aytList.push(this.ayt);
          this.ayt = ""; // Input alanını sıfırla
        } catch (error) {
          console.error("AYT net kaydetme hatası:", error);
        }
      }
    },
    async tytHesapla() {
      if (this.tytKontrol === false) {
        this.tytKontrol = true;
      } else if (this.tytKontrol === true) {
        this.tytKontrol = false;
        try {
          // Hafta numarasını hesaplayın (örneğin, mevcut hafta sayısına 1 ekleyebilirsiniz)
          const week = this.tytList.length + 1;

          // Sunucuya TYT netini güncellemek için PUT isteği gönderin
          const response = await axios.put(
            `http://localhost:3000/users/${this.user._id}/tyt-net`,
            {
              week: week,
              net: this.tyt,
            }
          );

          // TYT netini yerel listeye ekleyin
          this.tytList.push(this.tyt);

          // Input alanını sıfırlayın
          this.tyt = "";
        } catch (error) {
          console.error("TYT net güncelleme hatası:", error);
        }
      }
    },
    async aytHesapla() {
      if (this.aytKontrol === false) {
        this.aytKontrol = true;
      } else if (this.aytKontrol === true) {
        this.aytKontrol = false;
        try {
          // Hafta numarasını hesaplayın (örneğin, mevcut hafta sayısına 1 ekleyebilirsiniz)
          const week = this.aytList.length + 1;

          // Sunucuya TYT netini güncellemek için PUT isteği gönderin
          const response = await axios.put(
            `http://localhost:3000/users/${this.user._id}/tyt-net`,
            {
              week: week,
              net: this.tyt,
            }
          );

          // TYT netini yerel listeye ekleyin
          this.aytList.push(this.ayt);

          // Input alanını sıfırlayın
          this.ayt = "";
        } catch (error) {
          console.error("AYT net güncelleme hatası:", error);
        }
      }
    },

    async getProfileData() {
      try {
        const tytResponse = await axiosInstance.get(
          `http://localhost:3000/users/${this.user._id}/tyt-net`
        );
        this.tytList = tytResponse.data;

        const aytResponse = await axios.get(
          `http://localhost:3000/users/${this.user._id}/ayt-net`
        );
        this.aytList = aytResponse.data;

        const { data } = await axiosInstance.get(
          `http://localhost:3000/profile/sorular`
        );
        this.sorular = data.sorular;
      } catch (error) {
        console.error("Profil bilgilerini alma hatası:", error);
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
        this.sorular = this.sorular.filter((soru) => soru !== itemToDelete);

        // Aynı zamanda kullanıcının "Sorular" listesinden de bu soruyu kaldırın
        const userResponse = await axios.delete(
          `http://localhost:3000/profile/sorular/${itemToDelete._id}`
        );

        // Kullanıcının "Sorular" listesinden başarılı bir şekilde kaldırıldığında, bu değişiklikleri de senkronize edin.
        // Örneğin, this.user.sorular dizisini güncelleyebilirsiniz.
        this.user.sorular = this.user.sorular.filter(
          (soru) => soru._id !== itemToDelete._id
        );
      } catch (error) {
        console.error("Soru silme hatası:", error);
      }
    },
  },
  async mounted() {
    setInterval(() => {
      this.getProfileData(); // Belirli aralıklarla verileri güncelle
    }, 10000); // Örnek: 1 dakikada bir güncelle --> websocket veya loader kullan
    this.getToday();

    const result = await axiosInstance.get("http://localhost:3000/profile");

    this.user = result.data.user;
    console.log(this.user + "user");

    this.getProfileData();
  },
};
</script>
<template>
  <Header></Header>
  <!-- Kullanıcının Sorduğu Sorular -->

  <div class="container mt-12">
    <div class="w-full">
      <div class="h-[300px] bg-slate-300 border-lg shadow-lg"></div>
      <div
        class="bg-white grid md:grid-cols-3 grid-cols-1 items-center justify-center md:px-12 px-4 py-4 relative"
      >
        <div class="col-span-1 flex justify-evenly items-center">
          <div class="flex gap-4 justify-center flex-col w-[25%] h-[25%]">
            <div class="flex items-center flex-col gap-1 justify-center">
              <h5 class="text-lg text-theme-primary">TYT Neti</h5>
              <span class="text-lg font-medium text-text-color">{{
                this.user?.tytNet &&
                this.user.tytNet[this.user.tytNet.length - 1]?.net
              }}</span>
            </div>
            <div
              class="flex flex-col justify-center gap-1 items-center height-[95px]"
            >
              <fai
                class="cursor-pointer"
                @click="tytHesapla"
                v-on:click="tytListEkle"
                icon="pen"
              ></fai>
              <InputText
                v-show="tytKontrol"
                class="w-[25%]"
                v-model="tyt"
              ></InputText>
            </div>
          </div>
          <div class="flex gap-4 justify-center flex-col w-[25%] h-[25%]">
            <div class="flex items-center flex-col gap-1 justify-center">
              <h5 class="text-lg text-theme-primary">AYT Neti</h5>
              <span class="text-lg font-medium text-text-color">{{
                this.user?.aytNet &&
                this.user.aytNet[this.user.aytNet.length - 1]?.net
              }}</span>
            </div>
            <div class="flex flex-col justify-center gap-1 items-center">
              <fai
                class="cursor-pointer"
                @click="aytHesapla"
                v-on:click="aytListEkle"
                icon="pen"
              ></fai>
              <InputText
                v-show="aytKontrol"
                class="w-[25%]"
                v-model="ayt"
              ></InputText>
            </div>
          </div>
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
        <div class="col-span-1 flex justify-evenly items-center">
          <div class="flex flex-col items-center gap-2">
            <h5 class="text-lg text-theme-primary">Sorulan Soru</h5>
            <span class="text-lg font-medium text-text-color">
              {{ this.user.sorulanSoru }}</span
            >
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
    </div>
    <div id="#net-listesi" class="mt-8 grid grid-cols-2">
      <div id="tyt-net-listesi" class="">
        <div>
          <h2 class="text-center">HAFTALIK TYT NETLERİ</h2>
          <ul>
            <li v-for="(netler, key) in this.tytList" :key="key">
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
            <li v-for="(netler, key) in this.aytList" :key="key">
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
        <!-- <LikeAndComment :soru="soru"></LikeAndComment> -->
      </div>
    </div>
  </div>
</template>
