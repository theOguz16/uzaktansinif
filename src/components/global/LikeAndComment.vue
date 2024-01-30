<script>
import MakeComment from "./MakeComment.vue";
import YorumListesi from "./YorumListesi.vue";
import axios from "axios";
import box from "@/store/box.js";
import axiosInstance from "@/lib/axios";

export default {
  props: {
    soru: Object,
    yorum: Object,
  },
  components: {
    CommentCreate: MakeComment,
    YorumListesi: YorumListesi,
  },
  data() {
    return {
      commentCount: this.soru.yorumCount,
      likeCount: this.soru.likeCount,
      isLiked: this.soru.isLiked,
      commentClicked: null,
      isCommented: this.soru.isCommented,
    };
  },
  methods: {
    async soruBegen() {
      try {
        const response = await axiosInstance.post(
          "https://api.fizikodev.com/soru-begen",
          {
            soruBasligi: this.soru.soruBasligi,
          }
        );

        // Beğeni işlemi sonrası cevaptan gelen veriyi kullanabilirsiniz
        // Örneğin:
        this.likeCount = response.data.likeCount;
        this.isLiked = response.data.isLiked;
        box.addSuccess("Tebrikler", "Soru Beğenme İşlemi Başarılı!");
      } catch (error) {
        box.addError("Üzgünüm", "Bir Hata Oluştu!");

        console.error(error);
      }
    },
    async yorumCounter() {
      try {
        const response = await axiosInstance.post(
          "https://api.fizikodev.com/comment-counter",
          {
            soruBasligi: this.soru.soruBasligi,
          }
        );

        // yorum arttırma işlemi sonrası cevaptan gelen veriyi kullanabilirsiniz
        // Örneğin:
        this.commentCount = response.data.yorumCount;
        this.isCommented = response.data.isCommented;
      } catch (error) {
        console.error(error);
      }
    },
    //frontend icin
    commentCounter() {
      if (this.isCommented) {
        this.isCommented = false;
        this.commentClicked = false;
      } else {
        this.isCommented = true;
        this.commentClicked = true;
      }
    },
    likeCounter() {
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        parseInt(this.likeCount++);
        this.isLiked = true;
      } else {
        parseInt(this.likeCount--);
        this.isLiked = false;
      }
    },
  },
};
</script>
<template>
  <div class="flex items-center justify-end gap-4">
    <div class="flex items-center justify-center flex-col gap-1">
      <fai
        @click="soruBegen"
        :class="isLiked ? 'text-dark-purple' : ''"
        class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all like-icon"
        icon="heart"
      />
      <span class="text-body-color font-bold">{{ soru.likeCount }}</span>
    </div>
    <div class="flex items-center justify-center flex-col gap-1">
      <fai
        @click="yorumCounter"
        @:click="commentCounter"
        :class="isCommented ? 'text-dark-purple' : ''"
        class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
        icon="comments"
      />
      <span class="text-body-color font-bold">{{ soru.yorumCount }}</span>
    </div>
  </div>
  <YorumListesi :soru="soru" :yorum="yorum"> </YorumListesi>
  <CommentCreate
    :soru="soru"
    :yorum="yorum"
    v-if="commentClicked"
  ></CommentCreate>
</template>
