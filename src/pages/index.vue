<template>
  <Header></Header>

  <div
    class="container mt-6 flex gap-8 items-start justify-center flex-row max-sm:p-4 max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:text-center max-lg:flex-col"
  >
    <div class="w-full">
      <CanliDers></CanliDers>
      <Kategoriler></Kategoriler>
    </div>
    <div class="w-full">
      <SoruSor
        class="w-[630px] max-sm:w-full max-sm:p-4 max-lg:w-full"
      ></SoruSor>
      <SoruListesi></SoruListesi>
    </div>
    <div class="w-full">
      <Takvim
        class="mb-6 max-lg:items-center max-lg:flex max-lg:justify-center"
      ></Takvim>
      <SinifUyeleri class=""></SinifUyeleri>
    </div>
  </div>
</template>
<script>
import SoruSor from "../components/global/SoruSor.vue";
import SoruListesi from "../components/global/SoruListesi.vue";
import CanliDers from "../components/sidebar/CanliDers.vue";
import SinifUyeleri from "../components/sidebar/SinifUyeleri.vue";
import Takvim from "../components/sidebar/Takvim.vue";
import Kategoriler from "../components/sidebar/Kategoriler.vue";
import box from "../store/box.js";
import Loader from "../components/global/Loader.vue";
export default {
  components: {
    SoruSor,
    SoruListesi,
    CanliDers,
    SinifUyeleri,
    Takvim,
    Kategoriler,
    Loader,
  },
  data() {
    return {};
  },
  methods: {
    basici() {
      box.addSuccess("Basiciyim", "basicilar");
      box.addError("puahah", "ahah");
    },
  },
};
</script>
