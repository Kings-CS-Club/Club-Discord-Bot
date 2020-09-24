module.exports = (dir, callback, root = path.join(__dirname, '..')) => {
  if(!fs.existsSync(`${dir}/`)) throw new Error(`Directory [${dir}] not found from [${root}]`);
  const directory = fs.readdirSync(path.join(root, dir));
  directory.forEach(callback);
};