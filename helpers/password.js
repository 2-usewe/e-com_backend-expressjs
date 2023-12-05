const bcrypt=require('bcrypt');

/**password hashing */
 const hashPassword = async(inputs) => {

    try{
        console.log(process.env.SALT);
        const salt_num = parseInt(process.env.SALT);
        const salt=await  bcrypt.genSalt(salt_num);
        const hash = await bcrypt.hash(inputs.newPassword, salt);
        return hash;

    }
    catch(error){
        return error;
    }
    
  }
/**cpmpare password */
const comparePassword = async (inputs)=>{
    try{
        const comp = await bcrypt.compare(inputs.newPassword,inputs.storePassword);
        return comp;
    }
    catch(error){
        return error;
    }
}

  module.exports = {hashPassword,comparePassword};