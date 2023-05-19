

module.exports = (sequelize, DataTypes) => {

    const Local = sequelize.define('local', 
    {
        localName: DataTypes.STRING,
        localDescription: DataTypes.STRING
    },
    {
        freezeTableName: true //To not pluralize the table name

     });

     return Local;

};