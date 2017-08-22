const toJsonOptions = {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id; //eslint-disable-line
    delete ret.__v; //eslint-disable-line
    return ret;
  }
};

module.exports = { toJsonOptions };
