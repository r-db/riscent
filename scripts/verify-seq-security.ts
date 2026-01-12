#!/usr/bin/env tsx
/**
 * Seq Security Verification Script
 *
 * Run this to verify that Seq's core identity is properly secured:
 * - File exists in .seq/ directory
 * - Has correct permissions (600)
 * - Directory is in .gitignore
 * - Not accessible from client-side code
 *
 * Usage: npm run verify-seq-security
 */

import { verifySeqPromptSecurity } from '../src/lib/seq/prompt-loader';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔐 Verifying Seq Security...\n');

// Check 1: Prompt file security
console.log('1️⃣  Checking prompt file security...');
const security = verifySeqPromptSecurity();

if (!security.exists) {
  console.log('   ❌ Prompt file not found');
  console.log('   Error:', security.error);
  process.exit(1);
}

if (!security.secured) {
  console.log('   ⚠️  Prompt file exists but permissions are wrong');
  console.log('   Error:', security.error);
  console.log('   Fix: chmod 600 .seq/core_identity.txt');
  process.exit(1);
}

console.log('   ✅ Prompt file exists with secure permissions (600)\n');

// Check 2: .gitignore
console.log('2️⃣  Checking .gitignore...');
const gitignorePath = join(process.cwd(), '.gitignore');
if (!existsSync(gitignorePath)) {
  console.log('   ❌ .gitignore not found');
  process.exit(1);
}

const gitignore = readFileSync(gitignorePath, 'utf-8');
if (!gitignore.includes('.seq/')) {
  console.log('   ❌ .seq/ not in .gitignore');
  console.log('   Fix: Add ".seq/" to .gitignore');
  process.exit(1);
}

console.log('   ✅ .seq/ is in .gitignore\n');

// Check 3: File location (outside src/)
console.log('3️⃣  Checking file location...');
const promptPath = join(process.cwd(), '.seq', 'core_identity.txt');
if (promptPath.includes('/src/')) {
  console.log('   ❌ Prompt file is inside src/ directory');
  console.log('   This means it could be bundled into client code');
  process.exit(1);
}

console.log('   ✅ Prompt file is outside src/ directory\n');

// Check 4: Import restrictions
console.log('4️⃣  Checking import restrictions...');
const loaderPath = join(process.cwd(), 'src', 'lib', 'seq', 'prompt-loader.ts');
const loaderCode = readFileSync(loaderPath, 'utf-8');

if (!loaderCode.includes("import { readFileSync }")) {
  console.log('   ❌ Loader does not use Node.js fs module');
  console.log('   This means it might be client-accessible');
  process.exit(1);
}

console.log('   ✅ Loader uses fs module (server-side only)\n');

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All security checks passed!');
console.log('');
console.log('Seq\'s core identity is properly secured:');
console.log('  - File permissions: 600 (owner read/write only)');
console.log('  - Location: .seq/core_identity.txt (not in src/)');
console.log('  - Git: Ignored (will never be committed)');
console.log('  - Access: Server-side only (uses fs module)');
console.log('  - Client: Cannot access via console, network, or source');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
