import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';

// Config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, 'frontend/src');

type ScanIssue = string;

function scanFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  const issues: ScanIssue[] = [];

  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node) && node.importClause && node.moduleSpecifier) {
      const moduleName = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
      const namedBindings = node.importClause.namedBindings;
      const defaultImport = node.importClause.name;

      const absolutePath = resolveModule(filePath, moduleName);
      if (!absolutePath || !fs.existsSync(absolutePath)) {
        issues.push(`❌ Module not found: ${moduleName}`);
        return;
      }

      const exports = extractExports(absolutePath);
      
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        namedBindings.elements.forEach((element) => {
          const name = element.name.text;
          if (!exports.includes(name)) {
            issues.push(`🚫 ${name} not exported by ${moduleName}`);
          }
        });
      }

      if (defaultImport && !exports.includes('default')) {
        issues.push(`🚫 Default export missing in ${moduleName}`);
      }
    }
  });

  if (issues.length) {
    console.log(`\n🔎 Issues in: ${filePath}`);
    issues.forEach(i => console.log('  ' + i));
  }
}

function walk(dir: string): void {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.tsx?$/.test(file)) {
      scanFile(fullPath);
    }
  }
}

function extractExports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  const exports: string[] = [];

  sourceFile.forEachChild((node) => {
    if (ts.isExportAssignment(node)) {
      exports.push('default');
    } else if (
      ts.isExportDeclaration(node) && 
      node.exportClause &&
      ts.isNamedExports(node.exportClause)
    ) {
      node.exportClause.elements.forEach(e => exports.push(e.name.text));
    } else if (
      (ts.isFunctionDeclaration(node) || 
       ts.isClassDeclaration(node) || 
       ts.isVariableStatement(node) || 
       ts.isInterfaceDeclaration(node) || 
       ts.isTypeAliasDeclaration(node)) &&
      node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (node.name) exports.push(node.name.text);
    }
  });

  return exports;
}

function resolveModule(baseFile: string, modulePath: string): string | null {
  const extensions = ['.ts', '.tsx', '.js'];
  if (modulePath.startsWith('.')) {
    for (const ext of extensions) {
      const candidate = path.resolve(
        path.dirname(baseFile), 
        `${modulePath}${ext}`
      );
      if (fs.existsSync(candidate)) return candidate;
      
      // Check for index files
      const indexCandidate = path.resolve(
        path.dirname(baseFile), 
        modulePath, 
        `index${ext}`
      );
      if (fs.existsSync(indexCandidate)) return indexCandidate;
    }
  }
  
  try {
    return require.resolve(modulePath, { paths: [path.dirname(baseFile)] });
  } catch {
    return null;
  }
}

console.log('🔍 Scanning for broken imports...');
walk(SRC_DIR);
console.log('\n✅ Done.\n');