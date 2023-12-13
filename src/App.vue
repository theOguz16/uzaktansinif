<script setup>
import { RouterLink, RouterView } from "vue-router";
import { toastList } from "./store/widget/toast.js";
import ResponseMessage from "./components/global/ResponseMessage.vue";
</script>

<template>
  <div class="container"></div>
  <RouterView />

  <div class="response-message-wrapper">
    <transition-group name="response">
      <ResponseMessage
        v-for="toast in toastList"
        :key="toast.uniqId"
        :toastData="toast"
        :length="toastList.length"
      />
    </transition-group>
  </div>
</template>
