<script setup></script>
<template>
  <ul class="flex flex-col bg-white rounded-[5px]">
    <span
      class="font-bold text-sm text-theme-primary border-b-2 py-6 block text-center"
      >SINIF ÜYELERİ</span
    >
    <li class="border-b-2 px-6 py-6">
      <RouterLink
        class="font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex justify-center items-center gap-4"
        to="/test-user"
      >
        <img
          class="w-10 h-10 rounded-[50%]"
          src="public\image\person.png "
          alt="user-profile-image"
        />

        Test User</RouterLink
      >
    </li>
    <li class="border-b-2 px-6 py-6">
      <RouterLink
        class="font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex justify-center items-center gap-4"
        to="/test-user"
      >
        <img
          class="w-10 h-10 rounded-[50%]"
          src="public\image\person.png "
          alt="user-profile-image"
        />

        Test User</RouterLink
      >
    </li>
    <li class="border-b-2 px-6 py-6">
      <RouterLink
        class="font-bold text-sm text-theme-primary transition-all hover:text-dark-pink flex justify-center items-center gap-4"
        to="/test-user"
      >
        <img
          class="w-10 h-10 rounded-[50%]"
          src="public\image\person.png "
          alt="user-profile-image"
        />

        Test User</RouterLink
      >
    </li>
  </ul>
</template>
