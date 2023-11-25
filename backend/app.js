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
    console.log("user", req.user);
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
app.delete("/profile/sorular/:soruID", async function (req, res) {
  try {
    const soruID = req.params.soruID;
    console.log("soruid:", soruID);

    await Soru.findByIdAndDelete(soruID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("profilde soru silme hatası:", error);
    res.status(500).json({ error: "soru silinemedi." });
  }
});

app.get("/profile/odevler", middlewareAuth, async function (req, res) {
  try {
    // Kullanıcının ödevlerini alın
    console.log("user", req.user);
    const odevler = await Odev.find({ username: req.user.username });

    return res.json({
      user: req.user,
      odevler,
    });
  } catch (error) {
    res.status(500).json({ hata: "Sorular alınırken bir hata oluştu." });
  }
});

app.delete("/profile/odevler/:soruID", async function (req, res) {
  try {
    const odevID = req.params.soruID;
    console.log("odevID:", odevID);

    await Odev.findByIdAndDelete(odevID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("profilde ödev silme hatası:", error);
    res.status(500).json({ error: "ödev silinemedi." });
  }
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
      token: token,
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
// Middleware: Kullanıcı rolünü ayarla
function setRoleToTeacherIfAdmin(req, res, next) {
  if (req.body.username === "admin") {
    req.body.role = "Teacher";
  }
  next();
}

// Middleware'ı "/register" endpoint'i ile birleştirin
app.post("/register", setRoleToTeacherIfAdmin, async (req, res) => {
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
      username: req.body.username,
      token: req.body.token, // Kullanıcının token'ını ekleyin
      yorumlar: [
        // {
        //   type: Schema.Types.ObjectId,
        //   ref: "Yorum", // 'Yorum' modeline referans veriyoruz
        // },
      ],
    });

    // const oturumKimligi = req.body.token;
    // const kullaniciAdi = req.body.username;
    // console.log(oturumKimligi, kullaniciAdi);

    //  Soruyu veritabanına kaydedin
    await yeniSoru.save();

    // Bu kod kullanıcının sorularına ekler
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

    const sorularWUsername = sorular.filter((soru) => ({
      ...soru._doc,
      username: soru.username,
    }));

    // Kullanıcının adına göre tüm soruları bulun
    // console.log("sorularwidth" + sorularWUsername);
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
    // const { username } = req.body;
    // const username = req.body.username;

    const user = await User.findOne({ username: req.body.username });
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
      username: req.body.username,
      token: req.body.token,
    });
    await yeniYorum.save();

    const user = await User.findOne({ username: req.body.username });
    user.yapilanYorum++;

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
app.delete("/yorumlar/:yorumID", async (req, res) => {
  try {
    const yorumID = req.params.yorumID;
    console.log(yorumID);

    const user = await User.findOne({ username: req.body.username });
    console.log("yapilanYorum ---" + user.yapilanYorum);
    user.yapilanYorum--;
    console.log("yapilanYorum new" + user.yapilanYorum);

    user.Yorumlar.pull(yorumID);

    await user.save();

    // MongoDB'den soruyu silmek için gerekli sorguyu çalıştırın
    await Yorum.findByIdAndDelete(yorumID);

    res.status(204).send(); // Başarılı yanıt, içerik olmadan (No Content)
  } catch (error) {
    console.error("yorum silme hatası:", error);
    res.status(500).json({ error: "Soru silinemedi." });
  }
});
//TYT netleri
app.post("/users/:userId/tyt-net", async (req, res) => {
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
app.post("/users/:userId/ayt-net", async (req, res) => {
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
app.get("/users/:userId/ayt-net/:week", async (req, res) => {
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
app.get("/users/:userId/ayt-net", async (req, res) => {
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

app.get("/sorular/konular/:konu", async (req, res) => {
  try {
    const konu = req.params.konu;
    console.log(req.params.konu, "paramsKonu");
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const sorular = await Soru.find({ konu: konu });
    res.status(200).json(sorular);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soruları alma sırasında bir hata oluştu." });
  }
});

//sinif uyeleri

app.get("/sinif-uyeleri/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(req.params.username, "paramsUSer");
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const users = await User.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Useri alma sırasında bir hata oluştu." });
  }
});

app.get("/odevler/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(req.params.username, "paramsUSer");
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const users = await Odev.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Ödevi alma sırasında bir hata oluştu." });
  }
});

app.get("/sorular/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(req.params.username, "paramsUSer");
    // Veritabanından konuya göre filtrelenmiş soruları çekin
    const users = await Soru.find({ username: username });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hata: "Soru alma sırasında bir hata oluştu." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
