import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create default admin user
  const adminEmail = 'admin@portfolio.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Mark Portfolio Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Admin user created: admin@portfolio.com / admin123');
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Create Site Settings
  const settingsId = 'default';
  const existingSettings = await prisma.siteSettings.findUnique({
    where: { id: settingsId }
  });

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: settingsId,
        fullName: 'Mark Developer',
        title_en: 'Senior Full-Stack Architect & Motion Designer',
        title_ar: 'مهندس برمجيات متكامل ومصمم حركي رئيسي',
        bio_en: 'I build premium digital experiences with high visual polish, smooth animations, and scalable enterprise codebases.',
        bio_ar: 'أقوم ببناء تجارب رقمية متميزة بلمسات بصرية راقية، وحركات تفاعلية انسيابية، وبنيات برمجية قابلة للتوسع.',
        email: 'mark@developer.com',
        phone: '+1 (555) 019-2834',
        github: 'https://github.com/marks7924',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        x: 'https://x.com',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        resumeFile: '#'
      }
    });
    console.log('Site settings initialized.');
  }

  // 3. Create initial skills
  const skillsCount = await prisma.skill.count();
  if (skillsCount === 0) {
    const initialSkills = [
      { name_en: 'Next.js', name_ar: 'Next.js', category: 'FRONTEND', percentage: 95, icon: 'layers' },
      { name_en: 'React / TypeScript', name_ar: 'React / TypeScript', category: 'FRONTEND', percentage: 98, icon: 'code' },
      { name_en: 'Tailwind CSS', name_ar: 'Tailwind CSS', category: 'FRONTEND', percentage: 96, icon: 'palette' },
      { name_en: 'Framer Motion', name_ar: 'Framer Motion', category: 'FRONTEND', percentage: 92, icon: 'wind' },
      { name_en: 'Node.js / Express', name_ar: 'Node.js / Express', category: 'BACKEND', percentage: 90, icon: 'server' },
      { name_en: 'PostgreSQL', name_ar: 'PostgreSQL', category: 'DATABASE', percentage: 88, icon: 'database' },
      { name_en: 'Prisma ORM', name_ar: 'Prisma ORM', category: 'DATABASE', percentage: 94, icon: 'database' },
      { name_en: 'Supabase', name_ar: 'Supabase', category: 'CLOUD', percentage: 90, icon: 'cloud' },
      { name_en: 'Docker', name_ar: 'Docker', category: 'DEVOPS', percentage: 80, icon: 'container' },
      { name_en: 'CI/CD Pipelines', name_ar: 'CI/CD Pipelines', category: 'DEVOPS', percentage: 85, icon: 'git-branch' },
      { name_en: 'Copilot / ChatGPT APIs', name_ar: 'Copilot / ChatGPT APIs', category: 'AITOOLS', percentage: 92, icon: 'cpu' }
    ];

    await prisma.skill.createMany({
      data: initialSkills
    });
    console.log('Initial skills seeded.');
  }

  // 4. Create initial experience
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          company_en: 'Vercel Inc.',
          company_ar: 'شركة Vercel',
          role_en: 'Senior Frontend Engineer',
          role_ar: 'مهندس واجهات أممية رئيسي',
          description_en: 'Worked on Next.js core optimization, edge middleware frameworks, and performance improvements for complex layouts.',
          description_ar: 'عملت على تحسين نواة Next.js، وأطر عمل البرمجيات الوسيطة للحواف، وتحسين الأداء للتخطيطات المعقدة.',
          startDate: new Date('2024-01-01'),
          endDate: null,
          current: true
        },
        {
          company_en: 'Stripe',
          company_ar: 'شركة Stripe',
          role_en: 'Full-Stack Developer',
          role_ar: 'مطور برمجيات متكامل',
          description_en: 'Designed dashboard analytics panels, customized payment checkout flows, and scaled back-end transaction queue systems.',
          description_ar: 'صممت لوحات تحليلات لوحة التحكم، ودفقات الدفع المخصصة، وقمنا بزيادة قدرة أنظمة طوابير المعاملات الخلفية.',
          startDate: new Date('2022-03-01'),
          endDate: new Date('2023-12-31'),
          current: false
        }
      ]
    });
    console.log('Experiences timeline seeded.');
  }

  // 5. Create initial projects
  const projectsCount = await prisma.project.count();
  if (projectsCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          sequenceNumber: 1,
          title_en: 'SaaS Analytics Dashboard',
          title_ar: 'لوحة تحليلات سحابية للشركات SaaS',
          category_en: 'Dashboards',
          category_ar: 'لوحات التحكم',
          description_en: 'A high-performance real-time SaaS business metrics dashboard featuring glassmorphic design and responsive widgets.',
          description_ar: 'لوحة تحكم للمقاييس التجارية عالية الأداء وفورية للشركات، تتميز بتصميم زجاجي وعناصر واجهة مستخدم تفاعلية متجاوبة.',
          challenge_en: 'Handling heavy data updates without layout shifts or sluggish frame rates on lower-end mobile devices.',
          challenge_ar: 'التعامل مع تحديثات البيانات الثقيلة دون حدوث إزاحة في العناصر أو بطء في معدل الإطارات على أجهزة الجوال الضعيفة.',
          solution_en: 'Utilized React Server Actions with request revalidation, optimized dynamic charts, and GPU-accelerated motion animations.',
          solution_ar: 'استخدمنا إجراءات خادم React Actions مع إعادة التحقق من الطلب، ورسوم بيانية ديناميكية محسنة، وحركات تسريع معالج الرسومات.',
          technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'PostgreSQL'],
          coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
          ],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com/marks7924',
          featured: true
        },
        {
          sequenceNumber: 2,
          title_en: 'Interactive E-Commerce Platform',
          title_ar: 'منصة التجارة الإلكترونية التفاعلية',
          category_en: 'E-Commerce',
          category_ar: 'التجارة الإلكترونية',
          description_en: 'A premium retail shopping experience complete with smooth cart transitions, bilingual search, and dark mode aesthetics.',
          description_ar: 'تجربة تسوق تجزئة متميزة مكتملة بانتقالات سلة تسوق انسيابية، وبحث ثنائي اللغة، وجماليات الوضع الداكن.',
          challenge_en: 'Syncing cart actions between local memory caches and PostgreSQL database securely during concurrent spikes.',
          challenge_ar: 'مزامنة عمليات سلة التسوق بين ذاكرة التخزين المؤقتة المحلية وقاعدة بيانات PostgreSQL بشكل آمن خلال فترات الذروة.',
          solution_en: 'Designed stateless serverless middleware with NextAuth validation checks and transactional database rollbacks.',
          solution_ar: 'صممت برمجيات وسيطة بدون حالة مع عمليات التحقق من صحة NextAuth والتراجعات عن معاملات قاعدة البيانات.',
          technologies: ['Next.js', 'PostgreSQL', 'Stripe SDK', 'Zod', 'Tailwind CSS'],
          coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'
          ],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com/marks7924',
          featured: true
        }
      ]
    });
    console.log('Sample projects seeded.');
  }

  // 6. Testimonials
  const testCount = await prisma.testimonial.count();
  if (testCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'Sarah Jenkins',
          company: 'Aura Design Studio',
          position: 'Creative Director',
          review_en: 'Mark delivered an exceptional portfolio architecture that surpassed all our benchmarks. The fluid micro-interactions and Apple-level polish truly represent state-of-the-art web capabilities.',
          review_ar: 'قدم مارك بنية ممتازة تتجاوز كل معاييرنا. التفاعلات الدقيقة الانسيابية واللمسة الراقية تمثل حقاً أحدث إمكانيات الويب الحديثة.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        },
        {
          name: 'Yousef Al-Otaibi',
          company: 'Riyadh Tech Ventures',
          position: 'Chief Product Officer',
          review_en: 'An absolute masterpiece of developer craftsmanship. The complete RTL-aware interface flips smoothly, Cairo fonts render perfectly, and content adjustments are reflected instantly without rebuild cycles.',
          review_ar: 'تحفة فنية مطلقة من المهارة البرمجية. واجهة تدعم RTL بالكامل وتقلب بسلاسة فائقة، وخطوط القاهرة تظهر بشكل مثالي، وتعديلات المحتوى تظهر فورياً.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        }
      ]
    });
    console.log('Sample testimonials seeded.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
