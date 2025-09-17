const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

function generateMockUsers(count = 1) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const role = Math.random() < 0.5 ? 'user' : 'admin';
    const password = bcrypt.hashSync('coder123', 10);
    users.push({
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      role,
      pets: [],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    });
  }
  return users;
}

module.exports = { generateMockUsers };
