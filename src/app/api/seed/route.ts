import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

// This route is for development only
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This route is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.user.upsert({
      where: { email: "admin@naturale.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@naturale.com",
        password: adminPassword,
      },
    });

    // Create sample team members
    const teamMembers = await Promise.all([
      prisma.teamMember.upsert({
        where: { id: "clq1" },
        update: {},
        create: {
          id: "clq1",
          name: "Petar Petrović",
          position: "Direktor projekta",
          description: "Profesor fizike sa 15 godina iskustva. Rukovodi celokupnim projektom Naturale.",
          image: "/team/profile1.jpg",
        },
      }),
      prisma.teamMember.upsert({
        where: { id: "clq2" },
        update: {},
        create: {
          id: "clq2",
          name: "Marija Marković",
          position: "Edukator",
          description: "Specijalista za eksperimentalnu fiziku. Vodi radionice i praktične demonstracije.",
          image: "/team/profile2.jpg",
        },
      }),
    ]);

    // Create sample blog posts
    const blogs = await Promise.all([
      prisma.blog.create({
        data: {
          title: "Zašto je važno kritičko razmišljanje u fizici",
          content: `# Kritičko razmišljanje u fizici

Fizika nas uči da analiziramo svet oko nas na sistematičan način. Kroz eksperimente i posmatranja, učimo da testiramo hipoteze i donosimo zaključke zasnovane na dokazima.

## Ključni elementi kritičkog razmišljanja

- Postavljanje pitanja
- Analiza podataka
- Testiranje hipoteza
- Izvođenje zaključaka

Kritičko razmišljanje je ključna veština ne samo u fizici, već i u svakodnevnom životu.`,
          published: true,
          author: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
      prisma.blog.create({
        data: {
          title: "Istorija velikih otkrića u fizici",
          content: `# Istorija fizike kroz velika otkrića

Od Njutna do Ajnštajna, istorija fizike je puna fascinantnih otkrića koja su promenila naše razumevanje univerzuma.

## Značajna otkrića

### Gravitacija - Isak Njutn
Revolucionarno otkriće koje je objasnilo kretanje planeta i objekata na Zemlji.

### Teorija relativnosti - Albert Ajnštajn
Promena paradigme u razumevanju prostora, vremena i energije.

### Kvantna mehanika
Otkriće da se čestice ponašaju drugačije na subatomskom nivou.

Ova otkrića su temelj moderne fizike i tehnologije.`,
          published: true,
          author: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
    ]);

    // Create sample activities
    const activities = await Promise.all([
      prisma.activity.create({
        data: {
          title: "Radionica: Elektricitet u svakodnevnom životu",
          content: `# Radionica o elektricitetu

Kroz ovu radionicu, učenici će imati priliku da:
- Razumeju osnovne principe elektriciteta
- Naprave jednostavna električna kola
- Vide primenu u svakodnevnim uređajima

Radionica je namenjena učenicima srednje škole i trajaće 2 sata.`,
          image: "/activities/electricity.jpg",
          published: true,
          author: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
      prisma.activity.create({
        data: {
          title: "Poseta opservatoriji",
          content: `# Poseta Astronomskoj opservatoriji

Organizujemo posetu astronomskoj opservatoriji gde će učenici:
- Učiti o nebeskim telima
- Posmatrati zvezde kroz teleskop
- Razumeti osnovne principe astronomije

Ovo je jedinstvena prilika da se fizika doživi izvan učionice!`,
          image: "/activities/observatory.jpg",
          published: true,
          author: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        admin,
        teamMembers,
        blogs,
        activities,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
} 