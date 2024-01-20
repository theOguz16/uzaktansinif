<script setup>
import Search from "../global/Search.vue";
import Timer from "../sidebar/Timer.vue";
</script>
<template>
  <header
    class="bg-dark-purple flex items-center p-1 h-[70px] mb-20 max-sm:mb-0"
  >
    <div class="container">
      <div
        class="grid grid-cols-4 items-center justify-center max-sm:text-center"
      >
        <div>
          <RouterLink to="/">
            <img
              class="w-[13rem]"
              src="@/assets/images/uzaktansiniflogo.png"
              alt="Logo"
            />
          </RouterLink>
        </div>
        <div>
          <Search></Search>
        </div>
        <div><Timer></Timer></div>
        <div
          class="ml-10 cursor-pointer group relative transition-all duration-300 max-sm:ml-0"
          id="user"
        >
          <div
            class="flex items-center gap-2 max-sm:flex-col max-sm:gap-1 max-sm:mr-auto"
          >
            <RouterLink to="/profile">
              <img
                src="@/assets/images/person.png"
                class="w-10 h-10 rounded-[50%] object-cover max-sm:w-[30px] max-sm:h-[30px]"
                alt="user-photo"
              />
            </RouterLink>
            <span class="text-white font-medium text-sm">
              <span class="mr-[3px]">{{ this.user.name }}</span>
              <span>{{ this.user.surname }}</span>
            </span>
            <ProfilSideBar></ProfilSideBar>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import axiosInstance from "@/lib/axios";

export default {
  data() {
    return {
      user: {},
    };
  },
  methods: {},
  async mounted() {
    const result = await axiosInstance.get("http://localhost:3000/profile");

    this.user = result.data.user;
  },
};
</script>
