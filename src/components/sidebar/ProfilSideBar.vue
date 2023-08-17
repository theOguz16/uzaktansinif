<script setup></script>
<template>
  <nav
    class="hidden group-hover:block absolute bg-white w-[200px] rounded-md top-[40px] shadow-md hover:block transition-all duration-300 z-10 max-lg:text-left max-lg:right-[-25px] max-lg:top-[55px]"
  >
    <span
      class="text-xs font-semibold uppercase border-b border-b-slate-100 w-full block py-2 px-4"
      >Hesabım</span
    >
    <router-link
      to="/profile"
      class="block text-sm font-medium py-3 px-4 hover:text-theme-main duration-300"
    >
      Profil
    </router-link>
    <router-link
      to="/profile/profile-settings"
      class="block text-sm font-medium py-3 px-4 hover:text-theme-main duration-300"
      >Profil Ayarları</router-link
    >
    <router-link
      to="/odev"
      class="block text-sm font-medium py-3 px-4 hover:text-theme-main duration-300"
      >Ödevler</router-link
    >

    <router-link
      to="/login"
      class="block text-sm font-medium py-3 px-4 hover:text-theme-main duration-300"
      >Çıkış Yap</router-link
    >
  </nav>
</template>
