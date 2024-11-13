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
    where: {
      ownerId: userId,
    },
    _count: true,
  });
};
const getApiKey = (key) => {
  return prisma.apiKey.findUnique({
    where: {
      key: key,
    },
  });
};
const fetchApiKeys = (userId) => {
  return prisma.apiKey.findMany({
    where: {
      ownerId: userId,
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

const fetchAllKeysGroupByOwner = () => {
  return prisma.apiKey.groupBy({
    by: ["ownerId", "key", "usageCount", "maxRequests"],
  });
};

const updateStatus = async (status, id) => {
  await prisma.apiKey.update({
    where: {
      id: id,
    },
    data: {},
  });
};

module.exports = {
  saveNewApiKey,
  countApiKeys,
  getApiKey,
  fetchAllKeysGroupByOwner,
  fetchApiKeys,
  updateUsageCount,
};
