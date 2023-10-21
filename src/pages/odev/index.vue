<script>
import konuListesi from "@/data/konu.json";
import kitapListesi from "@/data/kitaplar.json";
import axios from "axios";
import { eventBus } from "@/main.js";

export default {
  data() {
    return {
      konuListesi: konuListesi,
      kitapListesi: kitapListesi,
      odevListe: [],
      odevEkle: {
        text: "",
        date: "",
        konu: "",
        kitap: "",
      },
    };
  },
  methods: {
    async createOdev() {
      try {
        const response = await axios.post("http://localhost:3000/odev", {
          text: this.odevEkle.text,
          date: this.odevEkle.date,
          konu: this.odevEkle.konu,
          kitapAdi: this.odevEkle.kitap,
        });
        this.odevListe.push(response.data);
        // this.reset();
      } catch (error) {
        console.error(error);
      }
    },
    async removeTodo(itemToDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/odev/${itemToDelete._id}`
        );

        this.odevListe = this.odevListe.filter((odev) => odev !== itemToDelete);
      } catch (error) {
        console.error("odev silme hatası:", error);
      }
    },
    async getOdevlerFromServer() {
      try {
        const response = await axios.get("http://localhost:3000/odev");
        this.odevListe = response.data;
        console.log("ödevler başarıyla alındı");
      } catch (error) {
        console.error("odevlist" + error);
      }
    },
    async fetchOdevler() {
      try {
        const response = await axios.get("http://localhost:3000/odev");
        this.odevListe = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    addTodo() {
      if (this.odevEkle.text !== null) {
        eventBus.$emit("odevEklendi", this.odevEkle);
      }
      this.getOdevlerFromServer();
    },
  },
  created() {
    this.fetchOdevler();
  },
  mounted() {
    setInterval(() => {
      this.getOdevlerFromServer();
    }, 10000);
  },
};
</script>
<template>
  <Header></Header>
  <div class="container">
    <form @submit.prevent="createOdev">
      <h3 class="text-center mt-8 text-xl">Ödevler</h3>
      <p class="text-text-color text-center text-lg">
        Öğretmeninizin verdiği ödevler burada listelenmektedir. Yaptığınız
        ödevlere tik atarak tamamlandı durumuna getirin.
      </p>
      <div class="flex items-center justify-center my-8">
        <InputButton @click="addTodo" text="Ödev Ekle"></InputButton>
      </div>
      <div
        class="flex items-center justify-center gap-2 bg-transparent flex-col"
      >
        <div class="flex gap-4 items-center justify-center max-sm:flex-col">
          <InputSelect
            class="text-text-color outline-dark-purple"
            :items="kitapListesi"
            itemKey="value"
            itemValue="name"
            defaultOptions="Kitap"
            v-model="odevEkle.kitap"
          >
          </InputSelect>
          <InputSelect
            class="text-text-color outline-dark-purple"
            :items="konuListesi"
            itemKey="value"
            itemValue="konu"
            defaultOptions="Konu"
            v-model="odevEkle.konu"
          >
          </InputSelect>
          <InputText
            type="text"
            v-model="odevEkle.text"
            placeholder="Ödev Adı"
          ></InputText>
          <InputDate type="date" v-model="odevEkle.date"></InputDate>
        </div>
        <div>
          <ul>
            <li class="bg-white w-full p-2 mb-4" v-for="odev in odevListe">
              <div class="flex items-center justify-center gap-2">
                <div
                  class="flex gap-4 p-4 justify-center items-center text-center max-sm:flex-col max-sm:items-start max-sm:justify-start max-sm:text-left"
                >
                  <div class="flex flex-col gap-1 p-2 max-sm:p-0">
                    <span>Ödev Açıklaması</span>
                    <span class="text-text-color">{{
                      odev.odevAciklamasi
                    }}</span>
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
              <button
                class="bg-dark-pink text-white rounded p-2 w-full text-center"
                @click="removeTodo(odev)"
              >
                Sil
              </button>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </div>
</template>
