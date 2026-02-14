import { PrismaClient, UserRole, SkillCategory, ProficiencyLevel, TeamRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Clean up ──────────────────────────────────────────────
  console.log("  Cleaning existing data...");
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

  const passwordHash = await bcrypt.hash("password123", 10);

  // ── Skills ────────────────────────────────────────────────
  console.log("  Creating skills...");
  const skillsData = [
    // Frontend
    { name: "React", category: SkillCategory.frontend, description: "React.js library for building user interfaces" },
    { name: "Next.js", category: SkillCategory.frontend, description: "React framework for production applications" },
    { name: "Vue.js", category: SkillCategory.frontend, description: "Progressive JavaScript framework" },
    { name: "Angular", category: SkillCategory.frontend, description: "Platform for building web applications" },
    { name: "Tailwind CSS", category: SkillCategory.frontend, description: "Utility-first CSS framework" },
    { name: "TypeScript", category: SkillCategory.frontend, description: "Typed superset of JavaScript" },
    // Backend
    { name: "Node.js", category: SkillCategory.backend, description: "JavaScript runtime for server-side development" },
    { name: "Express", category: SkillCategory.backend, description: "Minimal Node.js web framework" },
    { name: "Python", category: SkillCategory.backend, description: "General-purpose programming language" },
    { name: "FastAPI", category: SkillCategory.backend, description: "Modern Python web framework" },
    { name: "Django", category: SkillCategory.backend, description: "Python web framework" },
    { name: "Go", category: SkillCategory.backend, description: "Statically typed compiled language by Google" },
    { name: "Java", category: SkillCategory.backend, description: "Object-oriented programming language" },
    { name: "Spring Boot", category: SkillCategory.backend, description: "Java framework for microservices" },
    // Database
    { name: "PostgreSQL", category: SkillCategory.database, description: "Advanced open-source relational database" },
    { name: "MongoDB", category: SkillCategory.database, description: "NoSQL document database" },
    { name: "Redis", category: SkillCategory.database, description: "In-memory data structure store" },
    { name: "Prisma", category: SkillCategory.database, description: "Next-generation ORM for Node.js and TypeScript" },
    // DevOps
    { name: "Docker", category: SkillCategory.devops, description: "Container platform for application deployment" },
    { name: "Kubernetes", category: SkillCategory.devops, description: "Container orchestration platform" },
    { name: "AWS", category: SkillCategory.devops, description: "Amazon Web Services cloud platform" },
    { name: "CI/CD", category: SkillCategory.devops, description: "Continuous integration and delivery pipelines" },
    { name: "Git", category: SkillCategory.devops, description: "Distributed version control system" },
    // Design
    { name: "Figma", category: SkillCategory.design, description: "Collaborative interface design tool" },
    { name: "UI/UX Design", category: SkillCategory.design, description: "User interface and experience design" },
    // AI/ML
    { name: "Machine Learning", category: SkillCategory.data_science, description: "Building predictive models" },
    { name: "TensorFlow", category: SkillCategory.data_science, description: "Open-source ML framework" },
    { name: "PyTorch", category: SkillCategory.data_science, description: "Open-source ML framework by Meta" },
    { name: "Data Analysis", category: SkillCategory.data_science, description: "Analyzing and interpreting data" },
    // Mobile
    { name: "React Native", category: SkillCategory.mobile, description: "Cross-platform mobile framework" },
    { name: "Flutter", category: SkillCategory.mobile, description: "Google's UI toolkit for mobile" },
    { name: "Swift", category: SkillCategory.mobile, description: "Apple's programming language for iOS" },
    // Other
    { name: "GraphQL", category: SkillCategory.other, description: "Query language for APIs" },
    { name: "WebSockets", category: SkillCategory.other, description: "Full-duplex communication protocol" },
    { name: "Blockchain", category: SkillCategory.other, description: "Distributed ledger technology" },
  ];

  const skills = await Promise.all(
    skillsData.map((s) => prisma.skill.create({ data: s })),
  );
  const skillMap = Object.fromEntries(skills.map((s) => [s.name, s]));
  console.log(`  ✓ Created ${skills.length} skills\n`);

  // ── Students ──────────────────────────────────────────────
  console.log("  Creating students...");
  const studentsData = [
    {
      email: "alice@example.com", username: "alice_dev", fullName: "Alice Chen",
      bio: "Full-stack developer passionate about AI and web technologies",
      githubUrl: "https://github.com/alicechen", linkedinUrl: "https://linkedin.com/in/alicechen",
      profile: { university: "MIT", degree: "Computer Science", graduationYear: 2026 },
      skills: [
        { skill: "React", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "TypeScript", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "Node.js", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "PostgreSQL", level: ProficiencyLevel.intermediate, years: 1 },
        { skill: "Docker", level: ProficiencyLevel.beginner, years: 1 },
      ],
    },
    {
      email: "bob@example.com", username: "bob_ml", fullName: "Bob Martinez",
      bio: "ML enthusiast and backend developer",
      githubUrl: "https://github.com/bobmartinez",
      profile: { university: "Stanford", degree: "Machine Learning", graduationYear: 2025 },
      skills: [
        { skill: "Python", level: ProficiencyLevel.expert, years: 5 },
        { skill: "TensorFlow", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "FastAPI", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "PostgreSQL", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "Docker", level: ProficiencyLevel.intermediate, years: 2 },
      ],
    },
    {
      email: "carol@example.com", username: "carol_ux", fullName: "Carol Johnson",
      bio: "UI/UX designer who codes – bridging design and development",
      portfolioUrl: "https://caroljohnson.design",
      profile: { university: "RISD", degree: "Interaction Design", graduationYear: 2026 },
      skills: [
        { skill: "Figma", level: ProficiencyLevel.expert, years: 4 },
        { skill: "UI/UX Design", level: ProficiencyLevel.expert, years: 4 },
        { skill: "React", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "Tailwind CSS", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "Next.js", level: ProficiencyLevel.beginner, years: 1 },
      ],
    },
    {
      email: "david@example.com", username: "david_backend", fullName: "David Kim",
      bio: "Backend engineer and cloud infrastructure enthusiast",
      githubUrl: "https://github.com/davidkim",
      profile: { university: "Georgia Tech", degree: "Software Engineering", graduationYear: 2025 },
      skills: [
        { skill: "Go", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "Kubernetes", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "AWS", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "PostgreSQL", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "Redis", level: ProficiencyLevel.intermediate, years: 1 },
      ],
    },
    {
      email: "emma@example.com", username: "emma_fs", fullName: "Emma Wilson",
      bio: "Full-stack developer with a passion for open source",
      githubUrl: "https://github.com/emmawilson",
      profile: { university: "UC Berkeley", degree: "EECS", graduationYear: 2026 },
      skills: [
        { skill: "React", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "Node.js", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "TypeScript", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "MongoDB", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "GraphQL", level: ProficiencyLevel.intermediate, years: 1 },
      ],
    },
    {
      email: "frank@example.com", username: "frank_mobile", fullName: "Frank Nguyen",
      bio: "Mobile developer building cross-platform apps",
      profile: { university: "CMU", degree: "Computer Science", graduationYear: 2027 },
      skills: [
        { skill: "React Native", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "Flutter", level: ProficiencyLevel.intermediate, years: 1 },
        { skill: "TypeScript", level: ProficiencyLevel.intermediate, years: 2 },
      ],
    },
    {
      email: "grace@example.com", username: "grace_data", fullName: "Grace Lee",
      bio: "Data scientist exploring NLP and computer vision",
      githubUrl: "https://github.com/gracelee",
      profile: { university: "Caltech", degree: "Data Science", graduationYear: 2025 },
      skills: [
        { skill: "Python", level: ProficiencyLevel.expert, years: 4 },
        { skill: "PyTorch", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "Data Analysis", level: ProficiencyLevel.expert, years: 4 },
        { skill: "Machine Learning", level: ProficiencyLevel.advanced, years: 3 },
      ],
    },
    {
      email: "henry@example.com", username: "henry_sec", fullName: "Henry Park",
      bio: "Security-minded backend developer",
      profile: { university: "Purdue", degree: "Cybersecurity", graduationYear: 2026 },
      skills: [
        { skill: "Java", level: ProficiencyLevel.advanced, years: 3 },
        { skill: "Spring Boot", level: ProficiencyLevel.advanced, years: 2 },
        { skill: "Docker", level: ProficiencyLevel.intermediate, years: 2 },
        { skill: "AWS", level: ProficiencyLevel.intermediate, years: 1 },
        { skill: "CI/CD", level: ProficiencyLevel.intermediate, years: 1 },
      ],
    },
  ];

  const students: any[] = [];
  for (const s of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        username: s.username,
        fullName: s.fullName,
        passwordHash,
        role: UserRole.student,
        bio: s.bio,
        githubUrl: s.githubUrl,
        linkedinUrl: s.linkedinUrl,
        portfolioUrl: s.portfolioUrl,
        studentProfile: {
          create: s.profile,
        },
      },
    });

    // Assign skills
    for (const sk of s.skills) {
      const skillRecord = skillMap[sk.skill];
      if (skillRecord) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skillRecord.id,
            proficiencyLevel: sk.level,
            yearsOfExperience: sk.years,
          },
        });
      }
    }
    students.push(user);
  }
  console.log(`  ✓ Created ${students.length} students\n`);

  // ── Organizers ────────────────────────────────────────────
  console.log("  Creating organizers...");
  const organizersData = [
    {
      email: "organizer1@example.com", username: "org_innovate", fullName: "Sarah Thompson",
      bio: "Passionate about building developer communities",
      organization: "InnovateHub",
      profile: { organizationName: "InnovateHub", position: "CEO" },
    },
    {
      email: "organizer2@example.com", username: "org_techfest", fullName: "James Rodriguez",
      bio: "Running hackathons since 2018",
      organization: "TechFest Global",
      profile: { organizationName: "TechFest Global", position: "Event Director" },
    },
  ];

  const organizers: any[] = [];
  for (const o of organizersData) {
    const user = await prisma.user.create({
      data: {
        email: o.email,
        username: o.username,
        fullName: o.fullName,
        passwordHash,
        role: UserRole.organizer,
        bio: o.bio,
        organization: o.organization,
        organizerProfile: { create: o.profile },
      },
    });
    organizers.push(user);
  }
  console.log(`  ✓ Created ${organizers.length} organizers\n`);

  // ── Sponsors ──────────────────────────────────────────────
  console.log("  Creating sponsors...");
  const sponsorsData = [
    {
      email: "sponsor1@example.com", username: "sp_acmetech", fullName: "Lisa Wang",
      bio: "VP of Developer Relations at AcmeTech",
      organization: "AcmeTech",
      profile: { companyName: "AcmeTech", industry: "Cloud Computing", websiteUrl: "https://acmetech.com" },
    },
    {
      email: "sponsor2@example.com", username: "sp_dataflow", fullName: "Michael Brown",
      bio: "Talent acquisition lead at DataFlow Inc",
      organization: "DataFlow Inc",
      profile: { companyName: "DataFlow Inc", industry: "Data Analytics", websiteUrl: "https://dataflow.io" },
    },
  ];

  const sponsors: any[] = [];
  for (const sp of sponsorsData) {
    const user = await prisma.user.create({
      data: {
        email: sp.email,
        username: sp.username,
        fullName: sp.fullName,
        passwordHash,
        role: UserRole.sponsor,
        bio: sp.bio,
        organization: sp.organization,
        sponsorProfile: { create: sp.profile },
      },
    });
    sponsors.push(user);
  }
  console.log(`  ✓ Created ${sponsors.length} sponsors\n`);

  // ── Hackathons ────────────────────────────────────────────
  console.log("  Creating hackathons...");

  const hackathon1 = await prisma.hackathon.create({
    data: {
      title: "TAkathon 2026",
      description:
        "The premier hackathon for building innovative team-formation tools. Join 500+ students in a 48-hour virtual event with $50k in prizes. Build solutions that reshape how hackathon teams come together.",
      organizerId: organizers[0].id,
      status: "registration_open",
      startDate: new Date("2026-06-15T09:00:00Z"),
      endDate: new Date("2026-06-17T18:00:00Z"),
      registrationDeadline: new Date("2026-06-01T23:59:59Z"),
      location: "Virtual",
      isVirtual: true,
      maxParticipants: 500,
      maxTeamSize: 5,
      minTeamSize: 2,
      requiredSkills: ["React", "Python", "Machine Learning"],
      prizePool: "$50,000",
      rules: "Teams of 2-5. Must submit a working demo. All code written during the event.",
      bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      title: "AI for Good Hackathon",
      description:
        "A 72-hour hackathon focused on building AI solutions for social impact. Healthcare, education, sustainability – pick a challenge and build something meaningful.",
      organizerId: organizers[0].id,
      status: "registration_open",
      startDate: new Date("2026-07-20T08:00:00Z"),
      endDate: new Date("2026-07-23T20:00:00Z"),
      registrationDeadline: new Date("2026-07-10T23:59:59Z"),
      location: "San Francisco, CA",
      isVirtual: false,
      maxParticipants: 200,
      maxTeamSize: 4,
      minTeamSize: 2,
      requiredSkills: ["Python", "TensorFlow", "Data Analysis"],
      prizePool: "$25,000",
      rules: "Teams of 2-4. Projects must address a real-world social impact problem.",
    },
  });

  const hackathon3 = await prisma.hackathon.create({
    data: {
      title: "Web3 Builders Sprint",
      description: "A weekend sprint for building decentralized applications. Smart contracts, DeFi, NFTs – explore the future of the web.",
      organizerId: organizers[1].id,
      status: "draft",
      startDate: new Date("2026-09-10T09:00:00Z"),
      endDate: new Date("2026-09-12T18:00:00Z"),
      registrationDeadline: new Date("2026-08-30T23:59:59Z"),
      location: "Virtual",
      isVirtual: true,
      maxParticipants: 300,
      maxTeamSize: 5,
      minTeamSize: 2,
      requiredSkills: ["Blockchain", "TypeScript"],
      prizePool: "$30,000",
    },
  });

  const hackathon4 = await prisma.hackathon.create({
    data: {
      title: "CloudNative Hack 2025",
      description: "Build cloud-native applications using containers, microservices, and serverless. Past event with completed results.",
      organizerId: organizers[1].id,
      status: "completed",
      startDate: new Date("2025-03-01T09:00:00Z"),
      endDate: new Date("2025-03-03T18:00:00Z"),
      registrationDeadline: new Date("2025-02-20T23:59:59Z"),
      location: "New York, NY",
      isVirtual: false,
      maxParticipants: 150,
      maxTeamSize: 4,
      minTeamSize: 2,
      requiredSkills: ["Docker", "Kubernetes", "AWS"],
      prizePool: "$15,000",
    },
  });

  console.log("  ✓ Created 4 hackathons\n");

  // ── Register students for hackathons ──────────────────────
  console.log("  Registering participants...");

  // All 8 students register for hackathon1
  for (const student of students) {
    await prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathon1.id,
        userId: student.id,
        status: "registered",
      },
    });
  }

  // First 5 students register for hackathon2
  for (let i = 0; i < 5; i++) {
    await prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathon2.id,
        userId: students[i].id,
        status: "registered",
      },
    });
  }

  // 3 students in completed hackathon4
  for (let i = 0; i < 3; i++) {
    await prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathon4.id,
        userId: students[i].id,
        status: "in_team",
      },
    });
  }

  console.log("  ✓ Registered participants\n");

  // ── Teams ─────────────────────────────────────────────────
  console.log("  Creating teams...");

  // Team 1: Alice's team in hackathon1
  const team1 = await prisma.team.create({
    data: {
      name: "Neural Navigators",
      hackathonId: hackathon1.id,
      creatorId: students[0].id, // Alice
      description: "Building an AI-powered team matching platform using NLP and skill embeddings",
      status: "forming",
      maxSize: 5,
      currentSize: 3,
      isPublic: true,
      projectIdea: "An intelligent matching system that uses skill embeddings and project preference analysis to form optimal hackathon teams",
    },
  });

  // Team members
  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, userId: students[0].id, role: TeamRole.captain },   // Alice
      { teamId: team1.id, userId: students[1].id, role: TeamRole.member },    // Bob
      { teamId: team1.id, userId: students[2].id, role: TeamRole.member },    // Carol
    ],
  });

  // Update participants to in_team
  for (const sid of [students[0].id, students[1].id, students[2].id]) {
    await prisma.hackathonParticipant.updateMany({
      where: { hackathonId: hackathon1.id, userId: sid },
      data: { status: "in_team", teamId: team1.id },
    });
  }

  // Team 2: David's team in hackathon1
  const team2 = await prisma.team.create({
    data: {
      name: "Cloud Crusaders",
      hackathonId: hackathon1.id,
      creatorId: students[3].id, // David
      description: "Infrastructure automation for hackathon deployments",
      status: "forming",
      maxSize: 4,
      currentSize: 2,
      isPublic: true,
      projectIdea: "One-click deployment platform that gives hackathon teams instant CI/CD pipelines and cloud hosting",
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team2.id, userId: students[3].id, role: TeamRole.captain },   // David
      { teamId: team2.id, userId: students[7].id, role: TeamRole.member },    // Henry
    ],
  });

  for (const sid of [students[3].id, students[7].id]) {
    await prisma.hackathonParticipant.updateMany({
      where: { hackathonId: hackathon1.id, userId: sid },
      data: { status: "in_team", teamId: team2.id },
    });
  }

  // Team 3: Completed hackathon team
  const team3 = await prisma.team.create({
    data: {
      name: "Serverless Squad",
      hackathonId: hackathon4.id,
      creatorId: students[0].id,
      description: "Built a serverless event processing pipeline",
      status: "submitted",
      maxSize: 4,
      currentSize: 3,
      projectIdea: "Real-time event processing pipeline using AWS Lambda and SQS for hackathon submission analytics",
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team3.id, userId: students[0].id, role: TeamRole.captain },
      { teamId: team3.id, userId: students[1].id, role: TeamRole.member },
      { teamId: team3.id, userId: students[2].id, role: TeamRole.member },
    ],
  });

  console.log("  ✓ Created 3 teams\n");

  // ── Team Invitations ──────────────────────────────────────
  console.log("  Creating team invitations...");

  // Alice invites Emma to Neural Navigators
  await prisma.teamInvitation.create({
    data: {
      teamId: team1.id,
      inviterId: students[0].id, // Alice
      inviteeId: students[4].id, // Emma
      status: "pending",
      message: "Hey Emma! We need a full-stack dev for our team matching project. Your React and GraphQL skills would be perfect!",
      expiresAt: new Date("2026-06-01T23:59:59Z"),
    },
  });

  // David invites Frank to Cloud Crusaders
  await prisma.teamInvitation.create({
    data: {
      teamId: team2.id,
      inviterId: students[3].id, // David
      inviteeId: students[5].id, // Frank
      status: "pending",
      message: "We're building a deployment platform and could use your mobile skills for the companion app!",
      expiresAt: new Date("2026-06-01T23:59:59Z"),
    },
  });

  // An expired/rejected invitation
  await prisma.teamInvitation.create({
    data: {
      teamId: team2.id,
      inviterId: students[3].id,
      inviteeId: students[6].id, // Grace
      status: "rejected",
      message: "Would you like to join our infrastructure team?",
      expiresAt: new Date("2026-05-15T23:59:59Z"),
      respondedAt: new Date("2026-05-10T14:30:00Z"),
    },
  });

  console.log("  ✓ Created 3 team invitations\n");

  // ── Sponsorships ──────────────────────────────────────────
  console.log("  Creating sponsorships...");

  await prisma.sponsorship.create({
    data: {
      sponsorId: sponsors[0].id,
      hackathonId: hackathon1.id,
      tier: "platinum",
      amount: 20000,
      status: "approved",
    },
  });

  await prisma.sponsorship.create({
    data: {
      sponsorId: sponsors[1].id,
      hackathonId: hackathon1.id,
      tier: "gold",
      amount: 10000,
      status: "approved",
    },
  });

  await prisma.sponsorship.create({
    data: {
      sponsorId: sponsors[0].id,
      hackathonId: hackathon2.id,
      tier: "silver",
      amount: 5000,
      status: "pending",
    },
  });

  await prisma.sponsorship.create({
    data: {
      sponsorId: sponsors[1].id,
      hackathonId: hackathon4.id,
      tier: "gold",
      amount: 8000,
      status: "paid",
    },
  });

  console.log("  ✓ Created 4 sponsorships\n");

  // ── Summary ───────────────────────────────────────────────
  console.log("✅ Seed complete!\n");
  console.log("  Test credentials (all users): password123");
  console.log("  Students:   alice@example.com .. henry@example.com");
  console.log("  Organizers: organizer1@example.com, organizer2@example.com");
  console.log("  Sponsors:   sponsor1@example.com, sponsor2@example.com\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
