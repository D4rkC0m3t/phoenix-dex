const fs = require("fs");
const path = require("path");

// Configure the source directory to scan
const scanDir = "./src";
// Set to true to actually apply fixes, false to just report what would be fixed
const applyFixes = true;

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

function fixFile(file) {
  try {
    let content = fs.readFileSync(file, "utf-8");
    let originalContent = content;
    const fixesApplied = [];
    
    // Fix 1: Add 'type' keyword to type imports
    content = content.replace(
      /import\s+{([^}]+)}\s+from\s+["']([^"']+)["'];/g,
      (match, imports, source) => {
        // Don't modify if it's already a type import
        if (match.includes("import type")) {
          return match;
        }
        
        const importItems = imports.split(',').map(item => item.trim());
        let hasTypeImport = false;
        
        // Check if any import appears to be a type (starts with uppercase)
        for (const item of importItems) {
          const cleanItem = item.split(' as ')[0].trim();
          if (/^[A-Z]/.test(cleanItem)) {
            hasTypeImport = true;
            break;
          }
        }
        
        if (hasTypeImport) {
          fixesApplied.push({
            type: "Added 'type' keyword to type imports",
            original: match,
            fixed: match.replace("import", "import type")
          });
          return match.replace("import", "import type");
        }
        return match;
      }
    );
    
    // Fix 2: Fix ethers.providers usage
    if (content.includes("ethers.providers.JsonRpcProvider")) {
      // First, make sure JsonRpcProvider is imported directly
      if (!content.includes("import { JsonRpcProvider }") && 
          !content.includes("import {JsonRpcProvider}")) {
        
        // Add the import if it doesn't exist
        if (content.includes("import { ethers }")) {
          content = content.replace(
            /import\s*{\s*ethers\s*}\s*from\s*['"]ethers['"];/,
            "import { ethers, JsonRpcProvider } from 'ethers';"
          );
          
          fixesApplied.push({
            type: "Added JsonRpcProvider import",
            original: "import { ethers } from 'ethers';",
            fixed: "import { ethers, JsonRpcProvider } from 'ethers';"
          });
        } else {
          // If no ethers import exists, add it
          content = "import { JsonRpcProvider } from 'ethers';\n" + content;
          
          fixesApplied.push({
            type: "Added JsonRpcProvider import",
            original: "",
            fixed: "import { JsonRpcProvider } from 'ethers';"
          });
        }
      }
      
      // Now replace all instances of ethers.providers.JsonRpcProvider
      const originalContent2 = content;
      content = content.replace(
        /ethers\.providers\.JsonRpcProvider/g,
        "JsonRpcProvider"
      );
      
      if (originalContent2 !== content) {
        fixesApplied.push({
          type: "Fixed ethers.providers.JsonRpcProvider usage",
          original: "ethers.providers.JsonRpcProvider",
          fixed: "JsonRpcProvider"
        });
      }
    }
    
    // Fix 3: Convert ethers.utils methods to ethers v6 format
    const utilsReplacements = [
      { from: /ethers\.utils\.formatEther/g, to: "ethers.formatEther" },
      { from: /ethers\.utils\.parseEther/g, to: "ethers.parseEther" },
      { from: /ethers\.utils\.formatUnits/g, to: "ethers.formatUnits" },
      { from: /ethers\.utils\.parseUnits/g, to: "ethers.parseUnits" },
      { from: /ethers\.utils\.getAddress/g, to: "ethers.getAddress" },
      { from: /ethers\.utils\.hexlify/g, to: "ethers.hexlify" }
    ];
    
    utilsReplacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        const originalContentUtil = content;
        content = content.replace(from, to);
        
        if (originalContentUtil !== content) {
          fixesApplied.push({
            type: `Converted ethers v5 to v6 utility`,
            original: from.toString().replace(/\//g, ''),
            fixed: to
          });
        }
      }
    });
    
    // Fix 4: Fix ethers.Wallet to use proper import
    if (content.includes("ethers.Wallet") && !content.includes("import { Wallet }") && !content.includes("Wallet as")) {
      // First, add the import if needed
      if (content.includes("import { ethers }")) {
        content = content.replace(
          /import\s*{\s*ethers\s*([^}]*)}\s*from\s*['"]ethers['"];/,
          (match, additionalImports) => {
            const newImports = additionalImports.includes("Wallet") 
              ? additionalImports 
              : additionalImports + ", Wallet as EthersWallet";
            return `import { ethers${newImports} } from 'ethers';`;
          }
        );
        
        fixesApplied.push({
          type: "Added EthersWallet import",
          original: "Using ethers.Wallet without proper import",
          fixed: "Added 'Wallet as EthersWallet' to imports"
        });
      } else {
        // If no ethers import exists, add it
        content = "import { ethers, Wallet as EthersWallet } from 'ethers';\n" + content;
        
        fixesApplied.push({
          type: "Added EthersWallet import",
          original: "",
          fixed: "import { ethers, Wallet as EthersWallet } from 'ethers';"
        });
      }
      
      // Now replace all instances of ethers.Wallet
      const originalContentWallet = content;
      content = content.replace(
        /ethers\.Wallet/g,
        "EthersWallet"
      );
      
      if (originalContentWallet !== content) {
        fixesApplied.push({
          type: "Fixed ethers.Wallet usage",
          original: "ethers.Wallet",
          fixed: "EthersWallet"
        });
      }
    }
    
    // Only write to file if changes were made and applyFixes is true
    if (content !== originalContent && applyFixes) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`\n📄 ${file} - FIXED`);
      fixesApplied.forEach(fix => {
        console.log(`  ✅ ${fix.type}`);
        console.log(`     FROM: ${fix.original}`);
        console.log(`     TO:   ${fix.fixed}\n`);
      });
    } else if (content !== originalContent) {
      console.log(`\n📄 ${file} - WOULD FIX (dry run)`);
      fixesApplied.forEach(fix => {
        console.log(`  🔍 ${fix.type}`);
        console.log(`     FROM: ${fix.original}`);
        console.log(`     TO:   ${fix.fixed}\n`);
      });
    }
  } catch (error) {
    console.error(`Error fixing file ${file}:`, error);
  }
}

// Create a backup of files before modifying
function backupFiles(files) {
  const backupDir = path.join(process.cwd(), 'typescript-fixes-backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  files.forEach(file => {
    try {
      const relativePath = path.relative(process.cwd(), file);
      const backupPath = path.join(backupDir, relativePath);
      
      // Create necessary subdirectories
      const backupFileDir = path.dirname(backupPath);
      if (!fs.existsSync(backupFileDir)) {
        fs.mkdirSync(backupFileDir, { recursive: true });
      }
      
      // Copy the file
      fs.copyFileSync(file, backupPath);
    } catch (error) {
      console.error(`Error creating backup for ${file}:`, error);
    }
  });
  
  console.log(`Created backup of ${files.length} files in: ${backupDir}`);
}

console.log("🔍 Scanning and fixing TypeScript files...");
console.log(`Mode: ${applyFixes ? 'APPLY FIXES' : 'DRY RUN (no changes will be made)'}`);

const currentDir = process.cwd();
console.log(`Starting from directory: ${path.join(currentDir, scanDir)}`);

const files = walk(path.join(currentDir, scanDir));
console.log(`Found ${files.length} TypeScript files to process.`);

if (files.length > 0 && applyFixes) {
  console.log("Creating backups before applying fixes...");
  backupFiles(files);
}

if (files.length > 0) {
  files.forEach(fixFile);
  console.log("\n✅ Process complete!");
  
  if (applyFixes) {
    console.log("All fixes have been applied.");
  } else {
    console.log("This was a dry run. Set applyFixes = true to apply the changes.");
  }
} else {
  console.log("No TypeScript files found in the specified directory.");
}
