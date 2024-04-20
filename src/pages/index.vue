<template>
  <div class="flex justify-center items-center mt-36">
    <div id="fb-root"></div>
    <!-- Facebook SDK için gerekli kök element -->
    <!-- Facebook page bileşeni -->
    <h1 class="text-[#39b54a]">Bizden Haberler</h1>
  </div>
  <swiper
    class="swiper-container container mt-12 rounded-xl p-4 bg-gray-50"
    :loop="true"
    :autoplay="{ delay: 3000 }"
    :modules="modules"
    navigation
    :pagination="{ clickable: true }"
    :breakpoints="{
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      900: { slidesPerView: 3, spaceBetween: 20, spaceBetween: 20 },
      1025: { slidesPerView: 2, spaceBetween: 20 },
      1318: { slidesPerView: 4, spaceBetween: 20 },
      1537: { slidesPerView: 4, spaceBetween: 20 },
    }"
    :options="swiperOptions"
  >
    <swiper-slide>
      <div class="flex items-center justify-center gap-4">
        <div id="border" class="rounded bg-gray-50">
          <div
            class="flex flex-col shadow-md border hover:translate-y-2 duration-300"
          >
            <div>
              <img
                class="h-48 w-full text-left object-cover"
                src="../../public/image/ornek-post-1.jpeg"
                alt="linkedin-post-image"
              />
            </div>

            <div class="flex flex-col gap-[10px] p-4">
              <h3 class="text-[22px]">
                Şirketimiz Ödül Kazanmıştır {{ index }}
              </h3>
              <p
                v-if="isTruncated"
                class="font-[500] text-[#757575] text-[16px]"
              >
                {{ truncatedContent }}
              </p>
              <router-link
                :to="link"
                class="mt-4 font-bold flex gap-2 hover:underline decoration-[#757575] duration-300 transform text-[#757575] font-500 text-[16px]"
                @click="goToLink"
                target="_blank"
                >{{ linkText }}
                <div>
                  <span>
                    <font-awesome-icon
                      class="text-white w-[16px] h-[16px] bg-[#0a66c2] p-[6px] items-center justify-center rounded-sm"
                      :icon="['fab', 'linkedin']"
                    />
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div
        class="fb-page"
        data-href="https://www.facebook.com/facebook"
        data-tabs="timeline"
        data-width=""
        data-height="445"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/facebook"
          class="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/facebook">Facebook</a>
        </blockquote>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div
        class="elfsight-app-7e13718e-ab56-4dd1-bec1-f546c0d7de9d"
        data-elfsight-app-lazy
      ></div>
    </swiper-slide>
    <swiper-slide>
      <div class="flex items-center justify-center gap-4">
        <div id="border" class="rounded bg-gray-50">
          <div
            class="flex flex-col shadow-md border hover:translate-y-2 duration-300"
          >
            <div>
              <img
                class="h-48 w-full text-left object-cover"
                src="../../public/image/ornek-post-1.jpeg"
                alt="linkedin-post-image"
              />
            </div>

            <div class="flex flex-col gap-[10px] p-4">
              <h3 class="text-[22px]">
                Şirketimiz Ödül Kazanmıştır {{ index }}
              </h3>
              <p
                v-if="isTruncated"
                class="font-[500] text-[#757575] text-[16px]"
              >
                {{ truncatedContent }}
              </p>
              <router-link
                :to="link"
                class="mt-4 font-bold flex gap-2 hover:underline decoration-[#757575] duration-300 transform text-[#757575] font-500 text-[16px]"
                @click="goToLink"
                target="_blank"
                >{{ linkText }}
                <div>
                  <span>
                    <font-awesome-icon
                      class="w-[16px] h-[16px] text-black p-[6px] items-center justify-center rounded-sm"
                      :icon="['fab', 'x-twitter']"
                    />
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="flex items-center justify-center gap-4">
        <div id="border" class="rounded bg-gray-50">
          <div
            class="flex flex-col shadow-md border hover:translate-y-2 duration-300"
          >
            <div>
              <img
                class="h-48 w-full text-left object-cover"
                src="../../public/image/ornek-post-1.jpeg"
                alt="linkedin-post-image"
              />
            </div>

            <div class="flex flex-col gap-[10px] p-4">
              <h3 class="text-[22px]">
                Şirketimiz Ödül Kazanmıştır {{ index }}
              </h3>
              <p
                v-if="isTruncated"
                class="font-[500] text-[#757575] text-[16px]"
              >
                {{ truncatedContent }}
              </p>
              <router-link
                :to="link"
                class="mt-4 font-bold flex gap-2 hover:underline decoration-[#757575] duration-300 transform text-[#757575] font-500 text-[16px]"
                @click="goToLink"
                target="_blank"
                >{{ linkText }}
                <div>
                  <span>
                    <font-awesome-icon
                      class="text-white w-[16px] h-[16px] bg-[#0a66c2] p-[6px] items-center justify-center rounded-sm"
                      :icon="['fab', 'linkedin']"
                    />
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>

    <!-- <div class="swiper-pagination"></div> -->
    <!-- If we need navigation buttons -->
    <!-- <button @click="swiper.slidePrev()" class="swiper-button-prev"></button>
    <button @click="swiper.slideNext()" class="swiper-button-next"></button> -->

    <!-- If we need scrollbar -->
    <div class="swiper-scrollbar"></div>
  </swiper>
</template>
<script>
// Vue Swiper bileşenlerini oluşturun
import { Navigation, Scrollbar, A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/bundle";
// Swiper ayarlarını belirleme

const swiper = useSwiper();

const modules = [Navigation, Scrollbar, A11y, Pagination];

const swiperOptions = {
  centeredSlides: true,
  slidesPerView: 1,
  grabCursor: true,
  freeMode: false,
  loop: true,
  mousewheel: false,
  keyboard: {
    enabled: true,
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: false,
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
};
// Vue bileşenini oluşturma
export default {
  setup() {
    const swiper = useSwiper();

    return {
      swiper,
      modules: [Navigation, Scrollbar, A11y, Pagination],
    };
  },
  components: {
    Swiper,
    SwiperSlide,
    FontAwesomeIcon,
  },
  data() {
    return {
      swiperOptions: swiperOptions,
      content:
        "XZ Elektronik - SmartMesh Yapay Zeka Destekli Long Range ISM  SmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMSmartMesh Yapay Zeka Destekli Long Range ISMBand Transmitter Receiver ve SaaS Mesh Network Çözümü ile birincilik ödülü kazanmıştır.",
      link: "https://www.linkedin.com/company/xzelectronics/",
      linkText: "Devamını Oku",
      maxLength: 100,
    };
  },
  computed: {
    truncatedContent() {
      if (this.content.length > this.maxLength) {
        return this.content.substring(0, this.maxLength) + "...";
      } else {
        return this.content;
      }
    },
    isTruncated() {
      return this.content.length > this.maxLength;
    },
  },
  mounted() {
    // Facebook SDK'yı yükleme
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src =
        "https://connect.facebook.net/tr_TR/sdk.js#xfbml=1&version=v19.0";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },

  methods: {
    goToLink() {
      window.open(this.link, "_blank");
    },
  },
};
</script>
<style>
/* CSS stilleri */
.swiper-pagination .swiper-pagination-bullet {
  background: #39b54a !important;
}
.insta-bg {
  background: linear-gradient(30deg, #f38334, #da2e7d 50%, #6b54c6);
}
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-button-next:after {
  color: #39b54a;
}
.swiper-button-prev:after {
  color: #39b54a;
}
.swiper-slide {
  font-size: 18px;
  background: #fff;
}
</style>
