// const express = require("express");
// const router = express.Router();

// const Soru = require("./schema/Soru.js"); // Şema tanımlanmış yerin yolunu ekleyin

// router.post("/user-ekle", async (req, res) => {
//   try {
//     // Örnek bir kullanıcı oluştur ve veritabanına kaydet
//     const yeniSoru = new Soru({
//       soruBasligi: "Bu bir örnek soru",
//       soruAciklamasi: "test",
//       konu: "vektörler",
//       imageUrl: "../public/image/soru-ornek.jpeg",
//     });

//     await Soru.create(yeniSoru);

//     // await yeniKullanici.save(); // Kullanıcıyı veritabanına kaydet

//     res.status(201).json({ mesaj: "Kullanıcı başarıyla oluşturuldu." });
//   } catch (error) {
//     console.error("Kullanıcı oluşturma hatası:", error);
//     res.status(500).json({ hata: "Kullanıcı oluşturulurken bir hata oluştu." });
//   }
// });

// module.exports = router;
