// require("dotenv").config();

// const jwt = require("jsonwebtoken");
// const User = require("../schema/User");
// const secretKey = process.env.SECRET_KEY;

// module.exports = async (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       message: "Giriş başarısız. Yetkilendirme bilgileri eksik veya hatalı.",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const { username } = jwt.verify(token, secretKey);

//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({
//         message: "Giriş başarısız. Kullanıcı bulunamadı.",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Giriş başarısız. Geçersiz veya süresi dolmuş token.",
//     });
//   }
// };
