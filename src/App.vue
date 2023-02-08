<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="flex flex-col gap-4">
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">register</RouterLink>
    <RouterLink to="/">home</RouterLink>
  </div>
  <RouterView />
</template>
