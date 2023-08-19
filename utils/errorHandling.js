class NewError extends Error {
  constructor(name, message) {
    super("");
    this.name = name;
    this.stack = message;
  }
}

module.exports = NewError;
