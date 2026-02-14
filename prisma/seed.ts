import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing data
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

  // Create users
  const passwordHash = await bcrypt.hash("password123", 10);

  const student = await prisma.user.create({
    data: {
      email: "student@example.com",
      username: "student_user",
      fullName: "Test Student",
      passwordHash,
      role: UserRole.student,
      studentProfile: {
        create: {
          university: "Tech University",
          degree: "Computer Science",
          graduationYear: 2025,
        },
      },
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: "organizer@example.com",
      username: "organizer_user",
      fullName: "Test Organizer",
      passwordHash,
      role: UserRole.organizer,
      organizerProfile: {
        create: {
          organizationName: "Hackathon Org",
          position: "Lead Organizer",
        },
      },
    },
  });

  const sponsor = await prisma.user.create({
    data: {
      email: "sponsor@example.com",
      username: "sponsor_user",
      fullName: "Test Sponsor",
      passwordHash,
      role: UserRole.sponsor,
      sponsorProfile: {
        create: {
          companyName: "Tech Corp",
          industry: "Software",
          websiteUrl: "https://techcorp.com",
        },
      },
    },
  });

  console.log({ student, organizer, sponsor });

  // Create a Hackathon
  const hackathon = await prisma.hackathon.create({
    data: {
      title: "TAkathon 2025",
      description: "The ultimate hackathon for students!",
      organizerId: organizer.id,
      startDate: new Date("2025-06-01T09:00:00Z"),
      endDate: new Date("2025-06-03T18:00:00Z"),
      registrationDeadline: new Date("2025-05-20T23:59:59Z"),
      location: "Virtual",
      isVirtual: true,
      maxParticipants: 500,
      status: "registration_open",
    },
  });

  console.log({ hackathon });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
