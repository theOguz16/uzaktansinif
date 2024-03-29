require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const cors = require("cors");
const jwt = require("jsonwebtoken");

const middlewareAuth = require("./middlewares/auth");

app.use(bodyParser.json());

// JWT için gizli anahtar (bu gizli anahtar güvenli bir yerde saklanmalıdır)

//AWS

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIAXYKJRKP7VZNFHB7G",
  secretAccessKey: "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",
  region: "eu-north-1",
});

const s3 = new AWS.S3();

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const corsOptions = {
  origin: "*", // İzin verilen kökeni güncelleyin
  optionsSuccessStatus: 204, // İsteği başarılı olarak işaretlemek için HTTP durum kodu
};

app.use(cors(corsOptions));

app.get("/canliders", middlewareAuth, async function (req, res) {
  return res.json({
    user: req.user,
  });
});

app.get("/profile", middlewareAuth, async function (req, res) {
  // const odevler = Odev.find({ userId: req.user._id });
  return res.json({
    user: req.user,
    // odevler: req.user.odevler,
  });
});

app.get("/profile/sorular", middlewareAuth, async function (req, res) {
  try {
    const sorular = await Soru.find(
      { username: req.user.username },
      { yorumlar: 0 }
    );

    return res.json({
      user: req.user,
      sorular,
    });
  } catch (error) {
    res.status(500).json({ hata: "Sorular alınırken bir hata oluştu." });
  }
});
app.delete(
  "/profile/sorular/:soruID",
  middlewareAuth,
  async function (req, res) {
    // try {
    //   const soruID = req.params.soruID;
    //   console.log("soruid:", soruID);
    //   await Soru.findByIdAndDelete(soruID);
    //   res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
    // } catch (error) {
    //   console.error("profilde soru silme hatası:", error);
    //   res.status(500).json({ error: "soru silinemedi." });
    // }

    try {
      const soruID = req.params.soruID;
      // const { username } = req.body;
      // const username = req.body.username;

      const user = await User.findOne({ username: req.user.username });
      user.sorulanSoru--;

      user.Sorular.pull(soruID);

      await user.save();

      // MongoDB'den soruyu silmek için gerekli sorguyu çalıştırın
      const silinenSoru = await Soru.findByIdAndDelete(soruID);

      // Silinen sorunun bağlantılı yorumlarını alın
      const baglantiliYorum = silinenSoru.yorumlar;

      // Bağlantılı yorumları silebilirsiniz
      for (const yorumID of baglantiliYorum) {
        await Yorum.findByIdAndDelete(yorumID);
      }

      // Eğer soru kullanıcının sahip olduğu bir soru ise, silinmesine izin verin
      if (req.username === req.user.username) {
        // Soruyu veritabanından silin
        await Soru.findByIdAndDelete(soruID);
        return res.json({ mesaj: "Soru başarıyla silindi." });
      } else {
        return res.status(403).json({ hata: "Bu soruyu silme izniniz yok." });
      }

      res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
    } catch (error) {
      console.error("Soru silme hatası:", error);
      res.status(500).json({ error: "Soru silinemedi." });
    }
  }
);

app.get("/profile/odevler", middlewareAuth, async function (req, res) {
  try {
    // Kullanıcının ödevlerini alın
    const odevler = await Odev.find({ username: req.user.username });

    return res.json({
      user: req.user,
      odevler,
    });
  } catch (error) {
    res.status(500).json({ hata: "Sorular alınırken bir hata oluştu." });
  }
});

app.delete(
  "/profile/odevler/:soruID",
  middlewareAuth,
  async function (req, res) {
    try {
      const odevID = req.params.soruID;

      await Odev.findByIdAndDelete(odevID);

      res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
    } catch (error) {
      console.error("profilde ödev silme hatası:", error);
      res.status(500).json({ error: "ödev silinemedi." });
    }
  }
);

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
const uri = "mongodb://testuser:testpassword@94.154.34.59:27017/test"; // MongoDB URI
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
const Link = require("./schema/Link.js");

//db bağlanma
const mongoose = require("mongoose");

mongoose.connect("mongodb://testuser:testpassword@94.154.34.59:27017/test", {
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

  try {
    // Kullanıcı kimlik doğrulama işlemini çağırın
    const user = await User.findOne({ username });

    if (!user) {
      // Kullanıcı bulunamazsa hata mesajını gönderin
      return res.status(401).json({ message: "Kullanıcı bulunamadı." });
    }

    if (user.password !== password) {
      // Şifre yanlışsa hata mesajını gönderin
      return res.status(401).json({ message: "Kimlik doğrulama başarısız." });
    }

    // Kimlik doğrulama başarılı ise kullanıcı bilgilerini ve token'ı döndürün
    const token = jwt.sign({ username }, secretKey, {
      expiresIn: "1h",
    });

    delete user.password;

    return res.json({
      message: "Kimlik doğrulama başarılı.",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

//logout
app.post("/logout", middlewareAuth, (req, res) => {
  // Token'ı silmek, kullanıcının oturumu kapatmak anlamına gelir
  // Burada yerel depodan silmeye gerek yok, tarayıcıda yerel depo otomatik olarak temizlenir.

  // İsteğe bağlı olarak kullanıcıyı çıkış yaptığını bildirin
  res.status(200).json({ message: "Çıkış başarılı." });
});

//Ödevler

app.post("/odev", middlewareAuth, async (req, res) => {
  try {
    //  Gelen verileri kullanarak yeni bir ödev  oluşturun
    const newOdev = new Odev({
      odevAciklamasi: req.body.text,
      odevTarihi: req.body.date,
      konu: req.body.konu,
      kitapAdi: req.body.kitapAdi,
      complated: req.body.complated,
      username: req.body.username,
      token: req.body.token,
    });

    //  ödevi'ı veritabanına kaydedin
    await newOdev.save();

    const user = await User.findOne({ username: req.body.username });

    if (user) {
      user.addOdev(newOdev._id);
    }

    res.status(201).json({ mesaj: "odev başarıyla kaydedildi." });
  } catch (error) {
    console.error("odev kaydetme hatası:", error);
    res.status(500).json({ hata: "odev kaydedilirken bir hata oluştu." });
  }
});

app.get("/odev", middlewareAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const odevler = await Odev.find({ username: username });

    if (!odevler) {
      return res.status(404).json({ msg: "ödevler bulunamadı" });
    }

    res.status(200).json(odevler);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/odev/username", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/odev/:odevID", middlewareAuth, async (req, res) => {
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
// Middleware: Kullanıcı rolünü ayarla
function setRoleToTeacherIfAdmin(req, res, next) {
  if (req.body.username === "admin") {
    req.body.role = "Teacher";
  }
  next();
}

// Middleware'ı "/register" endpoint'i ile birleştirin
app.post(
  "/register",

  setRoleToTeacherIfAdmin,
  async (req, res) => {
    try {
      // Gelen verileri kullanarak yeni bir user oluşturun
      const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
        city: req.body.city,
        gender: req.body.gender,
        emailAddres: req.body.emailAddres,
        password: req.body.password,
        role: req.body.role || "Student", // Eğer role belirtilmediyse "Student" olarak ayarla
      });

      // User'ı veritabanına kaydedin
      await newUser.save();

      // Kullanıcıyı kimlik doğrulama için kullanacağınız bir JWT token oluşturun
      const token = jwt.sign({ username: newUser.username }, "gizli_anahtar");

      res.status(201).json({
        mesaj: "user başarıyla kaydedildi.",
        token,
      });
    } catch (error) {
      res.status(500).json({ hata: "user kaydedilirken bir hata oluştu." });
    }
  }
);

app.get("/register", middlewareAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/register/time", middlewareAuth, async (req, res) => {
  try {
    // Kullanıcıları 'time' alanına göre sıralayarak getir
    const users = await User.find().sort({ time: -1 });

    // Sıralanmış kullanıcıları JSON olarak gönder
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Soru Ekleme

app.post(
  "/soru-ekle",
  [middlewareAuth, upload.single("file")],
  async (req, res) => {
    try {
      const params = {
        Bucket: "uzaktansinif",
        Key: req.file.originalname,
        Body: req.file.buffer,
      };

      // S3'e dosyayı yükle
      const data = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const imageUrl = data.Location;

      const yeniSoru = new Soru({
        soruBasligi: req.body.title,
        soruAciklamasi: req.body.explain,
        konu: req.body.konuListesi,
        imageUrl: imageUrl,
        likeCount: req.body.likeCount,
        isLiked: req.body.isLiked,
        yorumCount: req.body.yorumCount,
        isCommanted: req.body.isCommanted,
        username: req.user.username,
        token: req.body.token,
        yorumlar: [],
      });

      // Dosya yükleme başarılıysa soruyu veritabanına kaydet
      await yeniSoru.save();

      const user = await User.findOne({ username: req.body.username });
      user.sorulanSoru++;

      if (user) {
        user.addSoru(yeniSoru._id);
      }

      res.status(201).json({ mesaj: "Soru başarıyla kaydedildi." });
    } catch (error) {
      console.error("Soru kaydetme hatası:", error);
      res.status(500).json({ hata: "Soru kaydedilirken bir hata oluştu." });
    }
  }
);

// backendde sorulara bakma
app.get("/soru-ekle", middlewareAuth, async (req, res) => {
  try {
    const sorular = await Soru.find();
    res.status(200).json(sorular);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Soru beğenme
app.post("/soru-begen", middlewareAuth, async (req, res) => {
  const soruBasligi = req.body.soruBasligi;
  let isLiked = false;

  try {
    const ilgiliSoru = await Soru.findOne({ soruBasligi });

    if (!ilgiliSoru) {
      return res.status(404).json({ hata: "Soru bulunamadı." });
    }

    const user = req.user;

    for (const likedUser of ilgiliSoru.isLikedUsers) {
      if (likedUser.username == user.username) {
        isLiked = true;
      }
    }

    if (!isLiked) {
      ilgiliSoru.likeCount++;
      ilgiliSoru.isLikedUsers.push(user);
    } else {
      ilgiliSoru.likeCount--;
      ilgiliSoru.isLikedUsers = ilgiliSoru.isLikedUsers.filter(
        (likedUser) => likedUser.username !== user.username
      );
    }

    await ilgiliSoru.save();

    return res.status(200).json(ilgiliSoru);
  } catch (error) {
    return res.status(500).json({
      hata: "Soru beğenme sırasında bir hata oluştu.",
    });
  }
});

//Comment counter
app.post("/comment-counter", middlewareAuth, async (req, res) => {
  const soruBasligi = req.body.soruBasligi;
  let isLiked = false;

  try {
    const ilgiliSoru = await Soru.findOne({ soruBasligi });

    if (!ilgiliSoru) {
      return res.status(404).json({ hata: "Soru bulunamadı." });
    }

    const user = req.user;

    for (const likedUser of ilgiliSoru.isCommantedUsers) {
      if (likedUser.username == user.username) {
        isLiked = true;
      }
    }

    if (!isLiked) {
      ilgiliSoru.yorumCount++;
      ilgiliSoru.isCommantedUsers.push(user);
    } else {
      ilgiliSoru.yorumCount--;
      ilgiliSoru.isCommantedUsers = ilgiliSoru.isCommantedUsers.filter(
        (likedUser) => likedUser.username !== user.username
      );
    }

    await ilgiliSoru.save();

    return res.status(200).json(ilgiliSoru);
  } catch (error) {
    return res.status(500).json({
      hata: "Soru beğenme sırasında bir hata oluştu.",
    });
  }
});

//Ana sayfaya tüm verileri getirme
app.get("/sorular", middlewareAuth, async (req, res) => {
  try {
    // Veritabanından tüm soruları çekin ve tarihe göre sıralayın (en yeni önce)
    const sorular = await Soru.find({});

    // Kullanıcının adına göre tüm soruları bulun
    const sorularWUsername = sorular.map((soru) => ({
      ...soru._doc,
      username: soru.username,
    }));

    res.status(200).json(sorularWUsername);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soruları alma sırasında bir hata oluştu." });
  }
});

app.get("/soru/:soruID", middlewareAuth, async (req, res) => {
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
// app.delete("/sorular/:soruID", async (req, res) => {
//   try {
//     const soruID = req.params.soruID;
//     // const { username } = req.body;
//     // const username = req.body.username;

//     const user = await User.findOne({ username: req.body.username });
//     user.sorulanSoru--;

//     user.Sorular.pull(soruID);

//     await user.save();

//     // MongoDB'den soruyu silmek için gerekli sorguyu çalıştırın
//     const silinenSoru = await Soru.findByIdAndDelete(soruID);

//     // Silinen sorunun bağlantılı yorumlarını alın
//     const baglantiliYorum = silinenSoru.yorumlar;

//     // Bağlantılı yorumları silebilirsiniz
//     for (const yorumID of baglantiliYorum) {
//       await Yorum.findByIdAndDelete(yorumID);
//     }

//     // Eğer soru kullanıcının sahip olduğu bir soru ise, silinmesine izin verin
//     if (req.username === req.user.username) {
//       // Soruyu veritabanından silin
//       await Soru.findByIdAndDelete(soruID);
//       return res.json({ mesaj: "Soru başarıyla silindi." });
//     } else {
//       return res.status(403).json({ hata: "Bu soruyu silme izniniz yok." });
//     }

//     res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
//   } catch (error) {
//     console.error("Soru silme hatası:", error);
//     res.status(500).json({ error: "Soru silinemedi." });
//   }
// });

app.delete("/sorular/:soruID", middlewareAuth, async (req, res) => {
  try {
    const soruID = req.params.soruID;
    const username = req.user.username;
    // Kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ hata: "Kullanıcı bulunamadı." });
    }

    // Kullanıcının sorduğu soru sayısını azalt
    user.sorulanSoru--;

    // Kullanıcının sorularından sormuş olduğu soruyu çıkar
    user.Sorular.pull(soruID);

    // Kullanıcı bilgilerini kaydet
    await user.save();

    // Soruyu ve bağlantılı yorumları sil
    const silinenSoru = await Soru.findByIdAndDelete(soruID);

    if (!silinenSoru) {
      return res.status(404).json({ hata: "Soru bulunamadı." });
    }

    // Sorunun bağlantılı yorumlarını al
    const baglantiliYorum = silinenSoru.yorumlar;

    // Bağlantılı yorumları sil
    for (const yorumID of baglantiliYorum) {
      await Yorum.findByIdAndDelete(yorumID);
    }

    // Başarılı yanıt, içerik olmadan (No Content)
    res.status(204).send();
  } catch (error) {
    console.error("Soru silme hatası:", error);
    res.status(500).json({ error: "Soru silinemedi." });
  }
});

// Yorum ekle
app.post(
  "/soru/:soruID/yorum-ekle",
  [middlewareAuth, upload.single("file")],
  async (req, res) => {
    try {
      const params = {
        Bucket: "uzaktansinif",
        Key: req.file.originalname,
        Body: req.file.buffer,
      };

      // S3'e dosyayı yükle
      const data = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const imageUrl = data.Location;
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
        imageUrl: imageUrl,
        username: req.user.username,
        token: req.body.token,
      });
      await yeniYorum.save();

      const user = await User.findOne({ username: req.body.username });
      // user.yapilanYorum++;

      if (user) {
        user.addYorum(yeniYorum._id);
      }

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
  }
);

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

app.post("/yorum-begen", middlewareAuth, async (req, res) => {
  const commentExplain = req.body.commentExplain;
  let isLiked = false;

  try {
    const ilgiliYorum = await Yorum.findOne({ commentExplain });

    if (!ilgiliYorum) {
      return res.status(404).json({ hata: "Yorum bulunamadı." });
    }

    const user = req.user;

    for (const likedUser of ilgiliYorum.isLikedUsers) {
      if (likedUser.username == user.username) {
        isLiked = true;
      }
    }

    if (!isLiked) {
      ilgiliYorum.likeCount++;
      ilgiliYorum.isLikedUsers.push(user);
    } else {
      ilgiliYorum.likeCount--;
      ilgiliYorum.isLikedUsers = ilgiliYorum.isLikedUsers.filter(
        (likedUser) => likedUser.username !== user.username
      );
    }

    await ilgiliYorum.save();

    return res.status(200).json(ilgiliYorum);
  } catch (error) {
    return res.status(500).json({
      hata: "Yorum beğenme sırasında bir hata oluştu.",
    });
  }
});

app.post("/question-begen", middlewareAuth, async (req, res) => {
  const commentExplain = req.body.commentExplain;
  let isQuestion = false;

  try {
    const ilgiliYorum = await Yorum.findOne({ commentExplain });

    if (!ilgiliYorum) {
      return res.status(404).json({ hata: "Yorum bulunamadı." });
    }

    const user = req.user;

    for (const questionUser of ilgiliYorum.isQuestionUsers) {
      if (questionUser.username == user.username) {
        isQuestion = true;
      }
    }

    if (!isQuestion) {
      ilgiliYorum.questionCount++;
      ilgiliYorum.isQuestionUsers.push(user);
    } else {
      ilgiliYorum.questionCount--;
      ilgiliYorum.isQuestionUsers = ilgiliYorum.isQuestionUsers.filter(
        (questionUser) => questionUser.username !== user.username
      );
    }

    await ilgiliYorum.save();

    return res.status(200).json(ilgiliYorum);
  } catch (error) {
    return res.status(500).json({
      hata: "Yorum beğenme sırasında bir hata oluştu.",
    });
  }
});

//backendde yorumlara bakma
app.get("/yorumlar", middlewareAuth, async (req, res) => {
  try {
    const yorumlar = await Yorum.find();
    res.status(200).json(yorumlar);

    const yorumlarWUsername = yorumlar.filter((yorum) => ({
      ...yorum._doc,
      username: yorum.username,
    }));
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
app.delete("/yorumlar/:yorumID", middlewareAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    const yorumID = req.params.yorumID;

    const yorum = await Yorum.findById(yorumID);
    console.log(yorum);

    user.yapilanYorum--;

    user.Yorumlar.pull(yorumID);

    await user.save();

    // MongoDB'den yorumu silmek için gerekli sorguyu çalıştırın
    await Yorum.findByIdAndDelete(yorumID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("yorum silme hatası:", error);
    res.status(500).json({ error: "Soru silinemedi." });
  }
});
//TYT netleri
app.post("/users/:userId/tyt-net", middlewareAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { week, net } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    user.tytNet.push({ week, net });
    await user.save();

    res.json(user.tytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcının belirli bir haftadaki TYT netini getirmek için bir GET endpoint'i
app.get("/users/:userId/tyt-net/:week", async (req, res) => {
  try {
    const { userId, week } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const tytNet = user.tytNet.find(
      (entry) => entry.week === parseInt(week, 10)
    );
    if (!tytNet) {
      return res.status(404).json({ error: "Net bulunamadı" });
    }

    res.json(tytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Kullanıcının tüm TYT netlerini getirmek için bir GET endpoint'i
app.get("/users/:userId/tyt-net", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.json(user.tytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//AYT netleri
app.post("/users/:userId/ayt-net", middlewareAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { week, net } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    user.aytNet.push({ week, net });
    await user.save();

    res.json(user.aytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcının belirli bir haftadaki AYT netini getirmek için bir GET endpoint'i
app.get("/users/:userId/ayt-net/:week", middlewareAuth, async (req, res) => {
  try {
    const { userId, week } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const aytNet = user.aytNet.find(
      (entry) => entry.week === parseInt(week, 10)
    );
    if (!aytNet) {
      return res.status(404).json({ error: "Net bulunamadı" });
    }

    res.json(aytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Kullanıcının tüm AYT netlerini getirmek için bir GET endpoint'i
app.get("/users/:userId/ayt-net", middlewareAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.json(user.aytNet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//soru Konuları filtreleme

app.get("/sorular/konular/:konu", middlewareAuth, async (req, res) => {
  try {
    const konu = req.params.konu;
    // Veritabanından konuya göre filtrelenmiş konuları çekin
    const sorular = await Soru.find({ konu: konu });
    res.status(200).json(sorular);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soruları alma sırasında bir hata oluştu." });
  }
});

//sinif uyeleri

app.get("/sinif-uyeleri/:username", middlewareAuth, async (req, res) => {
  try {
    const username = req.params.username;
    // Veritabanından konuya göre filtrelenmiş userlari çekin
    const users = await User.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Useri alma sırasında bir hata oluştu." });
  }
});

app.get("/odevler/:username", middlewareAuth, async (req, res) => {
  try {
    const username = req.params.username;
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const users = await Odev.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Ödevi alma sırasında bir hata oluştu." });
  }
});

app.get("/sorular/:username", middlewareAuth, async (req, res) => {
  try {
    const username = req.params.username;
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const users = await Soru.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soru alma sırasında bir hata oluştu." });
  }
});

app.post("/user/updateTime", async (req, res) => {
  const userId = req.body.userId;
  const newTime = req.body.newTime;

  try {
    // Mongoose'de findByIdAndUpdate Promis tabanlı olduğu için 'await' kullanabilirsiniz
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { time: newTime },
      { new: true }
    );

    // Güncellenmiş kullanıcıyı kullanabilirsiniz
    res.json({ message: "User time updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//CanliDers Link

// POST isteği ile link oluşturma veya güncelleme
app.post("/api/link", middlewareAuth, async (req, res) => {
  try {
    //  Gelen verileri kullanarak yeni bir ödev  oluşturun
    const newLink = new Link({
      link: req.body.link,
    });

    //  ödevi'ı veritabanına kaydedin
    await newLink.save();

    res.status(201).json({ mesaj: "odev başarıyla kaydedildi." });
  } catch (error) {
    console.error("odev kaydetme hatası:", error);
    res.status(500).json({ hata: "odev kaydedilirken bir hata oluştu." });
  }
});

// GET isteği ile linki getirme
app.get("/api/link", middlewareAuth, async (req, res) => {
  try {
    const linkDocument = await Link.find({}).sort({ _id: -1 }).limit(1);

    if (linkDocument && linkDocument.length > 0) {
      res.status(200).send(linkDocument[0]);
    } else {
      res.status(404).send("Link bulunamadı");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Bir hata oluştu.");
  }
});

app.post("/search", middlewareAuth, async (req, res) => {
  try {
    const searchText = req.body.searchText;

    const result = await Soru.find({ soruAciklamasi: searchText });

    res.status(201).json(result);
  } catch (error) {
    console.error("islem basarisiz hatası:", error);
    res.status(500).json({ hata: "islem olurken bir hata oluştu." });
  }
});

app.get("/search/:search", middlewareAuth, async (req, res) => {
  try {
    const search = req.params.search;
    // Veritabanından searche göre filtrelenmiş konuları çekin
    const sorular = await Soru.find({ soruAciklamasi: search });
    res.status(200).json(sorular);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soruları alma sırasında bir hata oluştu." });
  }
});

//AWS IMG
app.post("/upload", upload.single("file"), (req, res) => {
  const params = {
    Bucket: "your_bucket_name",
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading file");
    }

    res.send("File uploaded successfully");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
