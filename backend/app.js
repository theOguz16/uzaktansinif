const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");

const middlewareAuth = require("./middlewares/auth");

app.use(bodyParser.json());

// JWT için gizli anahtar (bu gizli anahtar güvenli bir yerde saklanmalıdır)
const secretKey = "gizli_anahtar";

const corsOptions = {
  origin: "*", // İzin verilen kökeni güncelleyin
  optionsSuccessStatus: 204, // İsteği başarılı olarak işaretlemek için HTTP durum kodu
};

app.use(cors(corsOptions));

app.get("/profile", middlewareAuth, function (req, res) {
  // const ödev = Odev.find({ userId: req.user._id });
  return res.json({
    user: req.user,
    // ödevleri: ödev,
  });
});

// Örnek özel bir rotaya erişim (test)
app.get("/private-route", middlewareAuth, (req, res) => {
  // Eğer middleware JWT token'ı doğrulamışsa, bu kod çalışır
  res.json({ message: "Bu özel rotaya erişim sağlandı.", user: req.user });
});

// JWT doğrulama middleware'i
function authenticateJWT(req, res, next) {
  const token = req.header("x-auth-token"); // veya başka bir header adı
  if (!token) {
    return res
      .status(401)
      .json({ message: "Erişim yetkiniz yok. JWT token eksik." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Erişim yetkiniz yok. Geçersiz token." });
    }
    req.user = user; // İstek nesnesine kullanıcı bilgilerini ekleyin
    next();
  });
}

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/uzaktansinif"; // MongoDB URI
const client = new MongoClient(uri);

// JWT oluşturmak için işlev
function generateToken(username) {
  const payload = { username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

// Şema tanımlanmış yerin yolunu ekleyin

const Soru = require("./schema/Soru.js");
const User = require("./schema/User.js");
const Yorum = require("./schema/Yorum.js");
const Odev = require("./schema/Odev.js");

//img
const multer = require("multer"); //dosya kaydetmek icin
const upload = multer({ dest: "uploads/" });

app.post(
  "/test",
  middlewareAuth,
  upload.single("file"),
  function (req, res, next) {
    console.log(req.file);
  }
);

//db bağlanma
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/uzaktansinif", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Bağlantı hatası:"));
db.once("open", () => {
  console.log("Veritabanına başarıyla bağlandı!");
});

//istekler

//Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Kullanıcı kimlik doğrulama işlemini çağırın
  const user = await User.findOne({ username });
  console.log("user", user);

  if (user.password !== password) {
    // Kimlik doğrulama başarısızsa hata mesajını gönderin
    return res.status(401).json({ message: "Kimlik doğrulama başarısız." });
  } else {
    // Kimlik doğrulama başarılı ise kullanıcı bilgilerini ve token'ı döndürün
    const token = jwt.sign({ username }, secretKey, {
      expiresIn: "1h",
    });

    delete user.password;

    return res.json({
      message: "Kimlik doğrulama başarılı.",
      user: user,
      token,
    });
  }
});

//logout
app.post("/logout", (req, res) => {
  // Token'ı silmek, kullanıcının oturumu kapatmak anlamına gelir
  // Burada yerel depodan silmeye gerek yok, tarayıcıda yerel depo otomatik olarak temizlenir.

  // İsteğe bağlı olarak kullanıcıyı çıkış yaptığını bildirin
  res.status(200).json({ message: "Çıkış başarılı." });
});

//Ödevler

app.post("/odev", async (req, res) => {
  try {
    //  Gelen verileri kullanarak yeni bir ödev  oluşturun
    const newOdev = new Odev({
      odevAciklamasi: req.body.text,
      odevTarihi: req.body.date,
      konu: req.body.konu,
      kitapAdi: req.body.kitapAdi,
      complated: req.body.complated,
    });

    //  ödevi'ı veritabanına kaydedin
    await newOdev.save();

    res.status(201).json({ mesaj: "odev başarıyla kaydedildi." });
  } catch (error) {
    console.error("odev kaydetme hatası:", error);
    res.status(500).json({ hata: "odev kaydedilirken bir hata oluştu." });
  }
});

app.get("/odev", middlewareAuth, async (req, res) => {
  try {
    const odevler = await Odev.find();
    res.status(200).json(odevler);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/odev/:odevID", async (req, res) => {
  try {
    const odevID = req.params.odevID;

    await Odev.findByIdAndDelete(odevID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("odev silme hatası:", error);
    res.status(500).json({ error: "odev silinemedi." });
  }
});

//Register
app.post("/register", async (req, res) => {
  try {
    //  Gelen verileri kullanarak yeni bir user  oluşturun
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      dateOfBirth: req.body.dateOfBirth,
      city: req.body.city,
      gender: req.body.gender,
      emailAddres: req.body.emailAddres,
      password: req.body.password,
    });

    //  User'ı veritabanına kaydedin
    await newUser.save();

    //Kullanıcıyı kimlik doğrulama için kullanacağınız bir JWT token oluşturun
    const token = jwt.sign({ username: newUser.username }, "gizli_anahtar");

    res.status(201).json({
      mesaj: "user başarıyla kaydedildi.",
      token,
    });
  } catch (error) {
    res.status(500).json({ hata: "user kaydedilirken bir hata oluştu." });
  }
});

app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Soru Ekleme
app.post("/soru-ekle", async (req, res) => {
  try {
    //  Gelen verileri kullanarak yeni bir soru nesnesi oluşturun
    const yeniSoru = new Soru({
      soruBasligi: req.body.title,
      soruAciklamasi: req.body.explain,
      konu: req.body.konuListesi,
      imageUrl: req.body.img,
      likeCount: req.body.likeCount,
      isLiked: req.body.isLiked,
      yorumCount: req.body.yorumCount,
      isCommanted: req.body.isCommanted,

      yorumlar: [
        // {
        //   type: Schema.Types.ObjectId,
        //   ref: "Yorum", // 'Yorum' modeline referans veriyoruz
        // },
      ],
    });

    const oturumKimligi = req.body.token;
    const kullaniciAdi = req.body.username;
    console.log(oturumKimligi, kullaniciAdi);

    //  Soruyu veritabanına kaydedin
    await yeniSoru.save();

    res.status(201).json({ mesaj: "Soru başarıyla kaydedildi." });
  } catch (error) {
    console.error("Soru kaydetme hatası:", error);
    res.status(500).json({ hata: "Soru kaydedilirken bir hata oluştu." });
  }
});

// backendde sorulara bakma
app.get("/soru-ekle", async (req, res) => {
  try {
    const sorular = await Soru.find();
    res.status(200).json(sorular);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Soru beğenme
app.post("/soru-begen", async (req, res) => {
  const soruBasligi = req.body.soruBasligi;
  try {
    const ilgiliSoru = await Soru.findOne({ soruBasligi: soruBasligi });

    if (ilgiliSoru) {
      if (ilgiliSoru.isLiked) {
        ilgiliSoru.likeCount--;
        ilgiliSoru.isLiked = false;
      } else {
        ilgiliSoru.likeCount++;
        ilgiliSoru.isLiked = true;
      }

      await ilgiliSoru.save();
      res.status(200).json(ilgiliSoru);
    } else {
      res.status(404).json({ hata: "Soru bulunamadı." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      hata: "Soru beğenme sırasında bir hata oluştu.",
    });
  }
});

//Comment counter
app.post("/comment-counter", async (req, res) => {
  const { soruBasligi } = req.body;

  try {
    const ilgiliSoru = await Soru.findOne({ soruBasligi });

    if (ilgiliSoru) {
      if (ilgiliSoru.isCommanted) {
        ilgiliSoru.yorumCount--;
        ilgiliSoru.isCommanted = false;
      } else {
        ilgiliSoru.yorumCount++;
        ilgiliSoru.isCommanted = true;
      }

      await ilgiliSoru.save();

      return res.status(200).json(ilgiliSoru);
    } else {
      return res.status(404).json({ hata: "Soru bulunamadı." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      hata: "Soru beğenme sırasında bir hata oluştu.",
    });
  }
});

//Ana sayfaya tüm verileri getirme
app.get("/sorular", async (req, res) => {
  try {
    // Veritabanından tüm soruları çekin
    const sorular = await Soru.find({});
    res.status(200).json(sorular);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soruları alma sırasında bir hata oluştu." });
  }
});
app.get("/soru/:soruID", async (req, res) => {
  const soruID = req.params.soruID;
  // SoruID'ye ait sorunun ayrıntılarını veritabanından çekmek için "populate" kullanın
  const soru = await Soru.findById(soruID);
  if (soru) {
    // Kullanıcı adı ve token gibi ek bilgileri istemciye gönderin
    res.status(200).json({
      soru: soru,
      username: soru.username,
      token: soru.token,
    });
  } else {
    res.status(404).json({ hata: "Soru bulunamadı." });
  }
});

//Soru sil
app.delete("/sorular/:soruID", async (req, res) => {
  try {
    const soruID = req.params.soruID;

    // MongoDB'den soruyu silmek için gerekli sorguyu çalıştırın
    const silinenSoru = await Soru.findByIdAndDelete(soruID);

    // Silinen sorunun bağlantılı yorumlarını alın
    const baglantiliYorum = silinenSoru.yorumlar;

    // Bağlantılı yorumları silebilirsiniz
    for (const yorumID of baglantiliYorum) {
      await Yorum.findByIdAndDelete(yorumID);
    }

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("Soru silme hatası:", error);
    res.status(500).json({ error: "Soru silinemedi." });
  }
});

// Yorum ekle
app.post("/soru/:soruID/yorum-ekle", async (req, res) => {
  try {
    const soruID = req.params.soruID;
    const yeniYorum = new Yorum({
      commentExplain: req.body.commentExplain,
      imageUrl: req.body.img,
      likeCount: req.body.likeCount,
      isLiked: req.body.isLiked,
      questionCount: req.body.questionCount,
      isQuestion: req.body.isQuestion,
      blueBg: req.body.blueBg,
      greenBg: req.body.greenBg,
      yorumlar: [],
    });
    await yeniYorum.save();

    // Yeni yorumun kimliğini alın
    const yorumID = yeniYorum._id;

    // Soruya yeni yorumun kimliğini ekleyin
    const soru = await Soru.findById(soruID);
    soru.yorumlar.push(yorumID);
    await soru.save();

    res.status(201).json({ mesaj: "Yorum başarıyla kaydedildi." });
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    res.status(500).json({ hata: "Yorum eklenirken bir hata oluştu." });
  }
});

// Soruya ait yorumları alma
app.get("/soru/:soruID/yorumlar", async (req, res) => {
  try {
    const soruID = req.params.soruID;
    // SoruID'ye ait sorunun yorumlarını çekmek için "populate" kullanın
    const soru = await Soru.findById(soruID).populate("yorumlar");
    res.status(200).json(soru.yorumlar);
  } catch (error) {
    console.error("Soruya ait yorumları alma hatası:", error);
    res.status(500).json({ hata: "Yorumları alma sırasında bir hata oluştu." });
  }
});

//backendde yorumlara bakma
app.get("/yorumlar", async (req, res) => {
  try {
    const yorumlar = await Yorum.find();
    res.status(200).json(yorumlar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/yorumlar/:yorumID", async (req, res) => {
  try {
    const yorumID = req.params.yorumID;
    // YorumID'ye ait yorumun ayrıntılarını veritabanından çekin
    const yorumDetay = await Yorum.findById(yorumID);

    // Yorum ayrıntılarını döndürün
    res.status(200).json(yorumDetay);
  } catch (error) {
    console.error("Yorum ayrıntılarını alma hatası:", error);
    res
      .status(500)
      .json({ hata: "Yorum ayrıntılarını alma sırasında bir hata oluştu." });
  }
});
//yorum sil
app.delete("/yorumlar/:yorumID", async (req, res) => {
  try {
    const yorumID = req.params.yorumID;
    console.log(yorumID);

    // MongoDB'den soruyu silmek için gerekli sorguyu çalıştırın
    await Yorum.findByIdAndDelete(yorumID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("yorum silme hatası:", error);
    res.status(500).json({ error: "Soru silinemedi." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
