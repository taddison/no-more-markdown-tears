const { resolve } = require("path");
const fs = require("fs").promises;
const matter = require("gray-matter");

const getFiles = async (path) => {
  const directoryEntries = await fs.readdir(path, { withFileTypes: true });

  const files = await Promise.all(
    directoryEntries.map((directoryEntry) => {
      const resolvedPath = resolve(path, directoryEntry.name);
      return directoryEntry.isDirectory()
        ? getFiles(resolvedPath)
        : resolvedPath;
    })
  );

  return files.flat();
};

const getFilesToCheck = async (path, extensions) => {
  const files = await getFiles(path);
  const filtered = files.filter((file) => {
    return extensions.some((extension) => file.endsWith(extension));
  });

  return filtered;
};

const getFileContents = async (path) => {
  return await fs.readFile(path, 'utf-8');
};

const checkFrontMatter = (filePath, data) => {
  const parsed = matter(data);
  if(Object.entries(parsed.data).length === 0) {
    console.warn(`WARN: File ${filePath} has no frontmatter`);
    return;
  }
  
  if(!parsed.data.title) {
    console.warn(`WARN: File ${filePath} has no title`);
  }
}

const sourcePath = "c:\\src\\blog\\content\\blog";
const extensions = ["md"];
(async () => {
  const filesToCheck = await getFilesToCheck(sourcePath, extensions);
  for (const file of filesToCheck) {
    const fileContents = await getFileContents(file);
    checkFrontMatter(file, fileContents);
  }
})();
