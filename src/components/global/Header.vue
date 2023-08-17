<script setup>
import Search from "@/components/forms/InputSearch.vue";
import Timer from "../sidebar/Timer.vue";
</script>
<template>
  <header class="bg-dark-purple flex items-center p-1 h-[70px] mb-20">
    <div class="container">
      <div
        class="grid grid-cols-4 items-center justify-center max-sm:text-center"
      >
        <div>
          <RouterLink to="/">
            <img
              class="w-[13rem]"
              src="public\image\uzaktansiniflogo.png"
              alt="Logo"
            />
          </RouterLink>
        </div>
        <div
          placeholder="Arama Yap..."
          id="search"
          class="mx-auto max-lg:w-[15%] max-lg:m-0"
        >
          <Search />
        </div>
        <div><Timer></Timer></div>
        <div
          class="ml-10 cursor-pointer group relative transition-all duration-300"
          id="user"
        >
          <div class="flex items-center gap-2">
            <img
              src="public\image\person.png"
              class="w-10 h-10 rounded-[50%] object-cover"
              alt="user-photo"
            />
            <span class="text-white font-medium text-sm max-sm:hidden"
              >admin</span
            >
            <ProfilSideBar></ProfilSideBar>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
