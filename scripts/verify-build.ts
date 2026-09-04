/**
 * Production Pre-flight Verification Script
 * Validates essential paths, schemas, and assets prior to deployment
 * Run with: npx tsx scripts/verify-build.ts
 */
import fs from "fs";
import path from "path";

function main() {
  console.log("🚀 Running production pre-flight checks...");

  const requiredFiles = [
    "prisma/schema.prisma",
    "app/page.tsx",
    "app/recover/[id]/page.tsx",
    "app/lib/prisma.ts",
    "app/lib/notifications.ts",
    "app/lib/gemini.ts",
  ];

  let hasErrors = false;

  for (const file of requiredFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing essential file: ${file}`);
      hasErrors = true;
    } else {
      console.log(`✓ Verified file presence: ${file}`);
    }
  }

  if (hasErrors) {
    console.error("❌ Pre-flight checks failed!");
    process.exit(1);
  }

  console.log("✅ All production pre-flight checks passed successfully!");
}

if (require.main === module) {
  main();
}
