
const axios = require('axios');

// Função para excluir um dispositivo da TTN
const deleteSensorTTN = async (sensorname, devEUI) => {
  try {
    const appID = 'projeto-2022-test';
    const ttnAPIUrl = `https://eu1.cloud.thethings.network/api/v3/applications/${appID}/devices/${sensorname}`;

    const headers = {
      'Authorization': 'Bearer NNSXS.VBDNJAKZMO3PJCOUKZBSMMMQKXDNZJ2JIDAT25Q.LZL37FNTTUJURDKSYK4EM5I4O5AUPYKIZGM3R2I32BYEQLUS6HHA'
    };

    await axios.delete(ttnAPIUrl, { headers });

    console.log('Device deleted from TTN');
  } catch (error) {
    throw new Error('Error deleting device from TTN:', error);
  }
};

module.exports = {
  deleteSensorTTN
};
