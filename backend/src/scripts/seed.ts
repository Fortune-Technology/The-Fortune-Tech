/**
 * Database Seed Script
 * Seeds the database with initial data
 */

import mongoose from 'mongoose';
import { env } from '../config/env';
import { User, Service, Portfolio, TechnologyCategory, Testimonial, Career, CMSPage, WebsiteConfig } from '../models';
import { USER_ROLES, USER_STATUSES, CMS_STATUSES, PORTFOLIO_STATUSES, JOB_TYPES } from '../constants';

const seedData = async (): Promise<void> => {
    try {
        console.log('🌱 Connecting to database...');
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to database');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Service.deleteMany({}),
            Portfolio.deleteMany({}),
            TechnologyCategory.deleteMany({}),
            Testimonial.deleteMany({}),
            Career.deleteMany({}),
            CMSPage.deleteMany({}),
            WebsiteConfig.deleteMany({}),
        ]);

        // Seed Admin User
        console.log('👤 Creating admin user...');
        const adminUser = await User.create({
            email: 'admin@thefortunetech.com',
            password: 'Admin@123',
            firstName: 'Admin',
            lastName: 'User',
            displayName: 'Admin',
            role: USER_ROLES.SUPER_ADMIN,
            status: USER_STATUSES.ACTIVE,
            metadata: {
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        console.log(`  ✅ Admin user created: ${adminUser.email}`);

        // Seed Services
        console.log('📦 Creating services...');
        const services = await Service.create([
            {
                slug: 'it-consulting-strategy',
                title: 'IT Consulting & Strategy',
                tagline: 'Align technology with your business goals',
                description: 'Expert IT consulting to help you define your technology roadmap, optimize processes, and make data-driven decisions.',
                overview: 'We work closely with your leadership team to understand your business objectives, assess your current technology landscape, and craft a strategic IT plan that drives measurable growth and efficiency.',
                icon: '/uploads/serviceicon/consultingservice.png',
                image: '/uploads/services/IT Consulting & Strategy.png',
                features: ['Technology Roadmap Development', 'Digital Maturity Assessment', 'IT Budget Optimization', 'Vendor Evaluation & Selection'],
                deliverables: ['Strategic IT Roadmap Document', 'Gap Analysis Report', 'Implementation Timeline', 'ROI Projections'],
                process: ['Discovery & Assessment', 'Analysis & Benchmarking', 'Strategy Formulation', 'Roadmap Presentation', 'Implementation Support'],
                techStack: ['TOGAF', 'ITIL', 'Agile', 'Lean Six Sigma'],
                benefits: ['Reduced IT Costs', 'Faster Decision Making', 'Technology-Business Alignment', 'Risk Mitigation'],
                idealFor: ['SMEs', 'Growing Startups', 'Enterprises Undergoing Digital Transformation'],
                cta: 'Get a Free Consultation',
                seo: {
                    metaTitle: 'IT Consulting & Strategy Services | The Fortune Tech',
                    metaDescription: 'Expert IT consulting services to align technology with your business goals and drive growth.',
                },
                featured: true,
            },
            {
                slug: 'ui-ux-design',
                title: 'UI/UX Design',
                tagline: 'Design experiences that delight and convert',
                description: 'User-centered design that balances aesthetics with functionality to create intuitive digital experiences.',
                overview: 'From user research and wireframing to high-fidelity prototypes and design systems, we craft interfaces that users love and that drive business results.',
                icon: '/uploads/serviceicon/uiux.png',
                image: '/uploads/services/UI-UX Design.png',
                features: ['User Research & Personas', 'Wireframing & Prototyping', 'Visual Design & Branding', 'Design System Creation', 'Usability Testing'],
                deliverables: ['Figma/Adobe XD Design Files', 'Interactive Prototypes', 'Style Guide & Component Library', 'Usability Test Reports'],
                process: ['Research & Discovery', 'Information Architecture', 'Wireframing', 'Visual Design', 'Prototyping & Testing'],
                techStack: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin'],
                benefits: ['Increased User Engagement', 'Higher Conversion Rates', 'Reduced Development Costs', 'Brand Consistency'],
                idealFor: ['Web Apps', 'Mobile Apps', 'SaaS Products', 'E-commerce Platforms'],
                cta: 'Start Designing',
                seo: {
                    metaTitle: 'UI/UX Design Services | The Fortune Tech',
                    metaDescription: 'Professional UI/UX design services that create intuitive, beautiful, and high-converting digital experiences.',
                },
                featured: true,
            },
            {
                slug: 'web-development',
                title: 'Web Development',
                tagline: 'Fast, secure, and scalable web solutions',
                description: 'Custom websites and web applications built with modern technologies, focused on performance, security, and scalability.',
                overview: 'We build high-quality websites and web applications optimized for speed, SEO, and conversions. Our solutions scale with your business and deliver seamless experiences across all devices.',
                icon: '/uploads/serviceicon/website.png',
                image: '/uploads/services/Web Development.png',
                features: ['Custom Web Applications', 'Responsive & Mobile-First Design', 'CMS Integration', 'API Development & Integration', 'SEO-Optimized Architecture'],
                deliverables: ['Production-Ready Website/App', 'Source Code & Documentation', 'Deployment & Hosting Setup', 'Performance Audit Report'],
                process: ['Discovery & Planning', 'UI/UX Wireframes', 'Frontend & Backend Development', 'Testing & QA', 'Deployment & Launch'],
                techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
                benefits: ['Increased Online Visibility', 'Better Conversion Rates', 'Future-Ready Architecture', 'Clean & Semantic Code'],
                idealFor: ['Startups', 'SMEs', 'Corporate Websites', 'SaaS Platforms'],
                cta: 'Build Your Website',
                seo: {
                    metaTitle: 'Web Development Services | The Fortune Tech',
                    metaDescription: 'Custom web development using React, Next.js, and Node.js for scalable, high-performing websites and web apps.',
                },
                featured: true,
            },
            {
                slug: 'mobile-app-development',
                title: 'Mobile App Development',
                tagline: 'Build apps that users love',
                description: 'Native and cross-platform mobile applications for iOS and Android that deliver superior user experiences.',
                overview: 'We create mobile apps that engage users, drive retention, and grow your business—from concept and design through development, testing, and app store launch.',
                icon: '/uploads/serviceicon/mobileapps.png',
                image: '/uploads/services/Mobile App Development.png',
                features: ['iOS & Android Development', 'Cross-Platform (React Native / Flutter)', 'Push Notifications & Real-Time Features', 'Offline-First Architecture', 'App Store Optimization'],
                deliverables: ['App Source Code', 'App Store & Play Store Listings', 'Analytics & Crash Reporting Setup', 'Post-Launch Support Plan'],
                process: ['Requirements & Planning', 'UI/UX Design', 'Development & Integration', 'QA Testing', 'Store Submission & Launch'],
                techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
                benefits: ['Native Performance', 'Cross-Platform Reach', 'User-Centric Design', 'Faster Time to Market'],
                idealFor: ['Consumer Apps', 'Enterprise Mobility', 'Startups', 'On-Demand Services'],
                cta: 'Build Your App',
                seo: {
                    metaTitle: 'Mobile App Development | The Fortune Tech',
                    metaDescription: 'Expert mobile app development for iOS and Android using React Native, Flutter, and native technologies.',
                },
                featured: true,
            },
            {
                slug: 'e-commerce-solutions',
                title: 'E-Commerce Solutions',
                tagline: 'Sell more with a powerful online store',
                description: 'End-to-end e-commerce development with secure payments, inventory management, and conversion-optimized design.',
                overview: 'We build custom e-commerce platforms and enhance existing ones to help you sell more online. From product catalogs and checkout flows to payment gateways and order management, we handle every detail.',
                icon: '/uploads/serviceicon/ecommerce.png',
                image: '/uploads/services/E-Commerce Solutions.png',
                features: ['Custom E-Commerce Development', 'Payment Gateway Integration', 'Inventory & Order Management', 'Multi-Currency & Multi-Language Support', 'Analytics & Reporting Dashboards'],
                deliverables: ['Fully Functional Online Store', 'Admin Dashboard', 'Payment & Shipping Integration', 'SEO & Performance Optimization'],
                process: ['Business Analysis', 'Store Design & UX', 'Development & Integration', 'Payment & Security Testing', 'Launch & Training'],
                techStack: ['Shopify', 'WooCommerce', 'Next.js', 'Stripe', 'PayPal', 'Node.js'],
                benefits: ['Increased Revenue', '24/7 Sales Channel', 'Streamlined Operations', 'Data-Driven Insights'],
                idealFor: ['Retail Businesses', 'D2C Brands', 'Wholesale Distributors', 'Subscription Services'],
                cta: 'Launch Your Store',
                seo: {
                    metaTitle: 'E-Commerce Development Services | The Fortune Tech',
                    metaDescription: 'Custom e-commerce solutions with secure payments, inventory management, and conversion-optimized design.',
                },
                featured: false,
            },
            {
                slug: 'custom-software-development',
                title: 'Custom Software Development',
                tagline: 'Tailored solutions for unique business needs',
                description: 'Bespoke software solutions designed and built from the ground up to address your specific business challenges.',
                overview: 'Off-the-shelf software can only take you so far. We design, develop, and maintain custom software that fits your workflows, integrates with your existing systems, and grows with your business.',
                icon: '/uploads/serviceicon/customsoftware.png',
                image: '/uploads/services/Custom Software Development.png',
                features: ['Business Process Automation', 'Enterprise Application Development', 'Legacy System Modernization', 'Third-Party Integrations', 'Microservices Architecture'],
                deliverables: ['Custom Software Application', 'API Documentation', 'User Training & Manuals', 'Source Code Ownership'],
                process: ['Requirement Gathering', 'System Architecture', 'Agile Development Sprints', 'Integration & Testing', 'Deployment & Handover'],
                techStack: ['Node.js', 'Python', '.NET', 'Java', 'PostgreSQL', 'Redis', 'Docker'],
                benefits: ['100% Tailored to Your Needs', 'Competitive Advantage', 'Improved Efficiency', 'Full Ownership & Control'],
                idealFor: ['Enterprises', 'Healthcare', 'Finance', 'Logistics', 'Manufacturing'],
                cta: 'Discuss Your Project',
                seo: {
                    metaTitle: 'Custom Software Development | The Fortune Tech',
                    metaDescription: 'Bespoke software development tailored to your unique business requirements and workflows.',
                },
                featured: false,
            },
            {
                slug: 'api-development-integration',
                title: 'API Development & Integration',
                tagline: 'Connect your systems seamlessly',
                description: 'Design, develop, and integrate robust APIs that connect your applications, services, and data sources.',
                overview: 'We build secure, well-documented RESTful and GraphQL APIs that power your applications and enable seamless integration with third-party services, payment gateways, CRMs, and more.',
                icon: '/uploads/serviceicon/api development.png',
                image: '/uploads/services/API Development & Integration.png',
                features: ['RESTful & GraphQL API Design', 'Third-Party API Integration', 'Webhook Implementation', 'API Security & Rate Limiting', 'Comprehensive Documentation'],
                deliverables: ['Production-Ready APIs', 'Swagger/OpenAPI Documentation', 'Integration Test Suite', 'Postman Collections'],
                process: ['API Design & Specification', 'Development & Testing', 'Security Audit', 'Documentation', 'Deployment & Monitoring'],
                techStack: ['Node.js', 'Express', 'GraphQL', 'REST', 'Swagger', 'Postman', 'JWT'],
                benefits: ['System Interoperability', 'Reduced Manual Work', 'Real-Time Data Flow', 'Scalable Architecture'],
                idealFor: ['SaaS Platforms', 'Enterprises with Multiple Systems', 'Fintech', 'Healthcare IT'],
                cta: 'Connect Your Systems',
                seo: {
                    metaTitle: 'API Development & Integration | The Fortune Tech',
                    metaDescription: 'Expert API development and third-party integration services for seamless system connectivity.',
                },
                featured: false,
            },
            {
                slug: 'cloud-devops',
                title: 'Cloud & DevOps',
                tagline: 'Scale with confidence in the cloud',
                description: 'Cloud infrastructure setup, migration, and DevOps automation for reliable, scalable, and cost-efficient operations.',
                overview: 'We help you leverage cloud platforms to their full potential—from initial setup and migration to CI/CD pipelines, monitoring, and auto-scaling—so your applications run smoothly at any scale.',
                icon: '/uploads/serviceicon/cloud-service.png',
                image: '/uploads/services/Cloud & DevOps.png',
                features: ['Cloud Migration & Setup', 'CI/CD Pipeline Automation', 'Infrastructure as Code (IaC)', 'Monitoring & Alerting', 'Cost Optimization'],
                deliverables: ['Cloud Architecture Design', 'Automated Deployment Pipelines', 'Infrastructure Documentation', 'Monitoring Dashboard Setup'],
                process: ['Assessment & Planning', 'Architecture Design', 'Migration / Setup', 'Automation & CI/CD', 'Monitoring & Optimization'],
                techStack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
                benefits: ['99.9% Uptime', 'Faster Deployments', 'Reduced Infrastructure Costs', 'Automatic Scaling'],
                idealFor: ['Growing Startups', 'Enterprises', 'SaaS Companies', 'E-Commerce Platforms'],
                cta: 'Move to the Cloud',
                seo: {
                    metaTitle: 'Cloud & DevOps Services | The Fortune Tech',
                    metaDescription: 'Cloud infrastructure, migration, and DevOps automation services for scalable and reliable operations.',
                },
                featured: false,
            },
            {
                slug: 'digital-marketing-seo',
                title: 'Digital Marketing & SEO',
                tagline: 'Get found, get leads, grow revenue',
                description: 'Data-driven digital marketing and SEO strategies that increase your online visibility and drive qualified leads.',
                overview: 'We combine technical SEO expertise with strategic content marketing and paid advertising to help your business rank higher, attract more visitors, and convert them into loyal customers.',
                icon: '/uploads/serviceicon/digitalmarketing.png',
                image: '/uploads/services/Digital Marketing & SEO.png',
                features: ['Technical & On-Page SEO', 'Content Marketing Strategy', 'Google Ads & Social Media Ads', 'Analytics & Performance Tracking', 'Local SEO & Google Business Profile'],
                deliverables: ['SEO Audit Report', 'Keyword Research & Strategy', 'Monthly Performance Reports', 'Ad Campaign Setup & Management'],
                process: ['SEO & Market Audit', 'Strategy Development', 'Implementation & Optimization', 'Monitoring & Reporting', 'Continuous Improvement'],
                techStack: ['Google Analytics', 'Google Search Console', 'SEMrush', 'Ahrefs', 'Google Ads', 'Meta Business Suite'],
                benefits: ['Higher Search Rankings', 'Increased Organic Traffic', 'Better ROI on Ad Spend', 'Brand Authority Building'],
                idealFor: ['Local Businesses', 'E-Commerce Stores', 'Professional Services', 'SaaS Companies'],
                cta: 'Boost Your Visibility',
                seo: {
                    metaTitle: 'Digital Marketing & SEO Services | The Fortune Tech',
                    metaDescription: 'Data-driven digital marketing and SEO strategies to increase visibility, traffic, and conversions.',
                },
                featured: false,
            },
            {
                slug: 'maintenance-support',
                title: 'Maintenance & Support',
                tagline: 'Keep your applications running at peak performance',
                description: 'Ongoing maintenance, support, and performance optimization to ensure your applications stay secure, fast, and up-to-date.',
                overview: 'After launch, your application needs continuous care. We offer flexible maintenance plans that cover bug fixes, security patches, performance tuning, feature updates, and 24/7 monitoring.',
                icon: '/uploads/serviceicon/maintanace.png',
                image: '/uploads/services/Maintenance & Support.png',
                features: ['24/7 Monitoring & Alerting', 'Bug Fixes & Patches', 'Security Updates & Audits', 'Performance Optimization', 'Feature Enhancements'],
                deliverables: ['Monthly Maintenance Reports', 'Uptime & Performance Dashboard', 'Security Audit Summaries', 'Change Logs & Release Notes'],
                process: ['Onboarding & Assessment', 'Monitoring Setup', 'Regular Maintenance Cycles', 'Quarterly Reviews', 'Continuous Improvement'],
                techStack: ['Sentry', 'Datadog', 'PM2', 'Nginx', 'Cloudflare', 'GitHub Actions'],
                benefits: ['Peace of Mind', 'Reduced Downtime', 'Proactive Issue Resolution', 'Always Up-to-Date Software'],
                idealFor: ['Businesses with Live Applications', 'SaaS Platforms', 'E-Commerce Stores', 'Enterprises'],
                cta: 'Get Support',
                seo: {
                    metaTitle: 'Maintenance & Support Services | The Fortune Tech',
                    metaDescription: 'Ongoing application maintenance, 24/7 monitoring, security updates, and performance optimization services.',
                },
                featured: false,
            },
            {
                slug: 'ai-agents-automation',
                title: 'AI Agents & Intelligent Automation',
                tagline: 'Autonomous systems that work for you 24/7',
                description: 'Deploy intelligent AI agents to automate complex workflows, enhance customer support, and streamline operations with autonomous decision-making capabilities.',
                overview: 'We build sophisticated AI agents capable of understanding context, making decisions, and executing tasks autonomously. From customer service bots to complex workflow automation, our agents reduce overhead and improve efficiency.',
                icon: '/uploads/serviceicon/aiagents.png',
                image: '/uploads/services/AI Agents & Intelligent Automation.png',
                features: ['Autonomous Workflows', 'Natural Language Processing', 'Multi-Agent Systems', 'Real-time Decision Making', '24/7 Operation'],
                deliverables: ['Custom AI Agents', 'Integration Documentation', 'Performance Analytics Dashboard', 'Training Data Sets'],
                process: ['Workflow Analysis', 'Agent Design', 'Training & Fine-tuning', 'Integration', 'Monitoring & Optimization'],
                techStack: ['LangChain', 'AutoGPT', 'OpenAI API', 'Python', 'Pinecone', 'Vector Databases'],
                benefits: ['Reduced Operational Costs', '24/7 Availability', 'Consistent Performance', 'Scalable Operations'],
                idealFor: ['Customer Support', 'Data Entry', 'Workflow Management', 'Enterprise Automation'],
                cta: 'Deploy Your Agents',
                seo: {
                    metaTitle: 'AI Agents & Intelligent Automation Services | The Fortune Tech',
                    metaDescription: 'Custom AI agents and intelligent automation solutions to streamline workflows and boost productivity.',
                },
                featured: true,
            },
            {
                slug: 'ai-as-a-service',
                title: 'AI-as-a-Service (AIaaS) Solutions',
                tagline: 'Scalable AI power on demand',
                description: 'Access enterprise-grade artificial intelligence capabilities through flexible, scalable cloud-based services tailored to your specific needs.',
                overview: 'Leverage the power of AI without the heavy infrastructure investment. Our AIaaS solutions provide ready-to-use API endpoints and cloud services for computer vision, NLP, predictive analytics, and more.',
                icon: '/uploads/serviceicon/aiservice.png',
                image: '/uploads/services/AI-as-a-Service (AIaaS) Solutions.png',
                features: ['ML Model Hosting', 'API-First Architecture', 'Scalable Inference', 'Usage-Based Pricing Models', 'Secure Data Processing'],
                deliverables: ['Restful AI APIs', 'Developer SDKs', 'Service Level Agreements', 'API Usage Dashboard'],
                process: ['Requirement Analysis', 'Model Selection/Training', 'API Development', 'Cloud Deployment', 'Maintenance'],
                techStack: ['AWS SageMaker', 'Google Vertex AI', 'Azure AI', 'TensorFlow Serving', 'FastAPI', 'Docker'],
                benefits: ['Lower Upfront Costs', 'Rapid Deployment', 'Scalability', 'Access to State-of-the-Art Models'],
                idealFor: ['SaaS Platforms', 'Mobile Apps', 'Startups', 'Enterprises with Data Teams'],
                cta: 'Get AI Power',
                seo: {
                    metaTitle: 'AI-as-a-Service (AIaaS) Solutions | The Fortune Tech',
                    metaDescription: 'Scalable and secure AI-as-a-Service solutions providing enterprise-grade AI capabilities on demand.',
                },
                featured: false,
            },
            {
                slug: 'generative-ai-development',
                title: 'Generative AI Development Services',
                tagline: 'Create, innovate, and reimagine with GenAI',
                description: 'Harness the creative power of Generative AI to build applications that generate text, images, code, and more with unprecedented quality.',
                overview: 'From custom LLMs to image generation pipelines, we help you build cutting-edge Generative AI applications. Whether you need a content creation tool, a coding assistant, or a personalized recommendation engine, we deliver results.',
                icon: '/uploads/serviceicon/genrativeai.png',
                image: '/uploads/services/Generative AI Development Services.png',
                features: ['Large Language Models (LLMs)', 'Image & Video Generation', 'Fine-tuning & RAG', 'Prompt Engineering', 'Ethical AI Implementation'],
                deliverables: ['Custom GenAI Applications', 'Fine-tuned Models', 'RAG Pipelines', 'Prompt Libraries'],
                process: ['Use Case Definition', 'Data Preparation', 'Model Selection & Tuning', 'Application Development', 'Testing & Safety Rails'],
                techStack: ['Llama 2', 'GPT-4', 'Stability AI', 'Hugging Face', 'LangChain', 'Python'],
                benefits: ['Innovation Leaps', 'Content Scaling', 'Personalized Experiences', 'New Revenue Streams'],
                idealFor: ['Content Creators', 'Marketing Agencies', 'EdTech', 'Creative Industries'],
                cta: 'Build GenAI Apps',
                seo: {
                    metaTitle: 'Generative AI Development Services | The Fortune Tech',
                    metaDescription: 'Expert Generative AI development services for building custom LLM and image generation applications.',
                },
                featured: true,
            },
        ]);
        console.log(`  ✅ Created ${services.length} services`);

        // Seed Portfolio
        console.log('🎨 Creating portfolio items...');
        const portfolios = await Portfolio.create([
            {
                slug: 'ecommerce-platform',
                title: 'E-Commerce Platform',
                category: 'Web Development',
                industry: 'Retail',
                client: { name: 'Fashion Store', location: 'New York, USA' },
                description: 'A full-featured e-commerce platform with real-time inventory management, multi-vendor support, and AI-powered product recommendations.',
                keyFeatures: ['Real-time Inventory', 'Payment Integration', 'Order Management', 'AI Recommendations', 'Multi-vendor Support'],
                techStack: { Frontend: ['React', 'Redux', 'Tailwind CSS'], Backend: ['Node.js', 'Express', 'MongoDB'], DevOps: ['AWS', 'Docker'] },
                metrics: { 'Page Load': '< 2s', 'Uptime': '99.9%', 'Conversion Rate': '+35%', 'Monthly Users': '120K+' },
                timeline: '4 months',
                status: PORTFOLIO_STATUSES.LIVE,
                servicesProvided: ['Web Development', 'UI/UX Design', 'Cloud & DevOps'],
                links: { live: 'https://fashionstore.example.com', caseStudy: 'https://thefortunetech.com/case-studies/ecommerce-platform', github: '' },
                thumbnail: '/uploads/portfolio/E-Commerce Platform.png',
                featured: true,
            },
            {
                slug: 'health-fitness-app',
                title: 'Health & Fitness App',
                category: 'Mobile Development',
                industry: 'Healthcare',
                client: { name: 'FitLife Inc.', location: 'San Francisco, USA' },
                description: 'A comprehensive health tracking mobile application with wearable device integration, personalized workout plans, and nutrition logging.',
                keyFeatures: ['Activity Tracking', 'Nutrition Log', 'Health Insights', 'Wearable Integration', 'Social Challenges'],
                techStack: { Mobile: ['React Native', 'Expo'], Backend: ['Firebase', 'Cloud Functions'], Analytics: ['Google Analytics', 'Mixpanel'] },
                metrics: { 'Downloads': '50K+', 'Rating': '4.8', 'Daily Active Users': '12K', 'Retention Rate': '68%' },
                timeline: '6 months',
                status: PORTFOLIO_STATUSES.LIVE,
                servicesProvided: ['Mobile App Development', 'UI/UX Design', 'API Development & Integration'],
                links: { live: 'https://fitlife.example.com/app', caseStudy: 'https://thefortunetech.com/case-studies/health-app', github: '' },
                thumbnail: '/uploads/portfolio/Health & Fitness Mobile App.png',
                featured: true,
            },
            {
                slug: 'ai-powered-crm',
                title: 'AI-Powered CRM Dashboard',
                category: 'Custom Software',
                industry: 'Finance',
                client: { name: 'FinEdge Solutions', location: 'London, UK' },
                description: 'An intelligent CRM platform with AI-driven lead scoring, automated follow-ups, predictive analytics, and a real-time collaboration dashboard for sales teams.',
                keyFeatures: ['AI Lead Scoring', 'Predictive Analytics', 'Automated Follow-ups', 'Real-time Dashboard', 'Email Integration', 'Role-based Access'],
                techStack: { Frontend: ['Next.js', 'TypeScript', 'Chart.js'], Backend: ['Python', 'FastAPI', 'PostgreSQL'], AI: ['TensorFlow', 'OpenAI API', 'LangChain'] },
                metrics: { 'Lead Conversion': '+45%', 'Response Time': '-60%', 'Sales Efficiency': '+30%', 'Monthly Active Users': '5K+' },
                timeline: '5 months',
                status: PORTFOLIO_STATUSES.COMPLETED,
                servicesProvided: ['Custom Software Development', 'AI Agents & Intelligent Automation', 'UI/UX Design'],
                links: { live: 'https://finedge-crm.example.com', caseStudy: 'https://thefortunetech.com/case-studies/ai-crm', github: 'https://github.com/fortunetech/ai-crm-demo' },
                thumbnail: '/uploads/portfolio/AI-Powered CRM Dashboard.png',
                featured: true,
            },
        ]);
        console.log(`  ✅ Created ${portfolios.length} portfolio items`);

        // Seed Technologies
        console.log('🔧 Creating technology categories from disk...');
        const path = (await import('path')).default;
        const fs = (await import('fs')).default;

        const uploadsDir = path.join(__dirname, '../../public/uploads/technology');
        const technologies: any[] = [];

        // Map directory names to category names
        const categoryMap: { [key: string]: string } = {
            'backend': 'Backend',
            'frontend': 'Frontend',
            'database': 'Database',
            'cloud-devops': 'Cloud & DevOps',
            'mobileapp': 'Mobile App Development',
            'cms': 'CMS',
            'uiux': 'UI/UX Design'
        };

        // Category descriptions
        const categoryDescriptions: { [key: string]: string } = {
            'Backend': 'Server-side technologies and databases',
            'Frontend': 'Modern frontend technologies for building user interfaces',
            'Database': 'Data persistence and management solutions',
            'Cloud & DevOps': 'Cloud infrastructure, deployment, and automation tools',
            'Mobile App Development': 'Native and cross-platform mobile application development',
            'CMS': 'Content Management Systems for dynamic content',
            'UI/UX Design': 'User Interface and User Experience design tools'
        };

        if (fs.existsSync(uploadsDir)) {
            const dirs = fs.readdirSync(uploadsDir).filter(file => fs.statSync(path.join(uploadsDir, file)).isDirectory());

            for (const dir of dirs) {
                const categoryName = categoryMap[dir] || dir.charAt(0).toUpperCase() + dir.slice(1);
                const categoryPath = path.join(uploadsDir, dir);
                const files = fs.readdirSync(categoryPath).filter(file => !file.startsWith('.'));

                const items = files.map(file => {
                    const name = path.parse(file).name
                        .replace(/-/g, ' ')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase()) // Title Case
                        .replace('js', '.js') // Handle 'nodejs' -> 'Node.js'
                        .replace('Js', '.js')
                        .replace('db', 'DB')
                        .replace('sql', 'SQL');

                    return {
                        name: name,
                        icon: `/uploads/technology/${dir}/${file}`,
                        useCases: [],
                        featured: false
                    };
                });

                if (items.length > 0) {
                    const techCategory = await TechnologyCategory.create({
                        slug: dir, // Use directory name as slug
                        category: categoryName,
                        description: categoryDescriptions[categoryName] || `Technologies for ${categoryName}`,
                        items: items
                    });
                    technologies.push(techCategory);
                    console.log(`    Created category: ${categoryName} with ${items.length} items`);
                }
            }
        } else {
            console.log('⚠️ Technology uploads directory not found:', uploadsDir);
        }

        console.log(`  ✅ Created ${technologies.length} technology categories`);

        // Seed Testimonials
        console.log('💬 Creating testimonials...');
        const testimonials = await Testimonial.create([
            {
                slug: 'john-smith-techcorp',
                name: 'John Smith',
                role: 'CEO',
                company: 'TechCorp Solutions',
                industry: 'Technology',
                serviceProvided: 'Web Development',
                projectType: 'E-Commerce Platform',
                rating: 5,
                content: 'The Fortune Tech delivered an exceptional product that exceeded our expectations. Their attention to detail and commitment to quality is unmatched. The e-commerce platform they built boosted our online sales by 40% within the first quarter.',
                metrics: { 'Sales Increase': '+40%', 'Page Load Time': '1.2s', 'Customer Satisfaction': '98%' },
                avatar: '/uploads/testimonials/john-smith-avatar.png',
                thumbnail: '/uploads/testimonials/john-smith-thumbnail.png',
                linkedin: 'https://linkedin.com/in/johnsmith',
                website: 'https://techcorpsolutions.com',
                verified: true,
                featured: true,
            },
            {
                slug: 'sarah-johnson-retailco',
                name: 'Sarah Johnson',
                role: 'CTO',
                company: 'RetailCo',
                industry: 'Retail',
                serviceProvided: 'Mobile App Development',
                projectType: 'Customer-facing Mobile App',
                rating: 5,
                content: 'Working with The Fortune Tech was a game-changer for our business. They transformed our digital presence completely. The mobile app they developed for us has over 50,000 downloads and a 4.8-star rating on the App Store.',
                metrics: { 'App Downloads': '50K+', 'App Store Rating': '4.8', 'User Retention': '72%' },
                avatar: '/uploads/testimonials/sarah-johnson-avatar.png',
                thumbnail: '/uploads/testimonials/sarah-johnson-thumbnail.png',
                linkedin: 'https://linkedin.com/in/sarahjohnson',
                website: 'https://retailco.com',
                verified: true,
                featured: true,
            },
            {
                slug: 'michael-chen-finedge',
                name: 'Michael Chen',
                role: 'VP of Engineering',
                company: 'FinEdge Solutions',
                industry: 'Finance',
                serviceProvided: 'Custom Software Development',
                projectType: 'AI-Powered CRM Dashboard',
                rating: 5,
                content: 'The Fortune Tech team is incredibly talented and professional. They built us a custom AI-powered CRM that revolutionized how our sales team operates. Lead conversion rates jumped 45% and our team\'s efficiency improved dramatically.',
                metrics: { 'Lead Conversion': '+45%', 'Team Efficiency': '+30%', 'ROI': '300%' },
                avatar: '/uploads/testimonials/michael-chen-avatar.png',
                thumbnail: '/uploads/testimonials/michael-chen-thumbnail.png',
                linkedin: 'https://linkedin.com/in/michaelchen',
                website: 'https://finedgesolutions.com',
                verified: true,
                featured: true,
            },
        ]);
        console.log(`  ✅ Created ${testimonials.length} testimonials`);

        // Seed Careers
        console.log('💼 Creating career listings...');
        const careers = await Career.create([
            {
                title: 'Senior Frontend Developer',
                department: 'Engineering',
                location: 'Remote',
                experience: '5+ years',
                type: JOB_TYPES.FULL_TIME,
                description: 'We are looking for a Senior Frontend Developer to join our growing engineering team. You will lead the frontend architecture, mentor junior developers, and work closely with designers and product managers to ship high-quality, performant user interfaces.',
                requirements: [
                    '5+ years of experience with React and modern JavaScript/TypeScript',
                    'Strong proficiency in TypeScript, HTML5, and CSS3',
                    'Experience with state management (Redux, Zustand, or Recoil)',
                    'Familiarity with Next.js and server-side rendering',
                    'Understanding of CI/CD pipelines and testing frameworks (Jest, Cypress)',
                    'Excellent communication and team leadership skills',
                ],
                benefits: [
                    'Competitive salary with annual performance bonuses',
                    'Comprehensive health, dental, and vision insurance',
                    'Fully remote with flexible working hours',
                    'Annual learning & development budget of $2,000',
                    'Paid time off (20 days) + public holidays',
                    'Home office setup allowance',
                ],
                responsibilities: [
                    'Lead frontend architecture decisions and establish coding standards',
                    'Build reusable, accessible, and performant UI components',
                    'Collaborate with designers to translate Figma mockups into pixel-perfect interfaces',
                    'Mentor and code-review junior and mid-level developers',
                    'Optimize application performance and Core Web Vitals',
                    'Participate in sprint planning, retrospectives, and technical discussions',
                ],
                applyLink: 'mailto:careers@thefortunetech.com?subject=Application%20-%20Senior%20Frontend%20Developer',
            },
            {
                title: 'UI/UX Designer',
                department: 'Design',
                location: 'Hybrid',
                experience: '3+ years',
                type: JOB_TYPES.FULL_TIME,
                description: 'Join our design team to craft beautiful, intuitive user experiences for web and mobile products. You will conduct user research, create wireframes, design high-fidelity prototypes, and collaborate closely with developers to ensure design fidelity.',
                requirements: [
                    '3+ years of professional UI/UX design experience',
                    'Expert-level proficiency in Figma and prototyping tools',
                    'Strong portfolio demonstrating user-centered design processes',
                    'Experience conducting user research, usability testing, and A/B testing',
                    'Solid understanding of design systems and component libraries',
                    'Knowledge of accessibility standards (WCAG 2.1)',
                ],
                benefits: [
                    'Creative and collaborative work environment',
                    'Annual learning & conference budget of $1,500',
                    'Flexible working hours with hybrid schedule (3 days office, 2 days remote)',
                    'Health insurance and wellness programs',
                    'Latest design tools and hardware provided',
                    'Career growth and leadership opportunities',
                ],
                responsibilities: [
                    'Conduct user research interviews, surveys, and usability studies',
                    'Create wireframes, user flows, and interactive prototypes in Figma',
                    'Design high-fidelity UI screens for web and mobile platforms',
                    'Build and maintain a comprehensive design system',
                    'Collaborate with developers during implementation to ensure design accuracy',
                    'Present design concepts and rationale to stakeholders',
                ],
                applyLink: 'mailto:careers@thefortunetech.com?subject=Application%20-%20UI%20UX%20Designer',
            },
            {
                title: 'Backend Engineer (Node.js)',
                department: 'Engineering',
                location: 'Remote',
                experience: '3-5 years',
                type: JOB_TYPES.FULL_TIME,
                description: 'We are hiring a Backend Engineer to design, develop, and maintain scalable REST APIs and microservices. You will work on our core platform, optimizing database performance, building integrations, and ensuring high availability of our services.',
                requirements: [
                    '3-5 years of professional experience with Node.js and Express/Fastify',
                    'Strong expertise in TypeScript and modern JavaScript',
                    'Hands-on experience with MongoDB, PostgreSQL, or similar databases',
                    'Familiarity with message queues (RabbitMQ, Redis) and caching strategies',
                    'Understanding of RESTful API design principles and authentication (JWT, OAuth)',
                    'Experience with Docker, CI/CD pipelines, and cloud platforms (AWS/GCP)',
                ],
                benefits: [
                    'Competitive salary with equity/stock options',
                    'Fully remote work with no location restrictions',
                    'Comprehensive health and dental insurance',
                    'Annual tech conference sponsorship',
                    '25 days paid time off + sick leave',
                    'Monthly wellness and internet stipend',
                ],
                responsibilities: [
                    'Design and implement scalable REST APIs and microservices',
                    'Optimize database queries and ensure data integrity',
                    'Integrate third-party APIs (payment gateways, analytics, CRMs)',
                    'Write unit, integration, and end-to-end tests',
                    'Set up monitoring, logging, and alerting for production services',
                    'Participate in architecture reviews and contribute to technical documentation',
                ],
                applyLink: 'mailto:careers@thefortunetech.com?subject=Application%20-%20Backend%20Engineer',
            },
        ]);
        console.log(`  ✅ Created ${careers.length} career listings`);

        // Seed CMS Pages
        console.log('📄 Creating CMS pages...');
        const cmsPages = await CMSPage.create([
            {
                slug: 'about-us',
                title: 'About Us',
                status: CMS_STATUSES.PUBLISHED,
                metaTitle: 'About Us | The Fortune Tech',
                metaDescription: 'Learn about The Fortune Tech and our mission.',
                content: '## About The Fortune Tech\n\nWe are a team of passionate developers and designers dedicated to building exceptional digital products.',
            },
            {
                slug: 'privacy-policy',
                title: 'Privacy Policy',
                status: CMS_STATUSES.PUBLISHED,
                metaTitle: 'Privacy Policy | The Fortune Tech',
                metaDescription: 'Our privacy policy and data protection practices.',
                content: '## Privacy Policy\n\nYour privacy is important to us. This policy explains how we collect, use, and protect your data.',
            },
        ]);
        console.log(`  ✅ Created ${cmsPages.length} CMS pages`);

        // Seed Website Config
        console.log('⚙️  Creating website config...');
        await WebsiteConfig.create({
            site: {
                name: 'Fortune Tech',
                tagline: 'Premium IT Consulting & Development',
                description: 'Transform your business with cutting-edge technology solutions. We craft premium web and mobile experiences that drive growth, engage users, and deliver measurable results.',
                url: 'https://fortunetech.com',
                logo: '/uploads/images/logo.png',
                favicon: '/uploads/images/favicon.ico',
            },
            company: {
                legalName: 'Fortune Tech Solutions Pvt. Ltd.',
                email: 'nishant@thrfortunetech.com',
                phone: '207-599-8005',
                address: {
                    street: '27 Depot Square',
                    city: 'Mechanic Falls',
                    state: 'Maine',
                    postalCode: '04256',
                    country: 'USA',
                },
                businessHours: {
                    weekdays: '9:00 AM - 6:00 PM',
                    saturday: '10:00 AM - 2:00 PM',
                    sunday: 'Closed',
                    timezone: 'EST'
                }
            },
            social: {
                linkedin: 'https://linkedin.com/company/fortunetech',
                facebook: '',
                github: 'https://github.com/fortunetech',
            },
            seo: {
                title: 'Fortune Tech - Premium IT Consulting & Development',
                description: 'Transform your business with cutting-edge technology solutions. We build premium web and mobile experiences that drive growth and deliver results.',
                keywords: [
                    "IT Consulting",
                    "Web Development",
                    "Mobile App Development",
                    "UI/UX Design",
                    "Cloud Solutions",
                    "DevOps",
                    "Software Development",
                    "Next.js",
                    "React",
                    "Node.js"
                ],
                ogImage: '/images/og-image.png',
            },
            features: {
                themeToggle: true,
                smoothScroll: true,
                animations: true,
                newsletter: false,
                blog: false,
                chat: false,
                analytics: {
                    enabled: false,
                    googleAnalyticsId: null,
                    hotjarId: null
                }
            },
        });
        console.log(`  ✅ Created website config`);

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin Login Credentials:');
        console.log(`  Email: admin@thefortunetech.com`);
        console.log(`  Password: Admin@123`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
};

seedData();
