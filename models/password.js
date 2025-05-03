import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();

  return bcryptjs.hash(password, rounds);
}

async function compare(providedPassword, storedPassword) {
  return bcryptjs.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

const password = {
  hash,
  compare,
};

export default password;
