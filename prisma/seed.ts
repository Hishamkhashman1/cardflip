import { PrismaClient, CardCondition, ListingStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("password123", 12);

  const [aria, bram, cato] = await Promise.all([
    prisma.user.create({ data: { email: "aria@cardflip.dev", handle: "aria", name: "Aria", passwordHash: password } }),
    prisma.user.create({ data: { email: "bram@cardflip.dev", handle: "bram", name: "Bram", passwordHash: password } }),
    prisma.user.create({ data: { email: "cato@cardflip.dev", handle: "cato", name: "Cato", passwordHash: password, role: "ADMIN" } }),
  ]);

  const sampleCards = [
    {
      ownerId: aria.id,
      title: "Neon Tide Serpent",
      setName: "Synthwave Depths",
      number: "001",
      rarity: "Mythic",
      condition: CardCondition.NM,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    },
    {
      ownerId: aria.id,
      title: "Prism Plains Nomad",
      setName: "Synthwave Depths",
      number: "014",
      rarity: "Rare",
      condition: CardCondition.LP,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
    {
      ownerId: bram.id,
      title: "Obsidian Bloom",
      setName: "Garden of Echoes",
      number: "102",
      rarity: "Uncommon",
      condition: CardCondition.NM,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    },
    {
      ownerId: bram.id,
      title: "Low Orbit Warden",
      setName: "Garden of Echoes",
      number: "204",
      rarity: "Ultra",
      condition: CardCondition.MP,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    },
    {
      ownerId: cato.id,
      title: "Circuitbreaker Titan",
      setName: "Photon Siege",
      number: "077",
      rarity: "Secret",
      condition: CardCondition.LP,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      ownerId: cato.id,
      title: "Aurora Grove Keeper",
      setName: "Photon Siege",
      number: "089",
      rarity: "Rare",
      condition: CardCondition.NM,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1527030280862-64139fba04ca",
    },
    {
      ownerId: aria.id,
      title: "Pulsewing Scout",
      setName: "Sky Loom",
      number: "045",
      rarity: "Rare",
      condition: CardCondition.NM,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    },
    {
      ownerId: bram.id,
      title: "Gloom Reef Orator",
      setName: "Sky Loom",
      number: "099",
      rarity: "Common",
      condition: CardCondition.HP,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    },
    {
      ownerId: cato.id,
      title: "Amber Circuit Squire",
      setName: "Glitch Citadel",
      number: "010",
      rarity: "Uncommon",
      condition: CardCondition.LP,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",
    },
    {
      ownerId: aria.id,
      title: "Starwoven Myriad",
      setName: "Glitch Citadel",
      number: "011",
      rarity: "Mythic",
      condition: CardCondition.NM,
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
  ];

  const cards = await prisma.$transaction(sampleCards.map((card) => prisma.card.create({ data: card })));

  await prisma.$transaction(
    cards.slice(0, 8).map((card, index) =>
      prisma.listing.create({
        data: {
          cardId: card.id,
          sellerId: card.ownerId,
          priceCents: 1500 + index * 250,
          currency: "usd",
          status: ListingStatus.ACTIVE,
        },
      })
    )
  );
}

main()
  .then(() => console.log("Seeded database"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
