const prisma = require('./prismaClient');


const saveNewApiKey =  (hashedKey, data) => {
  return prisma.apiKey.create({
    data: {
      key: hashedKey,
      clientName: data.clientName,
      ownerId: data.owner
    },
  })
}
const getApiKeys = (userId) => {
  return prisma.apiKey.findMany({
    where: {
      ownerId: userId
    }
  })
}

module.exports = {
  saveNewApiKey,
  getApiKeys
}