<script>
import MakeComment from "./MakeComment.vue";
import YorumListesi from "./YorumListesi.vue";

export default {
  components: {
    CommentCreate: MakeComment,
    YorumListesi: YorumListesi,
  },
  data() {
    return {
      commentCount: 0,
      likeCount: 0,
      isLiked: false,
      commentClicked: null,
    };
  },
  methods: {
    likeCounter() {
      if (this.isLiked) {
        parseInt(this.likeCount--);
        this.isLiked = false;
      } else {
        parseInt(this.likeCount++);
        this.isLiked = true;
      }
    },
    commentCounter() {
      if (this.isCommented) {
        parseInt(this.commentCount--);
        this.commentClicked = false;
        this.isCommented = false;
      } else {
        parseInt(this.commentCount++);
        this.commentClicked = true;
        this.isCommented = true;
      }
    },
  },
};
</script>
<template>
  <div class="flex items-center justify-end gap-4">
    <div class="flex items-center justify-center flex-col gap-1">
      <fai
        @click="likeCounter"
        :class="isLiked ? 'text-dark-purple' : ''"
        class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all like-icon"
        icon="heart"
      />
      <span class="text-body-color font-bold">{{ this.likeCount }}</span>
    </div>
    <div class="flex items-center justify-center flex-col gap-1">
      <fai
        @click="commentCounter"
        :class="isCommented ? 'text-dark-purple' : ''"
        class="text-body-color text-xl cursor-pointer hover:text-dark-purple transition-all"
        icon="comments"
      />
      <span class="text-body-color font-bold">{{ this.commentCount }}</span>
    </div>
  </div>
  <YorumListesi></YorumListesi>
  <CommentCreate v-if="commentClicked"></CommentCreate>
</template>
