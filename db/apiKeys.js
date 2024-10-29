const prisma = require("./prismaClient");

const saveNewApiKey = (hashedKey, data) => {
  return prisma.apiKey.create({
    data: {
      key: hashedKey,
      clientName: data.clientName,
      ownerId: data.owner,
    },
  });
};
const countApiKeys = (userId) => {
  return prisma.apiKey.aggregate({
    _count: {
      ownerId: userId,
    },
  });
};
const getApiKey = (key) => {
  return prisma.apiKey.findUnique({
    where: {
      key: key,
    },
  });
};
const updateUsageCount = async (apiKey) => {
  await prisma.apiKey.update({
    where: {
      key: apiKey.key,
    },
    data: {
      usageCount: apiKey.usageCount + 1,
    },
  });
};

module.exports = {
  saveNewApiKey,
  countApiKeys,
  getApiKey,
  updateUsageCount,
};
