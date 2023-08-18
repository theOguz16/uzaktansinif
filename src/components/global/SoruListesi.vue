<script>
import LikeAndComment from "./LikeAndComment.vue";
import { eventBus } from "../../main.js";
import Soru from "./Soru.vue";

export default {
  components: {
    appSoru: Soru,
    LikeAndComment: LikeAndComment,
  },
  data() {
    return {
      soruList: [],
      today: "",
    };
  },
  methods: {
    getToday() {
      const date = new Date();
      this.today = date.toLocaleDateString();
    },
    soruSil(itemToDelete) {
      this.soruList = this.soruList.filter((soru) => soru !== itemToDelete);
    },
  },
  created() {
    eventBus.$on("soruEklendi", (soru) => {
      this.soruList.push(soru);
    });
  },
  mounted() {
    this.getToday();
  },
};
</script>
<style>
.soru-resim {
  margin: 0px auto;
}
</style>
<template>
  <appSoru v-for="soru in soruList">
    <div class="mt-24 bg-white flex flex-col gap-4 p-8">
      <div id="soru-header" class="flex items-center justify-between">
        <div id="soru-paylasan" class="flex items-center gap-2">
          <img
            src="public\image\person.png"
            alt="person"
            class="w-[8%] rounded-[50%]"
          />
          <span class="text-body-color font-bold">Admin</span>
          <p class="text-text-color">tarafından</p>
        </div>
        <div>
          <div id="soru-onay mb-2">
            <div
              class="flex items-center justify-end mr-4 cursor-pointer max-sm:items-left"
            >
              <fai @click="soruSil(soru)" icon="trash"></fai>
            </div>
          </div>
          <div id="soru-tarih">
            <span class="text-text-color">{{ this.today }}</span>
          </div>
        </div>
      </div>
      <div id="soru-icerigi" class="flex flex-col gap-4">
        <div id="soru-basligi">
          <h2 class="text-body-color">{{ soru.title }}</h2>
        </div>
        <div id="soru-icerigi">
          <p class="text-text-color">
            {{ soru.explain }}
          </p>
        </div>
        <div id="soru-resmi">
          <img class="soru-resim" :src="soru.img" :alt="soru.title" />
        </div>
      </div>
      <div
        class="p-2 rounded text-white bg-dark-pink w-[23%] text-center max-sm:w-full"
      >
        {{ soru.konuListesi }}
      </div>
      <hr />
      <LikeAndComment :soru="soru"></LikeAndComment>
    </div>
  </appSoru>
</template>
