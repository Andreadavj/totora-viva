import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌿 Sembrando base de datos Totora Viva...');

  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin2024!', 12);
  const userPassword  = await bcrypt.hash('Cliente2024!', 12);

  await prisma.user.create({
    data: {
      email: 'admin@totoraviva.cl',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Totora Viva',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'cliente@ejemplo.cl',
      password: userPassword,
      firstName: 'María',
      lastName: 'González',
      phone: '+56912345678',
      city: 'Santiago',
      region: 'Región Metropolitana',
    },
  });

  const catCortinas = await prisma.category.create({
    data: {
      name: 'Cortinas de Totora',
      slug: 'cortinas',
      description: 'Cortinas naturales que aíslan hasta 5°C. Vida útil de 15 a 20 años.',
      sortOrder: 1,
    },
  });

  const catEsteras = await prisma.category.create({
    data: {
      name: 'Esteras',
      slug: 'esteras',
      description: 'Esteras predeterminadas de 5m ancho x 2m alto.',
      sortOrder: 2,
    },
  });

  const catCierres = await prisma.category.create({
    data: {
      name: 'Cierres Perimetrales',
      slug: 'cierres-perimetrales',
      description: 'Remates y bordes tejidos para esteras y cortinas.',
      sortOrder: 3,
    },
  });

  const catCielo = await prisma.category.create({
    data: {
      name: 'Tejido Cielo',
      slug: 'tejido-cielo',
      description: 'Tejido de totora para cielos, en variante fina o gruesa.',
      sortOrder: 4,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Cortina de Totora Artesanal',
        slug: 'cortina-totora-artesanal',
        description: 'Cortina 100% natural fabricada a mano con fibra de totora cosechada de manera sustentable. Aísla térmicamente hasta 5°C.',
        shortDescription: 'Cortina natural que aísla hasta 5°C. Hecha a medida.',
        categoryId: catCortinas.id,
        pricingType: 'PER_SQM',
        pricePerSqm: 24000,
        images: ['/images/products/cortina-totora-1.jpg'],
        features: [
          'Aislamiento térmico hasta 5°C',
          'Vida útil 15–20 años',
          'Material 100% natural',
          'Fabricada a mano',
          'Medida personalizada',
        ],
        lifespan: '15–20 años',
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: 'Estera de Totora 5×2m',
        slug: 'estera-totora-5x2',
        description: 'Estera en medida estándar 5m ancho × 2m alto. Incluye cierres perimetrales tejidos.',
        shortDescription: 'Estera 5×2m con cierres perimetrales tejidos.',
        categoryId: catEsteras.id,
        pricingType: 'FIXED',
        fixedPrice: 35000,
        hasFineOption: true,
        hasCoarseOption: true,
        images: ['/images/products/estera-totora-1.jpg'],
        features: [
          'Medida estándar 5m × 2m',
          'Cierres perimetrales incluidos',
          'Tejido fino o grueso a elección',
        ],
        lifespan: '10–15 años',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: 'Cierre Perimetral Tejido',
        slug: 'cierre-perimetral',
        description: 'Remate perimetral tejido a mano para bordes de esteras y cortinas.',
        shortDescription: 'Remate tejido para bordes. Por m².',
        categoryId: catCierres.id,
        pricingType: 'PER_SQM',
        pricePerSqm: 12000,
        images: ['/images/products/cierre-perimetral.jpg'],
        features: ['Tejido artesanal resistente', 'Evita deshilachado', 'Medida personalizada'],
        isFeatured: false,
        sortOrder: 3,
      },
      {
        name: 'Tejido Cielo de Totora',
        slug: 'tejido-cielo-totora',
        description: 'Tejido de fibra natural para cielos rasos y pérgolas. Disponible fino o grueso.',
        shortDescription: 'Tejido natural para cielos. Fino o grueso.',
        categoryId: catCielo.id,
        pricingType: 'WEAVE_TYPE',
        hasFineOption: true,
        hasCoarseOption: true,
        finePricePerSqm: 12500,
        coarsePricePerSqm: 11500,
        images: ['/images/products/tejido-cielo-fino.jpg'],
        features: ['Tejido fino o grueso', 'Ideal para cielos y pérgolas', 'Medida personalizada'],
        isFeatured: true,
        sortOrder: 4,
      },
    ],
  });

  console.log('✅ Base de datos sembrada correctamente');
  console.log('   👤 Admin: admin@totoraviva.cl / Admin2024!');
  console.log('   👤 Cliente: cliente@ejemplo.cl / Cliente2024!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
