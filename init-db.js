const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sqlStatements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  
  `CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT PRIMARY KEY,
    "sequenceNumber" INTEGER NOT NULL DEFAULT 0,
    "title_en" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "category_en" TEXT NOT NULL,
    "category_ar" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "challenge_en" TEXT NOT NULL,
    "challenge_ar" TEXT NOT NULL,
    "solution_en" TEXT NOT NULL,
    "solution_ar" TEXT NOT NULL,
    "technologies" TEXT[] NOT NULL,
    "coverImage" TEXT NOT NULL,
    "galleryImages" TEXT[] NOT NULL,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS "Skill" (
    "id" TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS "Experience" (
    "id" TEXT PRIMARY KEY,
    "company_en" TEXT NOT NULL,
    "company_ar" TEXT NOT NULL,
    "role_en" TEXT NOT NULL,
    "role_ar" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false
  );`,

  `CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "review_en" TEXT NOT NULL,
    "review_ar" TEXT NOT NULL,
    "avatar" TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" TEXT PRIMARY KEY DEFAULT 'default',
    "fullName" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "bio_en" TEXT NOT NULL,
    "bio_ar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "x" TEXT,
    "profileImage" TEXT,
    "resumeFile" TEXT
  );`
];

async function main() {
  console.log('Initializing database tables directly via Raw SQL...');
  for (let i = 0; i < sqlStatements.length; i++) {
    console.log(`Executing query ${i + 1}/${sqlStatements.length}...`);
    await prisma.$executeRawUnsafe(sqlStatements[i]);
  }
  console.log('Database tables successfully initialized!');
}

main()
  .catch(err => {
    console.error('Direct DB Initialization Error:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
