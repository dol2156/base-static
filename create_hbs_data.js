const path = require('path');
const FileUtil = require('./file_util.js');
const _ = require('lodash');
const hbsFilesPath = './views/partials';
const files = FileUtil.readdirs(hbsFilesPath, '.hbs');

let arr = [];
files.forEach((f, idx) => {
  const path_obj = path.parse(f);
  const {name} = path_obj;
  const arr_dir = path_obj.dir.split('/');
  const folder_name = arr_dir.pop();
  path_obj.folder_name = folder_name;
  path_obj.partial = `${folder_name}/${name}`;
  arr.push(path_obj);
});
arr = _.groupBy(arr, 'folder_name');

const file_txt = `module.exports = ${JSON.stringify(arr)};`;
FileUtil.writeFile('./assets/data/HBS_DATA.js', file_txt);
