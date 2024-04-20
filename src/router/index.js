import { createRouter, createWebHistory } from "vue-router";

import routes from "~pages";
// import Sorular from "src/components/global/SoruListesi.vue";

// const routes = [{ path: "/konular/:konu", component: Sorular }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
