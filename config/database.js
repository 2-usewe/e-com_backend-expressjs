const {Sequelize}=require('sequelize');

/**connect db through sequilize */
const {HOST,USER,DIALECT,DATABASE,PASSWORD} = process.env;
const sequelize = new Sequelize(
    DATABASE,
    USER,
    PASSWORD,
    
    {
        host:HOST,
        dialect:DIALECT,
        logging: false
    });
  const db= {};

/**test the connection */
const connection = async ()=>{
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}


module.exports = {sequelize,connection}