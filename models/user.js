module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', 
    {
        email: DataTypes.STRING,
        password: DataTypes.STRING
    },
    {
        freezeTableName: true //To not pluralize the table name

     });

     return User;

};

