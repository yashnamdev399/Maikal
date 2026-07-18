// Generates a unique application number: MPSEDC-YYYYMMDD-XXXXX
const generateAppNumber = () => {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `MPSEDC-${datePart}-${rand}`;
};

module.exports = { generateAppNumber };
