import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Seed deployments and products.
 * Run with: npx convex run seed:seedData
 */
export const seedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return "Already seeded";
    }

    // 1. Create deployments
    const ortoqbankDeploymentId = await ctx.db.insert("deployments", {
      name: "OrtoQBank",
      slug: "ortoqbank",
      provisionUrl: "https://ortoqbank.convex.site",
      domain: "ortoqbank.ortoclub.com",
      isActive: true,
    });

    const teotDeploymentId = await ctx.db.insert("deployments", {
      name: "TEOT",
      slug: "teot",
      provisionUrl: "https://teot.convex.site",
      domain: "teot.ortoclub.com",
      isActive: true,
    });

    // 2. Create products
    await ctx.db.insert("products", {
      name: "OrtoQBank",
      slug: "orto-qbank",
      lot: 1,
      price: 1497,
      pixPrice: 1197,
      targetDeployments: [ortoqbankDeploymentId],
      description: "Banco de questões 100% focado na prova do TEOT/TEPOT",
      features: [
        "+4.000 questões comentadas",
        "Plataforma própria interativa",
        "Análise de desempenho avançada",
        "Simulados no formato real do TEOT",
        "Provas antigas",
      ],
      isActive: true,
      displayOrder: 1,
    });

    await ctx.db.insert("products", {
      name: "TEOT Aulas",
      slug: "teot-video",
      lot: 1,
      price: 1997,
      pixPrice: 1597,
      targetDeployments: [teotDeploymentId],
      description: "Plataforma de aulas que forma ortopedistas de excelência e aprova no TEOT",
      features: [
        "+10 especialistas da USP",
        "Cobertura completa do TEOT",
        "Método orientado à prova",
        "Resultado comprovado",
      ],
      isActive: true,
      displayOrder: 2,
    });

    // 3. Combo product
    await ctx.db.insert("products", {
      name: "Extensivo 2027",
      slug: "extensivo-2027",
      lot: 1,
      price: 3494,
      pixPrice: 2794,
      targetDeployments: [ortoqbankDeploymentId, teotDeploymentId],
      description: "Pacote completo: TEOT Aulas + OrtoQBank",
      features: [
        "+10 especialistas da USP",
        "Cobertura completa do TEOT",
        "+4.000 questões comentadas",
        "Plataforma própria interativa",
        "Simulados no formato real do TEOT",
      ],
      isActive: true,
      displayOrder: 0,
    });

    return "Seeded successfully: 2 deployments + 3 products";
  },
});

/**
 * Add the Extensivo 2027 combo product to an existing seeded database.
 * Run with: npx convex run seed:addComboProduct
 */
export const addComboProduct = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if combo already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", "extensivo-2027"))
      .unique();

    if (existing) {
      return "Combo product already exists";
    }

    // Find deployments by slug
    const ortoqbankDep = await ctx.db
      .query("deployments")
      .withIndex("by_slug", (q) => q.eq("slug", "ortoqbank"))
      .unique();

    const teotDep = await ctx.db
      .query("deployments")
      .withIndex("by_slug", (q) => q.eq("slug", "teot"))
      .unique();

    if (!ortoqbankDep || !teotDep) {
      throw new Error("Deployments not found. Run seedData first.");
    }

    await ctx.db.insert("products", {
      name: "Extensivo 2027",
      slug: "extensivo-2027",
      lot: 1,
      price: 3494,
      pixPrice: 2794,
      targetDeployments: [ortoqbankDep._id, teotDep._id],
      description: "Pacote completo: TEOT Aulas + OrtoQBank",
      features: [
        "+10 especialistas da USP",
        "Cobertura completa do TEOT",
        "+4.000 questões comentadas",
        "Plataforma própria interativa",
        "Simulados no formato real do TEOT",
      ],
      isActive: true,
      displayOrder: 0,
    });

    return "Combo product 'Extensivo 2027' created successfully";
  },
});
