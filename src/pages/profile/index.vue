<script>
export default {
  data() {
    return {
      tyt: null,
      ayt: null,
      tytKontrol: false,
      aytKontrol: false,
      tytList: [],
      aytList: [],
    };
  },
  methods: {
    tytListEkle() {
      if (this.tyt.trim() !== "") {
        this.tytList.push(this.tyt);
        this.tyt = ""; // Input alanını sıfırla
      }
    },
    aytListEkle() {
      if (this.ayt.trim() !== "") {
        this.aytList.push(this.ayt);
        this.ayt = ""; // Input alanını sıfırla
      }
    },
    tytHesapla() {
      if (this.tytKontrol == false) {
        this.tytKontrol = true;
      } else if ((this.tytKontrol = true)) {
        this.tytKontrol = false;
      }
    },
    aytHesapla() {
      if (this.aytKontrol == false) {
        this.aytKontrol = true;
      } else if ((this.aytKontrol = true)) {
        this.aytKontrol = false;
      }
    },
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
        <div class="col-span-1 flex justify-evenly items-center">
          <div class="flex gap-4 justify-center flex-col w-[25%] h-[25%]">
            <div class="flex items-center flex-col gap-1 justify-center">
              <h5 class="text-lg text-theme-primary">TYT Neti</h5>
              <span class="text-lg font-medium text-text-color">{{ tyt }}</span>
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
              <span class="text-lg font-medium text-text-color">{{ ayt }}</span>
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
              src="public\image\person.png"
              class="rounded-[100%] h-32 w-32 object-cover"
            />
          </div>
          <span id="kullanici-adi" class="text-2xl font-bold text-theme-primary"
            >admin</span
          >
          <div class="flex gap-2 items-center">
            <span
              id="kullanici-il"
              class="text-base font-medium text-text-color"
              >Bursa</span
            ><span
              id="kullanici-ilce"
              class="text-base font-medium text-text-color"
              >Karacabey</span
            >
          </div>
        </div>
        <div class="col-span-1 flex justify-evenly items-center">
          <div class="flex flex-col items-center gap-2">
            <h5 class="text-lg text-theme-primary">Sorulan Soru</h5>
            <span class="text-lg font-medium text-text-color">2</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <h5 class="text-lg text-theme-primary">Yapılan Yorum</h5>
            <span
              id="takip-edilen-sayisi"
              class="text-lg font-medium text-text-color"
              >4</span
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
                  {{ netler }}
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
                  {{ netler }}
                </span>
              </div>
            </li>
            <br />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
