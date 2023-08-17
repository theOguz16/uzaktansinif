<script setup>
// import { reactive, ref } from "@vue/reactivity";
// import { searchUser } from "@/services/index.js";
// import { useRoute, useRouter } from "vue-router";

// const route = useRoute();
// const router = useRouter();

// const users = ref([]);
// const showSearch = ref(false);

// const formData = reactive({
//   usernameOrName: "",
//   loader: false,
// });

// const search = async () => {
//   formData.loader = true;
//   showSearch.value = true;
//   if (formData.usernameOrName.length == 0) return;
//   const res = await searchUser(formData.usernameOrName);
//   if (!res.success && res.error) {
//     formData.loader = false;
//     return box.addError("Hata", `${res.error.message}`);
//   }
//   if (res.status === 200) {
//     formData.loader = false;
//     users.value = res.data.result;
//   }
// };

// const goProfile = (payload) => {
//   if (!payload) return;
//   router.push({ path: `/user-profile/${payload}` });
//   formData.usernameOrName = "";
//   showSearch.value = false;
// };
//
</script>
<template>
  <div class="search relative">
    <input
      class="' w-[500px] py-2 px-4 focus:border-none outline-none text-base sm:w-[100px] lg:w-[275px] '"
      placeholder="Ara.."
      type="text"
    />
    <div
      class="bg-white absolute w-[275px] border-t-2 h-fit max-h-[200px] shadow-md overflow-y-scroll hidden"
    >
      <div class="p-4 whitespace-nowrap">Arama sonucunuz yükleniyor...</div>
      <template>
        <div
          class="item p-4 border-b-2 hover:bg-slate-200 cursor-pointer duration-300"
        >
          <div class="flex items-center gap-2">
            <img
              class="w-10 h-10 rounded-[50%] object-cover"
              alt="user-photo"
            />
            <span class="font-medium text-sm">admin</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
