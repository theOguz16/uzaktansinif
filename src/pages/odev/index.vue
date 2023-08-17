<script>
import konuListesi from "@/data/konu.json";
import kitapListesi from "@/data/kitaplar.json";

export default {
  data() {
    return {
      konuListesi: konuListesi,
      kitapListesi: kitapListesi,
      odevListe: [],
      odevEkle: {
        text: "",
        date: "",
        konu: "",
        kitap: "",
      },
    };
  },
  methods: {
    addTodo() {
      if (this.odevEkle.text !== "") {
        this.odevListe.push({
          text: this.odevEkle.text,
          date: this.odevEkle.date,
          konu: this.odevEkle.konu,
          kitap: this.odevEkle.kitap,
          completed: false,
        });
        this.odevEkle.text = "";
        this.odevEkle.date = "";
        this.odevEkle.konu = "";
        this.odevEkle.kitap = "";
      }
    },
    removeTodo: function (index) {
      if (this.odevListe[index].completed) {
        this.odevListe.splice(index, 1);
      }
    },
  },
};
</script>
<template>
  <Header></Header>
  <div class="container">
    <h3 class="text-center mt-8 text-xl">Ödevler</h3>
    <p class="text-text-color text-center text-lg">
      Öğretmeninizin verdiği ödevler burada listelenmektedir. Yaptığınız
      ödevlere tik atarak tamamlandı durumuna getirin.
    </p>
    <div class="flex items-center justify-center my-8">
      <InputButton @click="addTodo" text="Ödev Ekle"></InputButton>
    </div>
    <div class="flex items-center justify-center gap-2 bg-transparent flex-col">
      <div class="flex gap-4 items-center justify-center max-sm:flex-col">
        <InputSelect
          class="text-text-color outline-dark-purple"
          :items="kitapListesi"
          itemKey="value"
          itemValue="name"
          defaultOptions="Kitap Adı"
          v-model="odevEkle.kitap"
        >
        </InputSelect>
        <InputSelect
          class="text-text-color outline-dark-purple"
          :items="konuListesi"
          itemKey="value"
          itemValue="konu"
          defaultOptions="Konu"
          v-model="odevEkle.konu"
        >
        </InputSelect>
        <InputText v-model="odevEkle.text" placeholder="Ödev Adı"></InputText>
        <InputDate v-model="odevEkle.date"></InputDate>
      </div>
      <div>
        <ul>
          <li
            class="bg-white w-full p-2 mb-4"
            v-for="(todo, index) in odevListe"
            :key="index"
          >
            <div class="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                v-model="todo.completed"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:dark-pink dark:focus:dark-pink dark:dark-pink focus:dark-pink dark:dark-pink dark:dark-pink"
              />
              <div
                class="flex gap-4 p-4 justify-center items-center text-center max-sm:flex-col max-sm:items-start max-sm:justify-start max-sm:text-left"
              >
                <div class="flex flex-col gap-1 p-2 max-sm:p-0">
                  <span>Ödev Açıklaması</span>
                  <span
                    class="text-text-color"
                    :class="{ completed: todo.completed }"
                    >{{ todo.text }}</span
                  >
                </div>
                <div class="flex flex-col gap-1">
                  <span>Kitap Adı</span>
                  <span
                    class="text-text-color"
                    :class="{ completed: todo.completed }"
                    >{{ todo.kitap }}</span
                  >
                </div>
                <div class="flex flex-col gap-1">
                  <span>Konu Adı</span>
                  <span
                    class="text-text-color"
                    :class="{ completed: todo.completed }"
                    >{{ todo.konu }}</span
                  >
                </div>
                <div class="flex flex-col gap-1">
                  <span>Ödev Teslim Tarihi</span>
                  <span
                    class="text-text-color"
                    :class="{ completed: todo.completed }"
                    >{{ todo.date }}</span
                  >
                </div>
              </div>
            </div>
            <button
              class="bg-dark-pink text-white rounded p-2 w-full text-center"
              @click="removeTodo(index)"
            >
              Sil
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
