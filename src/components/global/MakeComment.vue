<template>
  <div class="mt-12">
    <form @submit.prevent="createComment">
      <div
        class="py-3 px-4 text-base border-2 rounded-[5px] outline-dark-purple"
      >
        <img
          class="h-24 w-24 text-center mb-2"
          :src="yorum.img == null ? 'image/addimg.png' : yorum.img"
        />
        <input
          class="hidden"
          ref="file"
          type="file"
          required
          @change="onChange($event)"
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
        class="my-3"
        placeholder="Yorum..."
        type="text"
        required
      ></InputTextarea>
      <InputButton
        @:click="yorumOlustur"
        class="bg-dark-purple w-full text-center outline-none"
        type="submit"
        text="Yorum Yap"
      ></InputButton>
    </form>
  </div>
</template>
<script>
import { eventBus } from "../../main.js";
import axios from "axios";

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
      },
      soruID: null,
    };
  },
  methods: {
    async createComment() {
      try {
        this.soruID = this.soru._id; // Soru kimliğini alın
        const response = await axios.post(
          `http://localhost:3000/soru/${this.soruID}/yorum-ekle`,
          {
            commentExplain: this.yorum.commentExplain,
            img: this.yorum.img,
            likeCount: this.yorum.likeCount,
            isLiked: this.yorum.isLiked,
            questionCount: this.yorum.questionCount,
            isQuestion: this.yorum.isQuestion,
            blueBg: this.yorum.blueBg,
            greenBg: this.yorum.greenBg,
          }
        );

        this.yorumlar.push(response.data); // Yeni yorumu yorumlar listesine ekleyin
        // this.reset();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchQuestions() {
      try {
        const response = await axios.get("http://localhost:3000/yorumlar");
        this.yorumlar = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    onChange(e) {
      const file = e.target.files[0];
      this.yorum.img = URL.createObjectURL(file);
    },
    yorumOlustur() {
      if (this.yorum.commentExplain !== null) {
        eventBus.$emit("yorumEklendi", this.yorum);
        this.soru.yorumlar.push(this.yorum);
        // this.reset();
      }
    },
    // reset() {
    //   this.yorum = {
    //     commentExplain: null,
    //     img: null,
    //     isLiked: false,
    //     isQuestion: false,
    //     likeCount: 0,
    //     questionCount: 0,
    //     greenBg: false,
    //     blueBg: false,
    //   };
    // },
  },
  created() {
    this.fetchQuestions();
  },
};
</script>
