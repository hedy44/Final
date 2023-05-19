module.exports = (sequelize, DataTypes) => {

    const Sensor = sequelize.define('sensor', 
    {
        sensortype:{
            type:DataTypes.ENUM('Temp Sensor', 'Hum Sensor', 'Img Sensor'),
            allowNull: false
            },
        model:{
            type:DataTypes.ENUM('MKR WAN 1310', 'Camera', 'Other'),
            allowNull: false
              },
        frequencyPlan:{
            type:DataTypes.ENUM('Europe 863-870 MHZ (SF12 for RX2)', 'Europe 863-870 MHZ (SF9 for RX2)-recommended'),
            allowNull: false
                      },
        devEUI:{
            type:DataTypes.STRING(16),
            allowNull: false
               },
        appEUI:{
            type:DataTypes.STRING(16),
            allowNull: false
                },
        appKey:{
            type:DataTypes.STRING(34),
            allowNull: false
               },
            
        sensorname:{
            type:DataTypes.STRING(255),
            allowNull: false
                   },
        location: DataTypes.STRING(255),
        description:DataTypes.TEXT
       
    },
    {
        freezeTableName: true //To not pluralize the table name

     });

     return Sensor;

};