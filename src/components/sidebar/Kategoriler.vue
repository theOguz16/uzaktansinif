<script setup>
import konuListesi from "@/data/konu.json";
</script>

<template>
  <div class="flex flex-col bg-white rounded-[5px] w-full">
    <span
      class="font-bold text-sm text-theme-primary border-b-2 text-center py-6 block"
      >FİZİK KONULARI
      <button @click="konuEkle" type="submit">
        <!-- <fai class="ml-2 cursor-pointer" icon="plus"></fai> -->
      </button>
    </span>
    <InputText
      class="outline-none"
      v-if="isVisible"
      type="text"
      v-model="yeniKonu"
      placeholder="Konu giriniz"
    />
    <ul class="flex flex-col bg-white rounded-[5px] w-full">
      <li v-for="item in this.konular" class="border-b-2 px-6 py-6">
        <RouterLink
          class="font-bold text-sm text-theme-primary transition-all hover:text-dark-pink"
          :to="`/konular/${item.konu}`"
          >{{ item.konu }}</RouterLink
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      konular: konuListesi,
      yeniKonu: "",
      isVisible: false,
    };
  },
  methods: {
    konuEkle() {
      this.isVisible = !this.isVisible;

      if (this.yeniKonu) {
        const newKonu = {
          konu: this.yeniKonu,
        };

        this.konular.push(newKonu);

        this.yeniKonu = "";
      }
    },
  },
};
</script>
