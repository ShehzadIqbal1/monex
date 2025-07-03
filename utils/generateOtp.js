const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // Move it to utiles

module.exports = {generateOTP};