import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";
// import Sorular from "src/components/global/SoruListesi.vue";

// const routes = [{ path: "/konular/:konu", component: Sorular }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Oturum açıkken belirli sayfalara erişimi engellemek için oturum kontrolü yapın
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkIfTokenExists(); // Oturum açık mı kontrolü
  const allowedRoutes = ["login", "register"]; // İzin verilen sayfa adları

  if (!isAuthenticated) {
    // Oturum açık değilse
    if (allowedRoutes.includes(to.name)) {
      // İzin verilen sayfalardan birine gitmeye çalışıyorsa izin ver
      next();
    } else {
      // İzin verilmeyen bir sayfaya gitmeye çalışıyorsa giriş sayfasına yönlendir
      router.push("/login");
    }
  } else {
    // Oturum açıksa
    if (allowedRoutes.includes(to.name)) {
      // Giriş yapmış bir kullanıcı "login" veya "register" sayfalarına gidememe kontrolü
      router.push("/"); // Ana sayfaya yönlendir
    } else {
      // Diğer sayfalara erişim izni
      next();
    }
  }
});

export default router;

// Token var mı kontrolü
function checkIfTokenExists() {
  const token = localStorage.getItem("token"); // Token'i yerel depodan alın

  return !!token; // Token varsa true, yoksa false döndürür
}
