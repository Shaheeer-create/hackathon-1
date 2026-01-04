#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to copy files from docs to i18n structure
function setupI18nStructure() {
  // Define the source and destination directories
  const sourceDir = path.join(__dirname, '..', 'docs');
  const destDir = path.join(__dirname, '..', 'i18n', 'ur', 'docusaurus-plugin-content-docs', 'current');
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Read all files in the source directory
  const files = getAllFiles(sourceDir);
  
  // Copy Urdu files to the i18n structure
  for (const file of files) {
    if (file.endsWith('.ur.md')) {
      // Extract the base name without the .ur.md extension
      const baseName = path.basename(file, '.ur.md');
      const relativePath = path.relative(sourceDir, file);
      const newRelativePath = relativePath.replace('.ur.md', '.md');
      
      const destPath = path.join(destDir, newRelativePath);
      const destPathDir = path.dirname(destPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPathDir)) {
        fs.mkdirSync(destPathDir, { recursive: true });
      }
      
      // Copy the file
      fs.copyFileSync(file, destPath);
      console.log(`Copied: ${file} -> ${destPath}`);
    }
  }
}

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

// Run the function
setupI18nStructure();