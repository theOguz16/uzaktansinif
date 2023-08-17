<script setup></script>
<template>
  <div>
    <button
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

    <div>
      <a :href="link">Derse Katıl</a>
    </div>

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
<script>
export default {
  data() {
    return {
      isHovered: false,
      isVisible: false,
      link: "",
    };
  },
  methods: {
    onMouseEnter() {
      this.isHovered = true;
    },
    onMouseLeave() {
      this.isHovered = false;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    logMessage() {
      console.log(this.link);
    },
  },
};
</script>
