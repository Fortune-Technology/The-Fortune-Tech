/**
 * Database Seed Script
 * Seeds the database with initial data
 */

import mongoose from 'mongoose';
import { env } from '../config/env';
import { User, Service, Portfolio, TechnologyCategory, Testimonial, Career, CMSPage, WebsiteConfig, Blog } from '../models';
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
            Blog.deleteMany({}),
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
                longDescription: '<h2 style="color: var(--accent-start);">Project Background</h2><p>Fashion Store needed a modern, scalable e-commerce platform to replace their legacy system. The old platform struggled with peak traffic during sales events and lacked real-time inventory management capabilities.</p><h3>Our Approach</h3><p>We designed and built a <strong>fully custom e-commerce solution</strong> using <span style="color: #61dafb;">React</span> and <span style="color: #68a063;">Node.js</span>, with a focus on <u>performance</u>, <u>scalability</u>, and user experience. Key decisions included:</p><ul style="padding-left: 20px;"><li>Microservices architecture for independent scaling</li><li>Redis-based caching for blazing-fast page loads</li><li>Real-time inventory sync across multiple warehouses</li><li>AI-powered recommendation engine using collaborative filtering</li></ul><blockquote style="border-left: 4px solid var(--accent-start); padding-left: 1rem; color: #888;">"The team delivered beyond expectations. The system has 0 downtime even during our flash sale events."<br>- John Doe, CTO</blockquote><h3>Results</h3><p>The platform launched on schedule and delivered <strong>35% higher conversion rates</strong> compared to the previous solution, with sub-2-second page load times even during peak traffic of 120K+ monthly users.</p>',
                keyFeatures: ['Real-time Inventory', 'Payment Integration', 'Order Management', 'AI Recommendations', 'Multi-vendor Support'],
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
                longDescription: '<h2 style="color: var(--accent-start);">The Challenge</h2><p>FitLife Inc. wanted to create a <strong>comprehensive health and fitness app</strong> that goes beyond simple step counting. They needed wearable integration, personalized workout plans, nutrition tracking, and social features — all with a beautiful, intuitive interface.</p><h3>Solution Architecture</h3><p>We built a cross-platform mobile app using <strong>React Native</strong> with Expo, backed by Firebase for real-time data sync, authentication, and cloud functions. Below is an example of the query structure for the tracking module:</p><pre class="ql-syntax" spellcheck="false" style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">const fetchUserStats = async (userId) => {\n  const metrics = await db.collection("stats").doc(userId).get();\n  return metrics.data();\n};</pre><p>The app features:</p><ol style="padding-left: 20px;"><li>Seamless integration with Apple Health, Google Fit, and Fitbit APIs</li><li>AI-powered workout plan generator based on user goals and fitness level</li><li>Barcode-scanning nutrition logger with a database of 500K+ foods</li><li>Social challenges and leaderboards for community engagement</li></ol><h3>Impact</h3><p>Within <span style="background-color: #ffeb3b; color: #000;">6 months of launch</span>, the app reached <strong>50K+ downloads</strong> with a 4.8-star App Store rating and 68% 30-day retention rate.</p>',
                keyFeatures: ['Activity Tracking', 'Nutrition Log', 'Health Insights', 'Wearable Integration', 'Social Challenges'],
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
                longDescription: '<h2 style="color: var(--accent-start);">Why This Project?</h2><p>FinEdge Solutions\' sales team was spending <strong style="color: #e53e3e;">60% of their time</strong> on manual lead qualification and follow-ups, leaving little time for actual selling. They needed an intelligent CRM that could automate these tasks and provide actionable insights.</p><h3>What We Built</h3><p>We developed a custom AI-powered CRM dashboard using Next.js, TypeScript, and Python (FastAPI) with integrated machine learning models for:</p><ul style="padding-left: 20px;"><li><strong>Lead Scoring</strong> — ML model trained on historical conversion data to predict lead quality</li><li><strong>Automated Follow-ups</strong> — Smart email sequences triggered by lead behavior patterns</li><li><strong>Predictive Analytics</strong> — Revenue forecasting and pipeline health dashboards</li><li><strong>Real-time Collaboration</strong> — Live activity feed and team performance insights</li></ul><p style="text-align: center;"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard Chart" width="500"></p><h3 style="text-align: right;">Business Impact</h3><p style="text-align: right;">Lead conversion rates jumped <strong>45%</strong>, sales team efficiency improved by <strong>30%</strong>, and the platform delivered a <strong>300% ROI</strong> within the first year of deployment.</p>',
                keyFeatures: ['AI Lead Scoring', 'Predictive Analytics', 'Automated Follow-ups', 'Real-time Dashboard', 'Email Integration', 'Role-based Access'],
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

        // Assign technologyStack references to portfolios (now that technologies are seeded)
        if (technologies.length > 0) {
            console.log('🔗 Linking technology items to portfolios...');
            const allItems = technologies.flatMap((t: any) => t.items);
            const itemIds = allItems.map((i: any) => i._id.toString());

            // E-Commerce: assign first 5 tech items
            if (portfolios[0] && itemIds.length >= 5) {
                await Portfolio.findByIdAndUpdate(portfolios[0]._id, { technologyStack: itemIds.slice(0, 5) });
            }
            // Health App: assign next 5 tech items
            if (portfolios[1] && itemIds.length >= 10) {
                await Portfolio.findByIdAndUpdate(portfolios[1]._id, { technologyStack: itemIds.slice(5, 10) });
            }
            // AI CRM: assign next 5 tech items
            if (portfolios[2] && itemIds.length >= 15) {
                await Portfolio.findByIdAndUpdate(portfolios[2]._id, { technologyStack: itemIds.slice(10, 15) });
            }
            console.log('  ✅ Linked technology items to portfolios');
        }

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
                portfolios: portfolios[0] ? [portfolios[0]._id] : [],
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
                portfolios: portfolios[1] ? [portfolios[1]._id] : [],
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
                portfolios: portfolios[2] ? [portfolios[2]._id] : [],
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
                facebook: 'https://facebook.com/fortunetech',
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

        // Seed Blog Posts
        console.log('📝 Creating blog posts...');
        const blogPosts = await Blog.create([
            {
                title: 'Why Next.js Is the Future of Web Development in 2026',
                slug: 'why-nextjs-future-web-development-2026',
                excerpt: 'Discover why Next.js has become the go-to framework for modern web development with its powerful features like App Router, Server Components, and edge-first architecture.',
                content: `<h2>The Rise of Next.js</h2><p>In the ever-evolving landscape of web development, Next.js has emerged as a dominant framework that bridges the gap between developer experience and end-user performance. Built on top of React, Next.js offers a comprehensive solution for building fast, SEO-friendly, and scalable web applications.</p><h3>Key Features That Set Next.js Apart</h3><p>The App Router introduced in Next.js 13+ revolutionized how developers think about routing and data fetching. With Server Components as the default, applications now ship less JavaScript to the client, resulting in dramatically improved performance.</p><ul><li><strong>Server Components</strong> — Render on the server, reducing client-side bundle size</li><li><strong>Streaming SSR</strong> — Progressive rendering for faster Time to First Byte</li><li><strong>Edge Runtime</strong> — Deploy to the edge for global low-latency responses</li><li><strong>Built-in SEO</strong> — Metadata API makes SEO a first-class citizen</li></ul><h3>Performance Gains</h3><p>Companies that have migrated to Next.js report significant improvements in Core Web Vitals. Our own clients have seen LCP improvements of 40-60% and a measurable boost in search engine rankings after adoption.</p><blockquote>"Next.js allowed us to reduce our time-to-interactive by 50% while simplifying our codebase." — Engineering Lead, Fortune 500 Client</blockquote><h3>When to Choose Next.js</h3><p>Next.js is ideal for content-heavy websites, e-commerce platforms, SaaS dashboards, and any application where SEO and performance are critical. Its flexibility allows you to mix static generation, server-side rendering, and client-side rendering within the same application.</p><p>At The Fortune Tech, we leverage Next.js as our primary frontend framework for most client projects, combining it with our battle-tested Node.js backend to deliver exceptional digital experiences.</p>`,
                featuredImage: '/uploads/blog/blog1.png',
                category: 'Technology',
                tags: ['Next.js', 'React', 'Web Development', 'JavaScript', 'SSR', 'Performance'],
                metaTitle: 'Why Next.js Is the Future of Web Development in 2026',
                metaDescription: 'Explore why Next.js dominates modern web development with Server Components, edge runtime, and unmatched performance.',
                faqSection: [
                    { question: 'What is Next.js?', answer: 'Next.js is a React framework that provides server-side rendering, static site generation, API routes, and many other features out of the box. It simplifies building production-grade React applications.' },
                    { question: 'Is Next.js better than plain React?', answer: 'Next.js builds on top of React by adding routing, SSR, SSG, image optimization, and API routes. For production applications that need SEO and performance, Next.js is generally the better choice.' },
                    { question: 'Can Next.js handle large-scale applications?', answer: 'Absolutely. Companies like Netflix, TikTok, Notion, and Hulu use Next.js in production. Its architecture supports incremental adoption and scales well.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-02-10'),
                schemaType: 'BlogPosting',
            },
            {
                title: 'The Complete Guide to Building AI-Powered Applications',
                slug: 'complete-guide-building-ai-powered-applications',
                excerpt: 'Learn how to integrate AI capabilities into your applications using LLMs, RAG pipelines, and intelligent agents — a practical guide for developers and businesses.',
                content: `<h2>AI Is No Longer Optional</h2><p>The rapid advancement of Large Language Models (LLMs) like GPT-4, Claude, and open-source alternatives has made AI integration accessible to businesses of all sizes. From chatbots and content generation to predictive analytics and process automation, AI is transforming how we build software.</p><h3>Understanding the AI Stack</h3><p>Building an AI-powered application involves several layers:</p><ol><li><strong>Foundation Models</strong> — Choose between commercial APIs (OpenAI, Anthropic) or self-hosted models (Llama, Mistral)</li><li><strong>Retrieval Augmented Generation (RAG)</strong> — Combine LLMs with your proprietary data for accurate, context-aware responses</li><li><strong>Vector Databases</strong> — Store and query embeddings efficiently using Pinecone, Weaviate, or pgvector</li><li><strong>Orchestration</strong> — Use frameworks like LangChain or LlamaIndex to build complex AI workflows</li><li><strong>Observability</strong> — Monitor token usage, latency, and quality with tools like LangSmith</li></ol><h3>Building a RAG Pipeline</h3><p>RAG is the most practical approach for most business applications. It allows you to ground LLM responses in your own data — documentation, knowledge bases, product catalogs, or internal wikis.</p><p>The process involves: chunking your documents, generating embeddings, storing them in a vector database, and retrieving relevant context at query time to augment the LLM prompt.</p><h3>AI Agents: The Next Frontier</h3><p>AI agents go beyond simple question-answering. They can plan, use tools, browse the web, execute code, and complete multi-step tasks autonomously. This opens up possibilities for automating customer support, data analysis, and complex business workflows.</p><p>At The Fortune Tech, our AI engineering team specializes in building custom AI solutions that integrate seamlessly with your existing systems. We help you move from experimentation to production-ready AI applications.</p>`,
                featuredImage: '/uploads/blog/blog2.png',
                category: 'AI',
                tags: ['AI', 'Machine Learning', 'LLM', 'RAG', 'ChatGPT', 'LangChain', 'Automation'],
                metaTitle: 'Complete Guide to Building AI-Powered Applications',
                metaDescription: 'Practical guide to integrating AI into applications using LLMs, RAG pipelines, vector databases, and intelligent agents.',
                faqSection: [
                    { question: 'What is RAG in AI?', answer: 'RAG (Retrieval Augmented Generation) is a technique that enhances LLM responses by retrieving relevant context from your own data sources before generating an answer, resulting in more accurate and grounded outputs.' },
                    { question: 'How much does it cost to build an AI application?', answer: 'Costs vary widely based on complexity. A simple chatbot can be built for a few thousand dollars, while a full-featured AI platform with custom models can range from $20K to $100K+. We offer solutions at every budget level.' },
                    { question: 'Do I need my own AI model?', answer: 'Most businesses do not need to train their own models. Using commercial APIs (like OpenAI or Anthropic) combined with RAG is usually more cost-effective and produces excellent results.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-02-08'),
                schemaType: 'BlogPosting',
            },
            {
                title: '10 UI/UX Design Principles Every Developer Should Know',
                slug: '10-ui-ux-design-principles-developers-should-know',
                excerpt: 'Great software is not just about code — it is about creating experiences that users love. Master these 10 essential UI/UX principles to build better products.',
                content: `<h2>Design Meets Engineering</h2><p>As a developer, understanding UI/UX principles is no longer optional. The best products are built by teams where developers and designers share a common language. Here are 10 principles that will elevate your work.</p><h3>1. Consistency Is King</h3><p>Use consistent patterns, colors, spacing, and typography throughout your application. Design systems like Material Design, Ant Design, or your own custom system help enforce consistency at scale.</p><h3>2. The 60-30-10 Color Rule</h3><p>Apply your dominant color to 60% of the interface, secondary color to 30%, and accent color to 10%. This creates visual harmony and guides the user's eye naturally.</p><h3>3. Whitespace Is Not Wasted Space</h3><p>Generous whitespace (or "negative space") improves readability, reduces cognitive load, and makes interfaces feel premium. Don't be afraid of open space.</p><h3>4. Progressive Disclosure</h3><p>Show only what the user needs at each step. Hide complexity behind expandable sections, tooltips, or multi-step flows. This reduces overwhelm and improves task completion rates.</p><h3>5. Feedback and Response</h3><p>Every user action should have a visible response — loading spinners, success messages, hover effects, and error states. Silence creates uncertainty.</p><h3>6. Accessibility First</h3><p>Design for all users. Use proper contrast ratios (WCAG AA minimum), semantic HTML, keyboard navigation, and screen reader support. Accessibility isn't an afterthought — it's a requirement.</p><h3>7. Mobile-First Design</h3><p>Start designing for the smallest screen and progressively enhance. This forces you to prioritize content and functionality, resulting in cleaner designs at all breakpoints.</p><h3>8. Typography Hierarchy</h3><p>Establish a clear hierarchical system with distinct sizes and weights for headings, subheadings, body text, and captions. Good typography makes content scannable.</p><h3>9. Reduce Cognitive Load</h3><p>Group related items, use familiar patterns, limit choices (Hick's Law), and provide sensible defaults. Users should think about their task, not your interface.</p><h3>10. Test with Real Users</h3><p>No amount of theory replaces real user testing. Conduct usability tests early and often. Even 5 users can uncover 80% of usability issues.</p><h3>Conclusion</h3><p>Great design is invisible — users shouldn't have to think about how to use your product. By internalizing these principles, you'll build software that's not only functional but delightful to use.</p>`,
                featuredImage: '/uploads/blog/blog3.png',
                category: 'Design',
                tags: ['UI/UX', 'Design', 'User Experience', 'Frontend', 'Accessibility', 'Web Design'],
                metaTitle: '10 UI/UX Design Principles Every Developer Should Know',
                metaDescription: 'Essential UI/UX design principles for developers to build better, more user-friendly products.',
                faqSection: [
                    { question: 'What is the difference between UI and UX?', answer: 'UI (User Interface) refers to the visual elements — buttons, layouts, colors, typography. UX (User Experience) is the overall experience a user has, including usability, accessibility, and satisfaction. UI is a subset of UX.' },
                    { question: 'Do developers need to learn design?', answer: 'Yes, at least the fundamentals. Understanding design principles helps developers make better implementation decisions, communicate effectively with designers, and create polished products even without a dedicated designer.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-02-05'),
                schemaType: 'BlogPosting',
            },
            {
                title: 'How to Optimize Your Website for Core Web Vitals in 2026',
                slug: 'optimize-website-core-web-vitals-2026',
                excerpt: 'Core Web Vitals directly impact your Google search rankings. Learn actionable strategies to improve LCP, INP, and CLS for better SEO and user experience.',
                content: `<h2>Core Web Vitals Matter More Than Ever</h2><p>Google's page experience signals continue to evolve, and Core Web Vitals remain a critical ranking factor. In 2026, the three metrics you need to optimize are Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).</p><h3>Largest Contentful Paint (LCP)</h3><p>LCP measures the time it takes for the largest visible content element to render. Target: under 2.5 seconds.</p><p><strong>Optimization strategies:</strong></p><ul><li>Use a CDN for static assets and images</li><li>Implement responsive images with <code>srcset</code> and <code>sizes</code></li><li>Preload critical resources with <code>&lt;link rel="preload"&gt;</code></li><li>Optimize server response time (TTFB under 800ms)</li><li>Use Next.js Image component for automatic optimization</li></ul><h3>Interaction to Next Paint (INP)</h3><p>INP replaced First Input Delay (FID) and measures the responsiveness of all user interactions throughout the page lifecycle. Target: under 200ms.</p><p><strong>Optimization strategies:</strong></p><ul><li>Break up long JavaScript tasks using <code>requestIdleCallback</code> or <code>scheduler.yield()</code></li><li>Defer non-critical JavaScript with <code>async</code> or <code>defer</code></li><li>Use Web Workers for heavy computations</li><li>Minimize main thread work and reduce DOM size</li></ul><h3>Cumulative Layout Shift (CLS)</h3><p>CLS measures visual stability — unexpected layout shifts annoy users. Target: under 0.1.</p><p><strong>Optimization strategies:</strong></p><ul><li>Always set explicit <code>width</code> and <code>height</code> on images and videos</li><li>Avoid dynamically injecting content above existing content</li><li>Use CSS <code>contain</code> property for complex layouts</li><li>Reserve space for ads and embeds</li></ul><h3>Measuring Your Performance</h3><p>Use these tools to audit and monitor:</p><ul><li><strong>Google PageSpeed Insights</strong> — Real-world data from Chrome User Experience Report</li><li><strong>Lighthouse</strong> — Lab-based auditing in Chrome DevTools</li><li><strong>Web Vitals Extension</strong> — Real-time CWV overlay in your browser</li></ul><p>At The Fortune Tech, performance optimization is baked into our development process. We regularly audit all client projects against Core Web Vitals benchmarks and ensure production sites meet or exceed Google's recommended thresholds.</p>`,
                featuredImage: '/uploads/blog/blog4.png',
                category: 'SEO',
                tags: ['SEO', 'Core Web Vitals', 'Performance', 'Google', 'Web Optimization', 'LCP', 'INP'],
                metaTitle: 'How to Optimize Your Website for Core Web Vitals in 2026',
                metaDescription: 'Actionable strategies to improve LCP, INP, and CLS scores for better Google rankings and user experience.',
                faqSection: [
                    { question: 'What are Core Web Vitals?', answer: 'Core Web Vitals are a set of standardized metrics from Google that measure real-world user experience for loading performance (LCP), interactivity (INP), and visual stability (CLS). They are used as ranking signals in Google Search.' },
                    { question: 'How do Core Web Vitals affect SEO?', answer: 'Core Web Vitals are a confirmed Google ranking factor. Pages that meet the recommended thresholds have a ranking advantage over pages that do not. They also impact user engagement metrics like bounce rate and session duration.' },
                    { question: 'What replaced FID?', answer: 'Interaction to Next Paint (INP) replaced First Input Delay (FID) as a Core Web Vital in March 2024. INP measures the responsiveness of all interactions throughout the page lifecycle, not just the first one.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-01-28'),
                schemaType: 'BlogPosting',
            },
            {
                title: 'Choosing the Right Tech Stack for Your Startup in 2026',
                slug: 'choosing-right-tech-stack-startup-2026',
                excerpt: 'Your technology choices can make or break your startup. Here is a comprehensive guide to selecting the right tech stack based on your product, team, and growth stage.',
                content: `<h2>The Tech Stack Decision</h2><p>For startups, choosing the right tech stack is one of the most consequential decisions you'll make. It affects development speed, hiring, scalability, and long-term maintenance costs. Let's break down the key considerations.</p><h3>Frontend: React vs Vue vs Svelte</h3><p><strong>React</strong> remains the safest choice in 2026. With the massive ecosystem, Next.js integration, and the largest talent pool, React is the pragmatic choice for most startups.</p><p><strong>Vue</strong> offers a gentler learning curve and excellent documentation. It's great for smaller teams priorities developer happiness.</p><p><strong>Svelte/SvelteKit</strong> compiles away the framework at build time, resulting in smaller bundles. Excellent choice for performance-critical applications, though the talent pool is smaller.</p><h3>Backend: Node.js vs Python vs Go</h3><p><strong>Node.js (TypeScript)</strong> — Full-stack JavaScript means shared code between frontend and backend. Express, Fastify, or NestJS are mature choices. Best when your team is JavaScript-first.</p><p><strong>Python</strong> — The go-to for AI/ML-heavy applications. FastAPI and Django offer excellent developer experience. Choose Python if data science or AI is core to your product.</p><p><strong>Go</strong> — When raw performance and concurrency matter most. Excellent for microservices, APIs, and infrastructure tooling. Smaller ecosystem but extremely efficient.</p><h3>Database: SQL vs NoSQL</h3><p><strong>PostgreSQL</strong> — The Swiss Army knife of databases. Supports JSON, full-text search, and scales well. Default choice for most structured data.</p><p><strong>MongoDB</strong> — Flexible schema, fast iteration, great for prototyping. Choose when your data model is evolving rapidly or is inherently document-oriented.</p><h3>Our Recommendation for Most Startups</h3><p>For 80% of startups, we recommend: <strong>Next.js + TypeScript + Node.js/Express + MongoDB/PostgreSQL</strong>. This stack offers the best balance of development speed, hiring availability, and scalability.</p><p>At The Fortune Tech, we help startups make informed technology decisions and build their MVP in record time. Our team has delivered 50+ projects across various tech stacks.</p>`,
                featuredImage: '/uploads/blog/blog5.png',
                category: 'Technology',
                tags: ['Startup', 'Tech Stack', 'React', 'Node.js', 'Python', 'Database', 'Architecture'],
                metaTitle: 'Choosing the Right Tech Stack for Your Startup in 2026',
                metaDescription: 'Comprehensive guide to selecting the right tech stack for your startup based on product needs, team skills, and growth plans.',
                faqSection: [
                    { question: 'What is the best tech stack for a startup?', answer: 'For most startups, we recommend Next.js + TypeScript for the frontend and Node.js with Express/Fastify for the backend, paired with either MongoDB or PostgreSQL. This provides the best balance of development speed, talent availability, and scalability.' },
                    { question: 'Should I use a monolith or microservices?', answer: 'Start with a monolith. Microservices add significant operational complexity that most early-stage startups cannot afford. You can always extract services later when you have clear domain boundaries and dedicated DevOps resources.' },
                    { question: 'How important is TypeScript?', answer: 'Very important. TypeScript catches bugs at compile time, improves IDE support, makes refactoring safer, and serves as living documentation. The initial learning curve pays dividends as your codebase grows.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-01-20'),
                schemaType: 'BlogPosting',
            },
            {
                title: 'Cloud Cost Optimization: 7 Proven Strategies to Cut Your AWS Bill by 40%',
                slug: 'cloud-cost-optimization-aws-strategies-2026',
                excerpt: 'Overspending on cloud infrastructure is a common problem. Learn 7 battle-tested strategies to significantly reduce your AWS, Azure, or GCP costs without sacrificing performance.',
                content: `<h2>The Cloud Cost Problem</h2><p>Cloud computing offers incredible flexibility with its pay-as-you-go model, but without proper management, costs can spiral quickly. Research shows that the average organization wastes 30-35% of its cloud spend. Here are 7 proven strategies we use to help our clients cut costs.</p><h3>1. Right-Size Your Instances</h3><p>Most workloads run on oversized instances. Use AWS Compute Optimizer or similar tools to analyze actual CPU, memory, and network utilization. Downsizing from a c5.2xlarge to a c5.xlarge can save 50% on that instance — often with no performance impact.</p><h3>2. Use Reserved Instances and Savings Plans</h3><p>If you have predictable workloads, commit to 1-year or 3-year Reserved Instances (RIs) or Savings Plans. You can save 30-60% over on-demand pricing. Start with convertible RIs if you want flexibility.</p><h3>3. Implement Auto-Scaling</h3><p>Don't run peak capacity 24/7. Configure auto-scaling to match demand. For development and staging environments, schedule them to shut down outside business hours — this alone can save 60-70% on non-production costs.</p><h3>4. Optimize Storage</h3><p>Move infrequently accessed data to cheaper storage tiers: S3 Infrequent Access, S3 Glacier, or Glacier Deep Archive. Implement lifecycle policies to automate transitions and clean up unused EBS volumes, snapshots, and AMIs.</p><h3>5. Leverage Spot Instances</h3><p>For fault-tolerant, flexible workloads (batch processing, CI/CD, development), use Spot Instances at 60-90% discount. Combine with on-demand capacity for critical services using mixed instance policies.</p><h3>6. Monitor and Set Budgets</h3><p>Set up AWS Budgets with alerts at 50%, 75%, and 90% thresholds. Use AWS Cost Explorer to identify trends and anomalies. Enable cost allocation tags on all resources to track spending by team, project, or environment.</p><h3>7. Review Architecture</h3><p>Sometimes the biggest savings come from architectural changes: migrating from EC2 to serverless (Lambda), using managed services instead of self-managed ones, or consolidating databases. A quarterly architecture review focused on cost can surface significant savings.</p><h3>The Bottom Line</h3><p>Cloud cost optimization is an ongoing process, not a one-time exercise. At The Fortune Tech, our DevOps team conducts comprehensive cloud audits and helps clients implement these strategies, typically achieving 30-40% cost reduction within the first quarter.</p>`,
                featuredImage: '/uploads/blog/blog6.png',
                category: 'Cloud & DevOps',
                tags: ['Cloud', 'AWS', 'DevOps', 'Cost Optimization', 'Infrastructure', 'Azure', 'GCP'],
                metaTitle: 'Cloud Cost Optimization: 7 Strategies to Cut AWS Bill by 40%',
                metaDescription: 'Battle-tested strategies to reduce cloud infrastructure costs by 30-40% on AWS, Azure, or GCP without sacrificing performance.',
                faqSection: [
                    { question: 'How much can I save on my cloud bill?', answer: 'Most organizations can reduce their cloud spending by 30-40% through right-sizing, reserved instances, storage optimization, and architectural improvements. Some clients have achieved savings of over 50%.' },
                    { question: 'Is serverless always cheaper?', answer: 'Not always. Serverless (like AWS Lambda) is cost-effective for sporadic, event-driven workloads. For consistently high-traffic workloads, traditional compute (EC2, ECS) can be more cost-effective. The break-even point depends on your specific usage patterns.' },
                    { question: 'How often should I review cloud costs?', answer: 'We recommend monthly cost reviews using AWS Cost Explorer or similar tools, with a more thorough quarterly architecture review focused on optimization opportunities.' },
                ],
                author: 'The Fortune Tech Team',
                status: 'published',
                publishedAt: new Date('2026-01-15'),
                schemaType: 'BlogPosting',
            },
        ]);
        console.log(`  ✅ Created ${blogPosts.length} blog posts`);

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
