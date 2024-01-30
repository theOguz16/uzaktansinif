<template>
  <div class="mt-12">
    <form @submit.prevent="createComment">
      <div
        class="py-3 px-4 text-base border-2 rounded-[5px] outline-dark-purple"
      >
        <img
          class="h-24 w-24 text-center mb-2"
          :src="yorum.img == null ? '@/assets/images/person.png' : yorum.img"
        />
        <input
          class="hidden"
          ref="file"
          type="file"
          required
          @change="uploadFile($event)"
        />
        <button
          class="btn btn-outline-secondary text-text-color max-sm:flex"
          type="button"
          @click="$refs.file.click()"
        >
          Resim Seç
        </button>
      </div>
      <InputTextarea
        v-model="yorum.commentExplain"
        class="my-3 text-left"
        placeholder="Yorum..."
        type="text"
        required
      ></InputTextarea>
      <div class="flex justify-center">
        <Loader v-if="loader" />

        <InputButton
          @:click="yorumOlustur"
          class="bg-dark-purple w-full text-center outline-none"
          type="submit"
          text="Yorum Yap"
        ></InputButton>
      </div>
    </form>
  </div>
</template>
<script>
import { eventBus } from "../../main.js";
import axios from "axios";
import box from "@/store/box.js";
import Loader from "@/components/global/Loader.vue";
import axiosInstance from "@/lib/axios";
import { ref } from "vue";

const loader = ref(false);

export default {
  props: {
    soru: Object,
  },
  data() {
    return {
      yorumList: [],
      yorum: {
        commentExplain: null,
        img: null,
        isLiked: false,
        isQuestion: false,
        likeCount: 0,
        questionCount: 0,
        greenBg: false,
        blueBg: false,
        yorumlar: [],
        username: null,
        token: null,
      },
      soruID: null,
      formData: null,
    };
  },
  methods: {
    async createComment() {
      try {
        this.soruID = this.soru._id; // Soru kimliğini alın
        this.yorumOlustur();
        loader.value = true; // Start the loader

        this.formData.append("commentExplain", this.yorum.commentExplain);
        this.formData.append("isLiked", this.yorum.isLiked);
        this.formData.append("isQuestion", this.yorum.isQuestion);
        this.formData.append("imgUrl", this.yorum.img);
        this.formData.append("likeCount", this.yorum.likeCount);
        this.formData.append("questionCount", this.yorum.questionCount);
        this.formData.append("greenBg", this.yorum.greenBg);
        this.formData.append("blueBg", this.yorum.blueBg);

        // this.formData.append("username", this.username);
        this.formData.append("token", localStorage.getItem("token"));

        const response = await axiosInstance.post(
          `https://api.fizikodev.com:3000/soru/${this.soruID}/yorum-ekle`,
          this.formData
        );

        this.yorumlar.push(response.data); // Yeni yorumu yorumlar listesine ekleyin

        box.addSuccess("Tebrikler", "Yorum Yapma İşlemi Başarılı!");

        this.resetYorum();

        return (loader.value = false);
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      } finally {
        loader.value = false; // Stop the loader regardless of success or failure
      }
    },
    async fetchQuestions() {
      try {
        const response = await axiosInstance.get(
          "https://api.fizikodev.com:3000/yorumlar"
        );
        this.yorumlar = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    uploadFile(event) {
      this.formData = new FormData();
      const file = event.target.files[0];

      this.formData.append("file", file);
    },
    yorumOlustur() {
      if (this.yorum.commentExplain !== null) {
        eventBus.$emit("yorumEklendi", this.yorum);
        this.soru.yorumlar.push(this.yorum);
        // this.reset();
      }
    },
    resetYorum() {
      this.yorum = {
        commentExplain: null,
        img: null,
        isLiked: false,
        isQuestion: false,
        likeCount: 0,
        questionCount: 0,
        greenBg: false,
        blueBg: false,
        yorumlar: [],
        username: null,
        token: null,
      };
    },
  },
  created() {
    this.fetchQuestions();
  },
};
</script>
