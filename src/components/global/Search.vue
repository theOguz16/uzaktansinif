<template>
  <div>
    <div class="relative">
      <input
        type="search"
        placeholder="Search"
        class="border-b-2 w-full border-gray-200 rounded-md py-2 px-6"
        v-model="searchText"
        @keyup.enter="handleSearch"
      />
      <fai
        @click="handleSearch"
        class="w-5 h-5 text-gray-700 absolute top-[10px] left-[225px] max-lg:left-[120px] max-sm:hidden"
        icon="search"
      ></fai>
    </div>
  </div>
</template>
<style>
input::placeholder {
  color: #374151;
}
input:focus {
  outline: none;
}
</style>
<script>
import axios from "axios";
import box from "@/store/box.js";

export default {
  data() {
    return {
      searchText: "",
      searchResults: [],
      search: null,
    };
  },
  methods: {
    async handleSearch() {
      try {
        const response = await axios.post("http://localhost:3000/search", {
          searchText: this.searchText,
        });

        this.searchResults = response.data;

        this.searchResults.forEach((search) => {
          this.search = search;
        });

        this.$router.push(`/search/${this.search.soruAciklamasi}`);

        box.addSuccess("Tebrikler", "Arama İşlemi Başarılı!");

        console.log(this.searchResults, "srcres");
      } catch (error) {
        console.error("Arama hatası:", error);
        box.addError("Üzgünüm", "Böyle bir içerik bulunamadı!");
      }
    },
  },
};
</script>
