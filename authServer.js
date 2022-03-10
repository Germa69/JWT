import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5500;

// Express middleware để nhận dữ liệu json được submit lên phía client
app.use(express.json());

let refreshTokens = [];

app.post("/refreshToken", (req, res) => {
  // Kiểm tra refreshToken từ phía client gửi lên có hợp lệ hay không?
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  // Nếu có dữ liệu refreshToken thì kiểm tra xem refreshToken có nằm trong array refreshTokens
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log({ err, data });
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        username: data.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );
	res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  // Authentication
  // Authorization

  // Create a new key
  const data = req.body;

  // sign: 3 prams
  // 1. Thông tin payload mà đưa vô token
  // 2. SECRET_KEY
  // 3. Xét thời gian cho token kết thúc
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

app.post('/logout', (req, res) => {
	// Để xóa đi refreshToken trong refreshToken array 
	// Truyền refreshToken lên từ phía client

	const refreshToken = req.body.token;
	refreshTokens = refreshTokens.filter(refToken => refToken !== refreshToken);

	res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Sever is running on PORT ${PORT}`);
});
