<script>
import Yorum from "./Yorum.vue";
import { eventBus } from "../../main.js";

export default {
  components: {
    appYorum: Yorum,
  },
  data() {
    return {
      yorumList: [],
      today: "",
    };
  },
  methods: {
    yorumSil(itemToDelete) {
      this.yorumList = this.yorumList.filter((yorum) => yorum !== itemToDelete);
    },
    likeCounter(yorum) {
      yorum.isLiked = !yorum.isLiked;
      if (yorum.isLiked) {
        yorum.greenBg = !yorum.greenBg;
        parseInt(yorum.likeCount++);
        yorum.isLiked = true;
      } else {
        yorum.greenBg = !yorum.greenBg;
        parseInt(yorum.likeCount--);
        yorum.isLiked = false;
      }
    },
    questionCounter(yorum) {
      yorum.isQuestion = !yorum.isQuestion;
      if (yorum.isQuestion) {
        yorum.blueBg = !yorum.blueBg;
        parseInt(yorum.questionCount++);
        yorum.isQuestion = true;
      } else {
        yorum.blueBg = !yorum.blueBg;
        parseInt(yorum.questionCount--);
        yorum.isQuestion = false;
      }
    },
    getToday() {
      const date = new Date();
      this.today = date.toLocaleDateString();
    },
  },

  mounted() {
    this.getToday();
  },
  created() {
    //idsine göre yollamam lazım
    eventBus.$on("yorumEklendi", (yorum) => {
      this.yorumList.push(yorum);
    });
  },
};
</script>
<template>
  <appYorum v-for="(yorum, index) in yorumList" :key="index">
    <div
      :class="{
        'bg-green-100': yorum.greenBg && !yorum.blueBg,
        'bg-body-bg': !yorum.greenBg && yorum.blueBg,
        'bg-blue-50': yorum.blueBg && !yorum.greenBg,
      }"
      class="mt-12 bg-body-bg p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            src="public\image\person.png"
            alt="person"
            class="w-[8%] rounded-[50%]"
          />
          <span class="text-body-color font-bold">Admin</span>
          <p class="text-text-color">tarafından</p>
        </div>
        <div id="soru-onay mb-2">
          <div class="flex items-center mr-4 cursor-pointer max-sm:items-left">
            <fai @click="yorumSil(yorum)" icon="trash"></fai>
          </div>
        </div>
        <div>
          <span class="text-text-color">{{ this.today }}</span>
        </div>
      </div>
      <div id="soru-resmi">
        <img class="soru-resim" :src="yorum.img" :alt="yorum.commentExplain" />
      </div>
      <div class="flex flex-col items-start my-4 gap-4">
        <p class="text-text-color">
          {{ yorum.commentExplain }}
        </p>
        <div id="icons" class="flex items-center justify-center gap-2">
          <div class="flex items-center justify-center flex-col gap-1">
            <fai
              @click="likeCounter(yorum)"
              :class="yorum.isLiked ? 'text-dark-purple' : ''"
              class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
              icon="heart"
            />
            <span class="text-body-color font-bold">{{
              yorum.likeCount || 0
            }}</span>
          </div>
          <div class="flex items-center justify-center flex-col gap-1">
            <fai
              @click="questionCounter(yorum)"
              :class="yorum.isQuestion ? 'text-dark-purple' : ''"
              class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
              icon="question"
            />
            <span class="text-body-color font-bold">{{
              yorum.questionCount || 0
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </appYorum>
</template>
