const express = require('express')
const app = express();
app.use(express.json());
const nodemailer = require("nodemailer");
const user = require('./models/user.schems');
const connect = require('./config/db');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'priyalgabani2004@gmail.com',
    pass: 'padb iwph qjte itpg'
  }
});
let otp = Math.floor(Math.random()* 100000);


app.post("/otp", async (req, res) => {
  const mailOptions = {
    from: 'priyalgabani2004@gmail.com',
    to: req.body.email,
    subject: "password reset",
    html: `<h1>OTP ${otp}</h1>`
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
    res.send("complete");
  });
})
app.post("/varify", async (req, res) => {
  let { cotp, password ,email} = req.body;
  if (cotp == otp) {
    let userdata = await user.findOne({ email: email })
    console.log(userdata)
    if (userdata) {
      userdata.password = password
      await userdata.save();
      res.send("password updated successfully");
    }
    else {
      res.send("user not found");
    }
  }
  else {
    res.send("wrong otp")
  }
})
app.get('/signup',async(req, res) => {
  let data = await user.find()
res.send(data)
})

app.post("/signup", async (req, res) => {
  const {username ,password , email} = req.body

  let userdatas = await user.findOne({email : email})
  if(userdatas){
      res.send("already account")
  }
  else{
  let data = await user.create(req.body);
  res.send(data);
  console.log(data);
  }
})

app.listen(8000, () => {
  connect()
  console.log("listening on start server");
})