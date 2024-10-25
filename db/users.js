const prisma = require('./prismaClient');

const saveNewUser = async (user) => {
  return prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
    }
  })
}

const getUserByEmail =  (email) => {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  })
}

module.exports = {
  saveNewUser,
  getUserByEmail
}