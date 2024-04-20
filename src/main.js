import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import Swiper and modules
// import Swiper from "swiper";
// import { Navigation, Pagination, Scrollbar } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/bundle";
// import "swiper/swiper.min.css";

// Now you can use Swiper
// const swiper = new Swiper(".swiper", {
//   // Install modules
//   modules: [Navigation, Pagination, Scrollbar],
//   speed: 500,
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
//   // ...
// });

export const eventBus = new Vue();

//css
import "./assets/style.css";
import "./assets/effect.css";

// Components

//font-awesome
import "./lib/fontAwesome.js";
import "./lib/fontAwesomeRegular";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.use(router);
app.mount("#app");
app.component("fai", FontAwesomeIcon);
