module.exports = {
  hideKey: room => {
    const { _doc } = room;
    const { key, updatedAt, __v, ...onlyReadValeus } = _doc;
    return onlyReadValeus;
  },

  hideKeyAndGame: room => {
    const { _doc } = room;
    const { key, game, updatedAt, __v, ...onlyReadValeus } = _doc;
    return onlyReadValeus;
  }
};
