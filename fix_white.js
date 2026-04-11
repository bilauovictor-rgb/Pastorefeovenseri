import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/\btext-white\b/g, 'text-text-on-dark-primary');
    content = content.replace(/\btext-white\/10\b/g, 'text-text-on-dark-primary/10');
    content = content.replace(/\bbg-white\/5\b/g, 'bg-black/5');
    content = content.replace(/\bbg-white\/10\b/g, 'bg-black/10');
    content = content.replace(/\bborder-white\/10\b/g, 'border-black/10');
    content = content.replace(/\bborder-white\/20\b/g, 'border-black/20');
    content = content.replace(/\bshadow-\[0_0_15px_rgba\(45,27,105,0\.5\)\]\b/g, 'shadow-sm');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
