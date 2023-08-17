<script setup></script>
<template>
  <div>
    <div class="container flex bg-white mt-14 p-0">
      <div id="image-container" class="w-[50%]">
        <img src="public\image\uzaktansinifbanner.png" alt="login-image" />
      </div>
      <div id="form-container" class="my-auto mx-auto">
        <form action="" class="flex flex-col gap-4">
          <div>
            <h2 class="text-dark-purple text-center mb-4">Giriş Yap</h2>
          </div>
          <div>
            <InputText
              placeholder="Kullanıcı Adı"
              type="text"
              required
            ></InputText>
          </div>
          <div>
            <InputText placeholder="Şifre" type="password" required></InputText>
          </div>
          <div class="flex justify-center">
            <InputButton
              class="bg-dark-purple w-full"
              type="submit"
              text="Giriş Yap"
            ></InputButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
