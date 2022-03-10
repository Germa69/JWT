import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express middleware để nhận dữ liệu json được submit lên phía client
app.use(express.json());

const books = [
  {
    id: 1,
    name: "John Wick",
    author: "Keanu Reeves",
  },
  {
    id: 2,
    name: "Avengers: Endgame",
    author: ["Kamal Angelo Bolden", "Ryan Michelle Bathe"],
  },
];

app.get("/books", authToken, (req, res) => {
  res.json({ status: "Success", data: books });
});

function authToken(req, res, next) {
	const authorizationHeader = req.headers['authorization'];
	// Header trả phía người dùng là 1 String gồm `Beaer [token]`
	const token = authorizationHeader.split(' ')[1];
	if (!token) res.sendStatus(401);

	// Nếu có token thì xác thực xem token có hợp lệ hay không
	// verify: 3 prams
	// 1. token
	// 2. SECRET_KEY
	// 3. callback
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
		console.log({ err, data });	
		if(err) res.sendStatus(403);
		next();
	})
}

app.listen(PORT, () => {
  console.log(`Sever is running on PORT ${PORT}`);
});
