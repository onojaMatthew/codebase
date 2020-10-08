const unirest = require("unirest");

exports.sms = async (data) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).json({ error: "Phone number is required" });

  const sender = "";
  const type = 0;
  const routing = 4;
  
  unirest("GET", `${process.env.SMS_URL}message=${message}&to=${phone}&sender=${sender}&type=${type}&routing=${routing}&token=${process.env.SMS_TOKEN}`)
    .end(resp => {
      console.log(resp.body);
      if (resp.body.error === true) return res.status(400).json({ error: resp.body.comment });
      return res.json({ message: "Message sent" });
    });
}

