<script>
import axiosInstance from "@/lib/axios";
import axios from "axios";
import box from "@/store/box.js";

export default {
  data() {
    return {
      isHovered: false,
      isVisible: false,
      link: "",
      user: {},
    };
  },
  methods: {
    async createLink() {
      try {
        const response = await axiosInstance.post(
          "https://185.114.192.249:3000/api/link",
          {
            link: this.link,
          }
        );
        console.log("Link oluşturuldu veya güncellendi:", response.data);
        box.addSuccess("Tebrikler", "Canlı Ders Oluşturma İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");
        console.error(
          "Link oluşturulurken veya güncellenirken bir hata oluştu:",
          error
        );
      }
    },

    async getLink() {
      try {
        const response = await axiosInstance.get(
          "https://185.114.192.249:3000/api/link"
        );
        this.link = response.data.link;
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error("Link getirilirken bir hata oluştu:", error);
      }
    },

    async logMessage() {
      if (this.user.role === "Student") {
        // Öğrenciyse belirli bir URL'ye yönlendirmek yerine başka bir yere yönlendir
        window.location.href = this.link;
        box.addSuccess("Tebrikler", "Canlı Derse Katılma İşlemi Başarılı");
      } else if (this.user.role === "Teacher") {
        this.createLink();
      }
    },
    onMouseEnter() {
      this.isHovered = true;
    },
    onMouseLeave() {
      this.isHovered = false;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
  },
  created() {
    this.getLink();
  },

  async mounted() {
    setInterval(() => {
      this.getLink();
    }, 60000);
    const result = await axiosInstance.get(
      "https://185.114.192.249:3000/canliders"
    );

    this.user = result.data.user;
  },
};
</script>
<template>
  <div>
    <button
      v-if="this.user?.role === 'Student'"
      :to="`/${this.link}`"
      v-on:click="logMessage"
      class="bg-dark-purple text-center text-white px-4 py-3 rounded-[4px] w-full mb-3 outline-none"
    >
      Derse Katıl
      <!-- <fai
        class="ml-2"
        icon="info"
        @:mouseenter="onMouseEnter"
        @:mouseleave="onMouseLeave"
      ></fai> -->
    </button>

    <button
      v-if="this.user?.role === 'Teacher'"
      @click="toggleVisibility"
      v-on:click="logMessage"
      class="bg-dark-purple text-center text-white px-4 py-3 rounded-[4px] w-full mb-3 outline-none"
    >
      Canlı Ders Oluştur
      <fai
        class="ml-2"
        icon="info"
        @:mouseenter="onMouseEnter"
        @:mouseleave="onMouseLeave"
      ></fai>
    </button>
    <!-- <button @click="createLink">Linki Kaydet</button> -->

    <!-- <div>
      <a :href="link">Derse Katıl</a>
    </div> -->

    <div v-if="isVisible">
      <InputText
        type="text"
        v-model="link"
        class="mb-3"
        placeholder="Link giriniz"
      />
    </div>
    <div
      v-if="isHovered"
      class="bg-white p-4 rounded-[6px] transition-all duration-300 absolute h-[75px] top-20 max-sm:top-0 max-lg:top-0"
    >
      <h3 class="mb-2 text-sm">Canlı Ders Nasıl Oluşturulur ?</h3>
      <p class="text-sm">
        Canlı dersi oluşturduğunuz sitedeki url adresini aşağıda çıkan yere
        yapıştırın.
      </p>
    </div>
  </div>
</template>
