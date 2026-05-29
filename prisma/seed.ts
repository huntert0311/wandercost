import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const destinations = [
  {
    name: "Bali",
    slug: "bali",
    country: "Indonesia",
    continent: "Asia",
    cover_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    avg_cost_per_day: 45,
    avg_cost_stay: 25,
    avg_cost_food: 12,
    avg_cost_flight: 680,
  },
  {
    name: "Lisbon",
    slug: "lisbon",
    country: "Portugal",
    continent: "Europe",
    cover_image: "https://images.unsplash.com/photo-1558370781-d6196949e317?w=1200",
    avg_cost_per_day: 95,
    avg_cost_stay: 60,
    avg_cost_food: 22,
    avg_cost_flight: 420,
  },
  {
    name: "Mexico City",
    slug: "mexico-city",
    country: "Mexico",
    continent: "North America",
    cover_image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200",
    avg_cost_per_day: 55,
    avg_cost_stay: 35,
    avg_cost_food: 14,
    avg_cost_flight: 310,
  },
  {
    name: "Tokyo",
    slug: "tokyo",
    country: "Japan",
    continent: "Asia",
    cover_image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    avg_cost_per_day: 130,
    avg_cost_stay: 80,
    avg_cost_food: 28,
    avg_cost_flight: 890,
  },
  {
    name: "Chiang Mai",
    slug: "chiang-mai",
    country: "Thailand",
    continent: "Asia",
    cover_image: "https://images.unsplash.com/photo-1599698880016-c5b9cda87ba9?w=1200",
    avg_cost_per_day: 38,
    avg_cost_stay: 18,
    avg_cost_food: 9,
    avg_cost_flight: 720,
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    country: "South Africa",
    continent: "Africa",
    cover_image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
    avg_cost_per_day: 70,
    avg_cost_stay: 40,
    avg_cost_food: 16,
    avg_cost_flight: 950,
  },
  {
    name: "Medellín",
    slug: "medellin",
    country: "Colombia",
    continent: "South America",
    cover_image: "https://images.unsplash.com/photo-1583997052103-b4a1cb974ce5?w=1200",
    avg_cost_per_day: 42,
    avg_cost_stay: 22,
    avg_cost_food: 11,
    avg_cost_flight: 480,
  },
  {
    name: "Prague",
    slug: "prague",
    country: "Czech Republic",
    continent: "Europe",
    cover_image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200",
    avg_cost_per_day: 80,
    avg_cost_stay: 50,
    avg_cost_food: 18,
    avg_cost_flight: 380,
  },
];

async function main() {
  console.log("Seeding destinations...");

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
    console.log(`  ✓ ${dest.name}`);
  }

  console.log(`\nSeeded ${destinations.length} destinations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
