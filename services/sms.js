const unirest = require("unirest");

exports.sms = (data) => {
  const sender = "Estate";
  const type = 0;
  const routing = 4;
  
  unirest("GET", `${process.env.SMS_URL}message=${data.message}&to=${data.phone}&sender=${sender}&type=${type}&routing=${routing}&token=${process.env.SMS_TOKEN}`)
    .end(resp => {
      console.log(resp.body);
    });
}