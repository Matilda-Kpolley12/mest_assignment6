const express = require("express");

require("./config/dbConnect");

const app = express();
app.use(express.json());

app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/userRouter"))

app.listen(4001, () =>console.log("Server connected"));