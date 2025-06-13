const fs = require("fs");
const path = require("path");

// Configure the source directory to scan
const scanDir = "./src";

function walk(dir, filelist = []) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        filelist = walk(filepath, filelist);
      } else if (/\.(ts|tsx)$/.test(filepath)) {
        filelist.push(filepath);
      }
    });
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }
  return filelist;
}

function checkFile(file) {
  try {
    const content = fs.readFileSync(file, "utf-8");
    const issues = [];

    // Find imports of types not marked with `type`
    const typeImportPattern = /import\s+{([^}]+)}\s+from\s+["'][^"']+["'];/g;
    let match;
    while ((match = typeImportPattern.exec(content)) !== null) {
      const imported = match[1];
      if (/\b[A-Z][A-Za-z0-9]+\b/.test(imported) && !imported.includes(" type ") && !match[0].includes("import type")) {
        issues.push({
          type: "Missing 'type' keyword on interface/type import",
          suggestion: match[0].replace("import", "import type"),
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }

    // Check for ethers.providers usage (might be undefined in some bundlers)
    if (content.includes("ethers.providers")) {
      const lineNumber = content.split('\n').findIndex(line => line.includes("ethers.providers")) + 1;
      issues.push({
        type: "Potential runtime error",
        suggestion: "Use `import { JsonRpcProvider } from 'ethers'` instead of `ethers.providers.JsonRpcProvider`",
        line: lineNumber
      });
    }

    // Check for ethers.utils usage (v6 compatibility)
    if (content.includes("ethers.utils")) {
      const lineNumber = content.split('\n').findIndex(line => line.includes("ethers.utils")) + 1;
      issues.push({
        type: "Ethers.js v6 compatibility issue",
        suggestion: "In ethers v6, utility functions are available directly from ethers: use `ethers.formatEther()` instead of `ethers.utils.formatEther()`",
        line: lineNumber
      });
    }

    // Check for potential undefined access
    const undefinedAccessPatterns = [
      /(\w+)\.(\w+)\?\.(\w+)/g,  // optional chaining after property access
      /(\w+)\.(\w+)\.(\w+)/g     // nested property access
    ];

    undefinedAccessPatterns.forEach(pattern => {
      while ((match = pattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push({
          type: "Potential undefined property access",
          suggestion: `Consider checking if ${match[1]}.${match[2]} is defined before accessing ${match[3]}`,
          line: line
        });
      }
    });

    // Find unused imports
    const importPattern = /import\s+{([^}]+)}\s+from\s+["']([^"']+)["'];/g;
    while ((match = importPattern.exec(content)) !== null) {
      const imports = match[1].split(',').map(i => i.trim().replace(/\s+as\s+\w+/, ''));
      
      imports.forEach(importName => {
        // Ignore import types with the keyword "type"
        if (importName.includes('type ')) return;
        
        // Remove any rename syntax (e.g., "Foo as Bar" -> "Foo")
        const cleanName = importName.split(' as ')[0].trim();
        if (cleanName && !content.includes(cleanName)) {
          issues.push({
            type: "Potentially unused import",
            suggestion: `Remove unused import: ${cleanName}`,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      });
    }

    if (issues.length > 0) {
      console.log(`\n📄 ${file}`);
      issues.forEach((issue) => {
        console.log(`  🔴 Line ${issue.line}: ${issue.type}`);
        console.log(`  💡 Suggestion: ${issue.suggestion}\n`);
      });
    }
  } catch (error) {
    console.error(`Error checking file ${file}:`, error);
  }
}

console.log("🔍 Scanning TypeScript files for import/export/runtime issues...");
const currentDir = process.cwd();
console.log(`Starting scan from directory: ${path.join(currentDir, scanDir)}`);

const files = walk(path.join(currentDir, scanDir));
console.log(`Found ${files.length} TypeScript files to scan.`);

if (files.length > 0) {
  files.forEach(checkFile);
  console.log("\n✅ Scan complete!");
} else {
  console.log("No TypeScript files found in the specified directory.");
}
