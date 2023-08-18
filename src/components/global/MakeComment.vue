<template>
  <div class="mt-12">
    <form @submit.prevent="createComment">
      <div
        class="py-3 px-4 text-base border-2 rounded-[5px] outline-dark-purple"
      >
        <img
          class="h-24 w-24 text-center mb-2"
          :src="yorum.img == null ? 'public/image/addimg.png' : yorum.img"
        />
        <input
          class="hidden"
          ref="file"
          type="file"
          requried
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
        :required="true"
      ></InputTextarea>
      <InputButton
        @:click="yorumOlustur"
        @click="reset"
        class="bg-dark-purple w-full text-center outline-none"
        type="submit"
        text="Yorum Yap"
      ></InputButton>
    </form>
  </div>
</template>
<script>
import { eventBus } from "../../main.js";

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
      },
    };
  },
  methods: {
    onChange(e) {
      const file = e.target.files[0];
      this.yorum.img = URL.createObjectURL(file);
    },
    yorumOlustur() {
      if (this.yorum.commentExplain !== null) {
        // this.yorumList.push({ ...this.yorum });
        this.soru.yorumlar.push({ ...this.yorum });
        eventBus.$emit("yorumEklendi", { ...this.yorum });
        this.reset();
      }
    },
    reset() {
      this.yorum = {
        commentExplain: null,
        img: null,
        isLiked: false,
        isQuestion: false,
        likeCount: 0,
        questionCount: 0,
        greenBg: false,
        blueBg: false,
      };
    },
  },
};
</script>
