module.exports = (args, start = 0) => {
  let sliced = args.slice(start, args.length);
  return sliced.join(config.seperator);
};