import { PrismaClient, UserRole, SkillCategory, ProficiencyLevel, HackathonStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  console.log("🧹 Cleaning up existing data...");
  await prisma.sponsorship.deleteMany();
  await prisma.application.deleteMany();
  await prisma.teamInvitation.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.hackathonParticipant.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.organizerProfile.deleteMany();
  await prisma.sponsorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleanup complete");

  // Create password hash for all test users
  const passwordHash = await bcrypt.hash("password123", 10);

  // ============================================================
  // SKILLS - Common hackathon skills
  // ============================================================
  console.log("📚 Creating skills...");
  
  const skillsData = [
    // Frontend
    { name: "React", category: SkillCategory.frontend },
    { name: "Vue.js", category: SkillCategory.frontend },
    { name: "Angular", category: SkillCategory.frontend },
    { name: "Next.js", category: SkillCategory.frontend },
    { name: "TypeScript", category: SkillCategory.frontend },
    { name: "JavaScript", category: SkillCategory.frontend },
    { name: "HTML/CSS", category: SkillCategory.frontend },
    { name: "Tailwind CSS", category: SkillCategory.frontend },
    
    // Backend
    { name: "Node.js", category: SkillCategory.backend },
    { name: "Python", category: SkillCategory.backend },
    { name: "FastAPI", category: SkillCategory.backend },
    { name: "Django", category: SkillCategory.backend },
    { name: "Express.js", category: SkillCategory.backend },
    { name: "PostgreSQL", category: SkillCategory.backend },
    { name: "MongoDB", category: SkillCategory.backend },
    { name: "REST API", category: SkillCategory.backend },
    { name: "GraphQL", category: SkillCategory.backend },
    
    // Mobile
    { name: "React Native", category: SkillCategory.mobile },
    { name: "Flutter", category: SkillCategory.mobile },
    { name: "Swift", category: SkillCategory.mobile },
    { name: "Kotlin", category: SkillCategory.mobile },
    
    // Design
    { name: "UI/UX Design", category: SkillCategory.design },
    { name: "Figma", category: SkillCategory.design },
    { name: "Adobe XD", category: SkillCategory.design },
    { name: "Prototyping", category: SkillCategory.design },
    
    // Data Science
    { name: "Machine Learning", category: SkillCategory.data_science },
    { name: "TensorFlow", category: SkillCategory.data_science },
    { name: "PyTorch", category: SkillCategory.data_science },
    { name: "Data Analysis", category: SkillCategory.data_science },
    
    // DevOps
    { name: "Docker", category: SkillCategory.devops },
    { name: "Kubernetes", category: SkillCategory.devops },
    { name: "CI/CD", category: SkillCategory.devops },
    { name: "AWS", category: SkillCategory.devops },
    
    // Product Management
    { name: "Product Strategy", category: SkillCategory.product_management },
    { name: "User Research", category: SkillCategory.product_management },
    { name: "Agile/Scrum", category: SkillCategory.product_management },
  ];

  const skills = await Promise.all(
    skillsData.map(skill => prisma.skill.create({ data: skill }))
  );

  console.log(`✅ Created ${skills.length} skills`);

  // ============================================================
  // USERS - Students, Organizers, Sponsors
  // ============================================================
  console.log("👥 Creating users...");

  // Students
  const student1 = await prisma.user.create({
    data: {
      email: "alice.student@university.edu",
      username: "alice_dev",
      fullName: "Alice Johnson",
      passwordHash,
      role: UserRole.student,
      bio: "Full-stack developer passionate about AI and web technologies",
      githubUrl: "https://github.com/alicedev",
      linkedinUrl: "https://linkedin.com/in/alicedev",
      studentProfile: {
        create: {
          university: "Tech University",
          degree: "Computer Science",
          graduationYear: 2025,
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "bob.designer@university.edu",
      username: "bob_designs",
      fullName: "Bob Smith",
      passwordHash,
      role: UserRole.student,
      bio: "UI/UX designer with a passion for creating beautiful interfaces",
      githubUrl: "https://github.com/bobdesigns",
      portfolioUrl: "https://bobdesigns.com",
      studentProfile: {
        create: {
          university: "Design Institute",
          degree: "Interactive Media Design",
          graduationYear: 2026,
        },
      },
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "charlie.ml@university.edu",
      username: "charlie_ml",
      fullName: "Charlie Chen",
      passwordHash,
      role: UserRole.student,
      bio: "Machine Learning enthusiast exploring AI applications",
      githubUrl: "https://github.com/charlieml",
      studentProfile: {
        create: {
          university: "Tech University",
          degree: "Data Science",
          graduationYear: 2025,
        },
      },
    },
  });

  const student4 = await prisma.user.create({
    data: {
      email: "diana.mobile@university.edu",
      username: "diana_apps",
      fullName: "Diana Rodriguez",
      passwordHash,
      role: UserRole.student,
      bio: "Mobile developer specializing in cross-platform apps",
      githubUrl: "https://github.com/dianaapps",
      studentProfile: {
        create: {
          university: "Mobile Dev Academy",
          degree: "Software Engineering",
          graduationYear: 2024,
        },
      },
    },
  });

  // Organizers
  const organizer1 = await prisma.user.create({
    data: {
      email: "organizer@takathon.com",
      username: "takathon_org",
      fullName: "Emma Wilson",
      passwordHash,
      role: UserRole.organizer,
      bio: "Passionate about bringing students together to build amazing projects",
      organizerProfile: {
        create: {
          organizationName: "TAkathon",
          position: "Head Organizer",
        },
      },
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      email: "tech.events@techcorp.com",
      username: "techcorp_events",
      fullName: "Frank Martinez",
      passwordHash,
      role: UserRole.organizer,
      organizerProfile: {
        create: {
          organizationName: "TechCorp Events",
          position: "Event Manager",
        },
      },
    },
  });

  // Sponsors
  const sponsor1 = await prisma.user.create({
    data: {
      email: "partnerships@techgiant.com",
      username: "techgiant_sponsor",
      fullName: "Grace Lee",
      passwordHash,
      role: UserRole.sponsor,
      bio: "Supporting the next generation of innovators",
      sponsorProfile: {
        create: {
          companyName: "TechGiant Inc",
          industry: "Software",
          websiteUrl: "https://techgiant.com",
          logoUrl: "https://techgiant.com/logo.png",
        },
      },
    },
  });

  const sponsor2 = await prisma.user.create({
    data: {
      email: "community@startupco.io",
      username: "startupco_sponsor",
      fullName: "Henry Park",
      passwordHash,
      role: UserRole.sponsor,
      sponsorProfile: {
        create: {
          companyName: "StartupCo",
          industry: "Technology",
          websiteUrl: "https://startupco.io",
        },
      },
    },
  });

  console.log(`✅ Created 8 users (4 students, 2 organizers, 2 sponsors)`);

  // ============================================================
  // USER SKILLS - Assign skills to students
  // ============================================================
  console.log("🎯 Assigning skills to students...");

  // Alice - Full-stack developer
  await prisma.userSkill.createMany({
    data: [
      { userId: student1.id, skillId: skills.find(s => s.name === "React")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 3 },
      { userId: student1.id, skillId: skills.find(s => s.name === "Node.js")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 2 },
      { userId: student1.id, skillId: skills.find(s => s.name === "TypeScript")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 2 },
      { userId: student1.id, skillId: skills.find(s => s.name === "PostgreSQL")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 1 },
    ],
  });

  // Bob - Designer
  await prisma.userSkill.createMany({
    data: [
      { userId: student2.id, skillId: skills.find(s => s.name === "UI/UX Design")!.id, proficiencyLevel: ProficiencyLevel.expert, yearsOfExperience: 4 },
      { userId: student2.id, skillId: skills.find(s => s.name === "Figma")!.id, proficiencyLevel: ProficiencyLevel.expert, yearsOfExperience: 3 },
      { userId: student2.id, skillId: skills.find(s => s.name === "Prototyping")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 3 },
      { userId: student2.id, skillId: skills.find(s => s.name === "HTML/CSS")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 2 },
    ],
  });

  // Charlie - ML enthusiast
  await prisma.userSkill.createMany({
    data: [
      { userId: student3.id, skillId: skills.find(s => s.name === "Python")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 3 },
      { userId: student3.id, skillId: skills.find(s => s.name === "Machine Learning")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 2 },
      { userId: student3.id, skillId: skills.find(s => s.name === "TensorFlow")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 1 },
      { userId: student3.id, skillId: skills.find(s => s.name === "Data Analysis")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 2 },
    ],
  });

  // Diana - Mobile developer
  await prisma.userSkill.createMany({
    data: [
      { userId: student4.id, skillId: skills.find(s => s.name === "React Native")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 2 },
      { userId: student4.id, skillId: skills.find(s => s.name === "Flutter")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 1 },
      { userId: student4.id, skillId: skills.find(s => s.name === "TypeScript")!.id, proficiencyLevel: ProficiencyLevel.intermediate, yearsOfExperience: 2 },
      { userId: student4.id, skillId: skills.find(s => s.name === "JavaScript")!.id, proficiencyLevel: ProficiencyLevel.advanced, yearsOfExperience: 3 },
    ],
  });

  console.log("✅ Assigned skills to students");

  // ============================================================
  // HACKATHONS
  // ============================================================
  console.log("🎓 Creating hackathons...");

  const hackathon1 = await prisma.hackathon.create({
    data: {
      title: "TAkathon Spring 2026",
      description: "The ultimate student hackathon! Build innovative solutions to real-world problems. Meet fellow students, learn new technologies, and compete for amazing prizes.",
      organizerId: organizer1.id,
      status: HackathonStatus.registration_open,
      startDate: new Date("2026-04-15T09:00:00Z"),
      endDate: new Date("2026-04-17T18:00:00Z"),
      registrationDeadline: new Date("2026-04-10T23:59:59Z"),
      location: "Tech University Campus",
      isVirtual: false,
      maxParticipants: 200,
      maxTeamSize: 5,
      minTeamSize: 2,
      prizePool: "$15,000 in prizes and swag",
      bannerUrl: "https://takathon.com/spring2026-banner.jpg",
      websiteUrl: "https://takathon.com/spring2026",
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      title: "AI Innovation Challenge",
      description: "Focus on AI and machine learning projects. Build intelligent applications that solve problems in healthcare, education, or sustainability.",
      organizerId: organizer2.id,
      status: HackathonStatus.registration_open,
      startDate: new Date("2026-05-20T10:00:00Z"),
      endDate: new Date("2026-05-22T16:00:00Z"),
      registrationDeadline: new Date("2026-05-15T23:59:59Z"),
      location: "Virtual",
      isVirtual: true,
      maxParticipants: 500,
      maxTeamSize: 4,
      minTeamSize: 1,
      prizePool: "$25,000 + AWS Credits",
    },
  });

  console.log(`✅ Created 2 hackathons`);

  // ============================================================
  // HACKATHON PARTICIPANTS
  // ============================================================
  console.log("📝 Registering participants...");

  await prisma.hackathonParticipant.createMany({
    data: [
      { hackathonId: hackathon1.id, userId: student1.id, status: "registered" },
      { hackathonId: hackathon1.id, userId: student2.id, status: "registered" },
      { hackathonId: hackathon1.id, userId: student3.id, status: "registered" },
      { hackathonId: hackathon1.id, userId: student4.id, status: "registered" },
      { hackathonId: hackathon2.id, userId: student1.id, status: "registered" },
      { hackathonId: hackathon2.id, userId: student3.id, status: "registered" },
    ],
  });

  console.log("✅ Registered participants to hackathons");

  // ============================================================
  // TEAMS
  // ============================================================
  console.log("🤝 Creating teams...");

  const team1 = await prisma.team.create({
    data: {
      name: "Code Wizards",
      hackathonId: hackathon1.id,
      creatorId: student1.id,
      description: "Building a full-stack web application to help students find study groups",
      status: "forming",
      maxSize: 4,
      currentSize: 2,
      isPublic: true,
      projectIdea: "A platform that uses AI to match students with compatible study partners based on their courses, learning styles, and schedules.",
    },
  });

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, userId: student1.id, role: "captain" },
      { teamId: team1.id, userId: student2.id, role: "member" },
    ],
  });

  console.log(`✅ Created 1 team with 2 members`);

  // ============================================================
  // SPONSORSHIPS
  // ============================================================
  console.log("💰 Creating sponsorships...");

  await prisma.sponsorship.createMany({
    data: [
      {
        sponsorId: sponsor1.id,
        hackathonId: hackathon1.id,
        tier: "gold",
        amount: 5000.00,
        status: "approved",
      },
      {
        sponsorId: sponsor2.id,
        hackathonId: hackathon2.id,
        tier: "platinum",
        amount: 10000.00,
        status: "approved",
      },
    ],
  });

  console.log("✅ Created 2 sponsorships");

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n");
  console.log("🎉 Database seeded successfully!");
  console.log("=====================================");
  console.log("📊 Summary:");
  console.log(`  - ${skills.length} skills`);
  console.log(`  - 8 users (4 students, 2 organizers, 2 sponsors)`);
  console.log(`  - 16 user-skill assignments`);
  console.log(`  - 2 hackathons`);
  console.log(`  - 6 hackathon participants`);
  console.log(`  - 1 team with 2 members`);
  console.log(`  - 2 sponsorships`);
  console.log("\n");
  console.log("🔐 Test Credentials:");
  console.log("  Email: alice.student@university.edu");
  console.log("  Password: password123");
  console.log("  (All test users have the same password)");
  console.log("=====================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

