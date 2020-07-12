const { resolve } = require('path');

const fs = require('fs').promises;

const getFiles = async (path) => {
  const directoryEntries = await fs.readdir(path, { withFileTypes: true});
  
  const files = await Promise.all(directoryEntries.map(directoryEntry => {
    const resolvedPath = resolve(path, directoryEntry.name);
    return directoryEntry.isDirectory() ? getFiles(resolvedPath) : resolvedPath
  }));
  
  return files.flat();
}

const getFilesToCheck = async (path, extensions) => {
  const files = await getFiles(path);
  const filtered = files.filter(file => {
    return extensions.some(extension => file.endsWith(extension));
  })

  return filtered;
}

const sourcePath = "c:\\src\\blog\\content";
const extensions = ["md"];
(async () => {
  const filesToCheck = await getFilesToCheck(sourcePath, extensions);
  console.log(filesToCheck)
}
)();