import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

export const eventBus = new Vue();

//css
import "./assets/style.css";
import "./assets/effect.css";

// Components
import InputText from "./components/forms/InputText.vue";
import InputButton from "./components/forms/InputButton.vue";
import InputDate from "./components/forms/InputDate.vue";
import InputSelect from "./components/forms/InputSelect.vue";
import InputTextarea from "./components/forms/InputTextarea.vue";
import InputFile from "./components/forms/InputFile.vue";

import Soru from "./components/global/Soru.vue";
import Yorum from "./components/global/Yorum.vue";

import Header from "./components/global/Header.vue";
import Search from "./components/global/Search.vue";
import ProfilSideBar from "./components/sidebar/ProfilSideBar.vue";

//font-awesome
import "@/lib/fontAwesome";
import "@/lib/fontAwesomeRegular";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.use(router);
app.mount("#app");
app
  .component("fai", FontAwesomeIcon)
  .component("InputText", InputText)
  .component("InputFile", InputFile)
  .component("InputButton", InputButton)
  .component("InputDate", InputDate)
  .component("InputSelect", InputSelect)
  .component("InputTextarea", InputTextarea)
  .component("Soru", Soru)
  .component("Yorum", Yorum)
  .component("Header", Header)
  .component("Search", Search)
  .component("ProfilSideBar", ProfilSideBar);
