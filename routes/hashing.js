const bcrypt = require("bcryptjs");

const hashPassword = async (pass)=>{
    //generating random bytes 
    const salt = await bcrypt.genSalt(10)
    //referencing the password from the above schema and hashing it using bcrypt library
    const hashedpassword = await bcrypt.hash(pass,salt)
    return hashPassword;
}

module.exports = {hashPassword}