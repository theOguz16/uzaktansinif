<script>
import konuListesi from "@/data/konu.json";
import kitapListesi from "@/data/kitaplar.json";
import { eventBus } from "@/main.js";
import jwt_decode from "jwt-decode";
import axiosInstance from "@/lib/axios";
import box from "@/store/box.js";

export default {
  data() {
    return {
      user: {},
      usernameList: [],
      konuListesi: konuListesi,
      kitapListesi: kitapListesi,
      odevListe: [],
      odevEkle: {
        text: "",
        date: "",
        konu: "",
        kitap: "",
        username: "",
        token: "",
      },
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
    async createOdev() {
      const token = localStorage.getItem("token");

      if (token) {
        // Token varsa, çözme işlemine başlayabilirsiniz
        const decodedToken = jwt_decode(token); // jwt_decode, token'ı çözmek için kullanılan bir fonksiyon

        // Eğer kullanıcı admin değilse, token içindeki verilere erişin
        if (decodedToken.username !== "admin") {
          this.odevEkle.username = decodedToken.username;
          // Kullanıcı adını kullanabilirsiniz
          console.log("Kullanıcı Adı:", this.odevEkle.username);
        }
      } else {
        // Token bulunamadı veya localStorage'da saklanmamış
        console.log("Token bulunamadı.");
      }

      try {
        const response = await axiosInstance.post(
          "http://185.114.192.249:3000/odev",
          {
            username: this.odevEkle.username,
            token: localStorage.getItem("token"),
            text: this.odevEkle.text,
            date: this.odevEkle.date,
            konu: this.odevEkle.konu,
            kitapAdi: this.odevEkle.kitap,
          }
        );
        box.addSuccess("Tebrikler", "Ödev Oluşturma İşlemi Başarılı!");

        this.odevListe.push(response.data);
        this.fetchOdevler();
        this.reset();
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");
        console.error(error);
      }
    },
    reset() {
      this.odevEkle = {
        text: "",
        date: "",
        konu: "",
        kitap: "",
        username: "",
        token: "",
      };
    },
    async removeTodo(itemToDelete) {
      try {
        const response = await axiosInstance.delete(
          `http://185.114.192.249:3000/odev/${itemToDelete._id}`
        );

        this.odevListe = this.odevListe.filter((odev) => odev !== itemToDelete);
        box.addSuccess("Tebrikler", "Ödev Silme İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error("odev silme hatası:", error);
      }
    },

    async fetchOdevler() {
      try {
        const response = await axiosInstance.get(
          "http://185.114.192.249:3000/odev"
        );
        // this.odevListe = response.data;
        this.odevListe = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async usernameListCreate() {
      try {
        const response = await axiosInstance.get(
          "http://185.114.192.249:3000/odev/username"
        );
        this.usernameList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    addTodo() {
      if (this.odevEkle.text !== null) {
        eventBus.$emit("odevEklendi", this.odevEkle);
      }
    },
  },
  created() {
    this.fetchOdevler(), this.usernameListCreate();
  },
  async mounted() {
    setInterval(() => {
      this.fetchOdevler(), this.usernameListCreate();
    }, 10000);
  },
  async mounted() {
    const result = await axiosInstance.get(
      "http://185.114.192.249:3000/canliders"
    );

    this.user = result.data.user;

    this.fetchOdevler();
    this.usernameListCreate();
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
            v-if="this.user?.role === 'Teacher'"
            class="text-text-color outline-dark-purple"
            :items="this.usernameList"
            itemKey="value"
            itemValue="username"
            defaultOptions="Username List"
            v-model="odevEkle.username"
          >
          </InputSelect>
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
        <div class="max-sm:w-[55%]">
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
                    <span class="text-text-color">{{
                      formatTarih(odev.odevTarihi)
                    }}</span>
                  </div>
                </div>
              </div>
              <button
                v-if="this.user?.role === 'Teacher'"
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
