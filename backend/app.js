require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;
// const secretKey = process.env.SECRET_KEY;
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
//Linkedin connect
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

// const middlewareAuth = require("./middlewares/auth");

app.use(bodyParser.json());

const corsOptions = {
  origin: "*", // İzin verilen kökeni güncelleyin
  optionsSuccessStatus: 204, // İsteği başarılı olarak işaretlemek için HTTP durum kodu
};

app.use(cors(corsOptions));

app.get("/", async function (req, res) {
  return res.send({
    test: "test1",
    test2: "test2",
  });
});

// LinkedIn OAuth 2.0 konfigürasyonu
passport.use(
  new LinkedInStrategy(
    {
      clientID: "77vqahtd4gr3vj",
      clientSecret: "ewZ7cL8jQP6Owg51",
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile", "w_member_social"],
    },
    function (accessToken, refreshToken, profile, done) {
      // accessToken'i ve diğer bilgileri kullanarak istediğiniz işlemleri yapabilirsiniz
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// LinkedIn ile kimlik doğrulaması yapılacak rotayı tanımlayın
app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "random_string" })
);

// LinkedIn'den dönüş rotası
app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function (req, res) {
    // Başarılı kimlik doğrulamasından sonra yönlendirme yapılacak rotayı tanımlayın
    res.redirect("/");
  }
);

app.get("/profile", (req, res) => {
  const accessToken = req.user.accessToken; // Kullanıcı oturumunu alın

  // LinkedIn API'sına GET isteği yapın
  axios
    .get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer AQVaQ3Rnm5RxJsOFmZMM0gXPfs_Lndr0pExwtmmgwNanIIcA54daWCaCOI6WMUU5quu5yKHr3YHg-N1Z4VUxNwbh-rv_Y_gQx7s3-egXOGJLrGEe4P0J_V1FBqnGfjup8Fq6Vcxga41YwMJdSYb7YTrZD3FVGW8TmrOl9mCWJmHEMuzfu6nf2-wOPtm6TdIGzs3UJ1YyLmKYrFUK0zw9p4qvgI55UzaMgKTeLmDome2YQ88M9DKw5aJbJzi4JOs8Oxj0rTVymA7dL2_e07pk7CJwlSAeOU5Zud6yJUuwTJ37nm_ATZUlC_iLs_LBYqYF2LoUoeB-u1YcGDv5k5o_jqaocgQ3KQ`,
      },
    })
    .then((response) => {
      // LinkedIn'den gelen veriyi işleyin ve istemciye gönderin
      res.json(response.data);
    })
    .catch((error) => {
      // Hata durumunda uygun bir yanıt gönderin
      res.status(500).json({ error: error.message });
    });
});

// //db bağlanma
// const mongoose = require("mongoose");

// mongoose.connect("uri", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "Bağlantı hatası:"));
// db.once("open", () => {
//   console.log("Veritabanına başarıyla bağlandı!");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
