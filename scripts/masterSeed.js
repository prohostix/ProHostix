import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import Blog from '../lib/models/Blog.js';
import Service from '../lib/models/Service.js';
import Solution from '../lib/models/Solution.js';
import CaseStudy from '../lib/models/CaseStudy.js';
import Leadership from '../lib/models/Leadership.js';
import PageContent from '../lib/models/PageContent.js';
import HeroImage from '../lib/models/HeroImage.js';
import Navigation from '../lib/models/Navigation.js';
import Settings from '../lib/models/Settings.js';
import User from '../lib/models/User.js';
import Enquiry from '../lib/models/Enquiry.js';
import JobApplication from '../lib/models/JobApplication.js';
import Subscriber from '../lib/models/Subscriber.js';
import SocialLink from '../lib/models/SocialLink.js';
import SeoMetadata from '../lib/models/SeoMetadata.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteSettings = {
    companyName: "ProHostix",
    brandWordmarkPart1: "Pro",
    brandWordmarkPart2: "Hostix",
    logoLetter: "P",
    contactEmail: "hello@prohostix.com",
    contactPhone: "+1 (555) 000-0000",
    address: "Global Tech Hub, Suite 100",
    socialLinks: {
        x: "https://x.com/prohostix",
        instagram: "https://instagram.com/prohostix",
        facebook: "https://facebook.com/prohostix"
    }
};

const navItems = [
    { label: "Home", path: "/", icon: "LayoutGrid", order: 1 },
    { label: "Solutions", path: "/solutions", icon: "Briefcase", order: 2 },
    { label: "Services", path: "/services", icon: "Puzzle", order: 3 },
    { label: "Case Studies", path: "/case-studies", icon: "FolderKanban", order: 4 },
    { label: "Company", path: "/company", icon: "Building2", order: 5 },
    { label: "Blog", path: "/blog", icon: "BookOpenText", order: 6 }
];

const blogs = [
    {
        title: "Scaling PostgreSQL to 1 Billion Rows",
        excerpt: "Advanced indexing techniques and partitioning strategies for high-velocity transactional databases.",
        readTime: "8 min read",
        category: "Architecture",
        slug: "scaling-postgresql-billion-rows",
        image: "/architecture-viz.png",
        content: "As systems scale towards a billion rows, standard indexing and query patterns begin to degrade. This deep dive explores the shift from monolithic database architectures to partitioned, horizontally scalable strategies.\n\nKey areas explored include:\n- Native Declarative Partitioning in PostgreSQL 12+.\n- BRIN Indexing for massive datasets where traditional B-Trees become too large for memory.\n- The role of Citus for distributed PostgreSQL workloads.\n\nWe provide benchmarks comparing sequential scans vs. partitioned lookups, demonstrating a 40x improvement in query latency for time-series data clusters.",
        published: true,
        author: "Alex V."
    },
    {
        title: "The Death of Monoliths: Microservices Patterns",
        excerpt: "When to split your services and how to manage the complexity of distributed transactions.",
        readTime: "12 min read",
        category: "Architecture",
        slug: "monoliths-to-microservices",
        image: "/web-arch.png",
        content: "Microservices are often marketed as a silver bullet, but the transition from a monolith is fraught with architectural pitfalls. This article outlines the 'Strangler Fig' pattern for incremental migration and explores the trade-offs of runtime complexity.\n\nTopics include:\n- Service boundary discovery using Domain Driven Design (DDD).\n- Synchronous vs. Asynchronous communication (REST vs. gRPC vs. Message Brokers).\n- The Saga Pattern for managing distributed transactions without 2PC (Two Phase Commit).",
        published: true,
        author: "Alex V."
    },
    {
        title: "AI in ERP: Beyond the Hype",
        excerpt: "Practical applications of machine learning in resource planning, from demand forecasting to anomaly detection.",
        readTime: "6 min read",
        category: "ERP Systems",
        slug: "ai-in-erp",
        image: "/coding-blueprint.png",
        content: "Enterprise Resource Planning (ERP) is being redefined by AI. We look past the generative AI hype to focus on predictive analytics that provide real-world ROI.\n\nArchitecture insights:\n- Integrating TensorFlow models directly into ERP middleware.\n- Real-time inventory optimization using Reinforcement Learning.\n- Automated fraud detection in financial sub-ledgers using Graph Neural Networks.",
        published: true,
        author: "Sarah J."
    },
    {
        title: "Zero-Downtime Deployments with Kubernetes",
        excerpt: "A deep dive into rolling updates, blue-green deployments, and canary releases in production.",
        readTime: "10 min read",
        category: "Cloud & DevOps",
        slug: "kubernetes-deployments",
        image: "/cloud-intel.png",
        content: "Modern engineering requires that production systems never sleep. This technical guide breaks down the Kubernetes Deployment object and how to configure it for truly zero-downtime releases.\n\nAnalysis includes:\n- Readiness and Liveness probes: Tuning for stability.\n- Custom Resource Definitions (CRDs) for advanced traffic splitting.\n- Using Istio Service Mesh for fine-grained Canary releases with weight-based routing.",
        published: true,
        author: "Marcus T."
    },
    {
        title: "Designing for Resilience: Circuit Breakers",
        excerpt: "Implementing fault tolerance patterns to prevent cascading system failures.",
        readTime: "7 min read",
        category: "Product Engineering",
        slug: "circuit-breakers-pattern",
        image: "/cognitive-design.png",
        content: "In a distributed system, failure is inevitable. The Circuit Breaker pattern is the primary defense against cascading failures. We examine the 'Open', 'Closed', and 'Half-Open' states of a circuit and how to implement them in high-concurrency environments.\n\nWe also compare libraries like Resilience4j and Hystrix, providing a Go implementation for a custom interceptor-based circuit breaker.",
        published: true,
        author: "Alex V."
    }
];

const services = [
    {
        title: "Web Applications",
        slug: "web-development",
        description: "Scalable, high-performance web systems built for growth.",
        longDescription: "We engineer robust, scalable web ecosystems that drive business growth. From complex enterprise dashboards to high-traffic consumer portals, our architectures are built for performance, security, and long-term maintainability.",
        deliverables: ["Modern Frameworks", "Secure Backends", "API Integration"],
        outcome: "Systems that scale effortlessly with your business.",
        illustration: "/web-arch.png",
        useCases: ["SaaS Product MVP Development", "Enterprise Admin Portals", "Customer-Facing Dashboards", "E-commerce Platforms"],
        capabilities: [
            { title: "Frontend Architecture", description: "Responsive, accessible, and performant UIs using React and Next.js." },
            { title: "Backend Systems", description: "Secure, scalable APIs and microservices handling complex business logic." },
            { title: "System Integration", description: "Seamless connection with third-party tools like CRMs, ERPs, and payment gateways." }
        ],
        detailedProcess: [
            { title: "Discovery", description: "Mapping requirements to technical specifications and user flows." },
            { title: "Architecture", description: "Designing scalable system patterns and database schemas." },
            { title: "Development", description: "Agile sprints with continuous integration and deployment." },
            { title: "Testing & QA", description: "Rigorous unit, integration, and end-to-end testing." }
        ],
        outcomes: ["50% faster load times", "Enterprise-grade security compliance", "Seamless scalability to millions of users"],
        relatedServices: ["mobile-development", "cloud-devops", "ui-ux-design"]
    },
    {
        title: "Mobile Apps",
        slug: "mobile-development",
        description: "Native-grade experiences for iOS and Android.",
        longDescription: "Reach your users wherever they are with intuitive, high-performance mobile applications. We build native and cross-platform solutions that deliver smooth, engaging experiences on both iOS and Android.",
        deliverables: ["iOS & Android", "Cross-Platform", "App Store Ready"],
        outcome: "Captivating users on every device.",
        illustration: "/neural-mobile.jpg",
        useCases: ["On-Demand Service Apps", "E-commerce & Retail Apps", "Internal Workforce Tools", "Social & Community Platforms"],
        capabilities: [
            { title: "Cross-Platform Development", description: "Efficient codebase sharing using Flutter and React Native without compromising quality." },
            { title: "Native Performance", description: "Optimized rendering and native module integration for complex features." },
            { title: "Offline Functionality", description: "Robust data synchronization for uninterrupted usage in low-connectivity areas." }
        ],
        detailedProcess: [
            { title: "Concept & Wireframing", description: "Visualizing the app flow and user interaction patterns." },
            { title: "UI/UX Design", description: "Creating pixel-perfect interfaces tailored for touch interactions." },
            { title: "App Development", description: "Building the core logic and integrating device features." },
            { title: "App Store Launch", description: "Handling submission, review, and public release processes." }
        ],
        outcomes: ["4.8+ average app store ratings", "Unified codebase reducing maintenance by 40%", "High user retention rates"],
        relatedServices: ["web-development", "ui-ux-design"]
    },
    {
        title: "ERP Systems",
        slug: "erp-development",
        description: "Tailored engines to streamline complex business operations.",
        longDescription: "Eliminate improved improved fragmented workflows with custom Enterprise Resource Planning (ERP) systems. We build centralized platforms that unify your operations, finance, HR, and supply chain data into a single source of truth.",
        deliverables: ["Custom Modules", "Process Automation", "Data Migration"],
        outcome: "Unified operations. Real-time visibility.",
        illustration: "/software-illustration.jpg",
        useCases: ["Inventory & Supply Chain Management", "Human Resources & Payroll", "Financial Reporting & Analytics", "Customer Relationship Management (CRM)"],
        capabilities: [
            { title: "Custom Module Development", description: "Features built exactly for your unique business workflows, not generic templates." },
            { title: "Data Migration & Clean-up", description: "Securely transferring legacy data to modern, structured formats." },
            { title: "Role-Based Access Control", description: "Granular permission settings to ensure data security and compliance." }
        ],
        detailedProcess: [
            { title: "Business Analysis", description: "Deep dive into your operational bottlenecks and data flows." },
            { title: "System Blueprinting", description: "Designing the module architecture and integration points." },
            { title: "Iterative Development", description: "Building and testing modules in phases to minimize disruption." },
            { title: "Training & Handover", description: "Empowering your team with comprehensive training and documentation." }
        ],
        outcomes: ["30% reduction in operational costs", "Real-time visibility into business KPIs", "Automated compliance reporting"],
        relatedServices: ["web-development", "cloud-devops", "maintenance-support"]
    },
    {
        title: "UI/UX Design",
        slug: "ui-ux-design",
        description: "Intuitive interfaces that drive user engagement.",
        longDescription: "Great software starts with great design. We combine aesthetic excellence with deep user empathy to create intuitive, engaging interfaces that solve real problems and delight users.",
        deliverables: ["Design Systems", "Prototyping", "User Research"],
        outcome: "Products users love and stick with.",
        illustration: "/cognitive-design.png",
        useCases: ["Product Redesigns", "New Product Conceptualization", "Design System Creation", "Usability Audits"],
        capabilities: [
            { title: "User Research & Testing", description: "Validating assumptions with real user data and feedback loops." },
            { title: "Interaction Design", description: "Crafting meaningful transitions and micro-interactions." },
            { title: "Design Systems", description: "Building scalable component libraries for consistent branding." }
        ],
        detailedProcess: [
            { title: "Empathize & Define", description: "Understanding user needs and defining the core problem." },
            { title: "Ideate & Wireframe", description: "Rapid experimentation with low-fidelity layouts." },
            { title: "Prototype & Test", description: "Validating flows with interactive prototypes." },
            { title: "Visual Polish", description: "Applying high-fidelity visual design and branding." }
        ],
        outcomes: ["Increased conversion rates", "Reduced user churn", "Faster development with design tokens"],
        relatedServices: ["web-development", "mobile-development"]
    },
    {
        title: "Cloud & DevOps",
        slug: "cloud-devops",
        description: "Resilient infrastructure for automated, reliable deployment.",
        longDescription: "Scale confidently with robust cloud infrastructure and automated DevOps pipelines. We ensure your systems are resilient, secure, and capable of handling massive traffic spikes without manual intervention.",
        deliverables: ["AWS / Azure", "CI/CD Pipelines", "Auto-Scaling"],
        outcome: "Zero downtime. Maximum velocity.",
        illustration: "/cloud-intel.png",
        useCases: ["Cloud Migration", "Kubernetes Orchestration", "CI/CD Pipeline Automation", "Disaster Recovery Planning"],
        capabilities: [
            { title: "Infrastructure as Code", description: "Reproducible, version-controlled infrastructure utilizing Terraform or Pulumi." },
            { title: "Continuous Integration", description: "Automated testing and build processes to catch issues early." },
            { title: "Monitoring & Alerting", description: "Proactive observability with Datadog, Prometheus, or Grafana." }
        ],
        detailedProcess: [
            { title: "Assessment", description: "Reviewing current infrastructure and identifying bottlenecks." },
            { title: "Architecture Design", description: "Designing a cloud-native, scalable topology." },
            { title: "Implementation", description: "Setting up VPCs, clusters, and pipelines." },
            { title: "Optimization", description: "Fine-tuning for cost-efficiency and performance." }
        ],
        outcomes: ["99.99% uptime reliability", "Deployments in minutes, not hours", "50% reduction in cloud costs"],
        relatedServices: ["web-development", "maintenance-support"]
    },
    {
        title: "Maintenance",
        slug: "maintenance-support",
        description: "24/7 security and performance optimization.",
        longDescription: "Software is living; it needs care to thrive. Our dedicated support teams provide 24/7 monitoring, security patches, and performance optimization to keep your critical systems running smoothly.",
        deliverables: ["Security Audits", "Performance Tuning", "24/7 Support"],
        outcome: "Stability you can count on, always.",
        illustration: "/tech-cube.jpg",
        useCases: ["Legacy System Support", "Security Compliance Audits", "Performance Optimization", "On-Call Incident Response"],
        capabilities: [
            { title: "Proactive Monitoring", description: "Detecting anomalies before they impact end-users." },
            { title: "Security Patching", description: "Keeping dependencies up-to-date and secure." },
            { title: "Database Optimization", description: "Tuning queries and indexing for sustained performance." }
        ],
        detailedProcess: [
            { title: "Onboarding", description: "Setting up access, monitoring tools, and escalation paths." },
            { title: "Baseline Audit", description: "Identifying immediate risks and performance gaps." },
            { title: "Routine Maintenance", description: "Scheduled updates and health checks." },
            { title: "Emergency Response", description: "Rapid resolution for critical incidents." }
        ],
        outcomes: ["Extended software lifespan", "Compliance with industry standards", "Peace of mind for stakeholders"],
        relatedServices: ["erp-development", "cloud-devops"]
    }
];

const solutions = [
    {
        title: "CRM Solutions",
        slug: "crm-solutions",
        description: "Unify customer data, automate interactions, and drive sales with our intelligent, scalable CRM platform.",
        problemSolved: "Data silos and fragmented customer insights.",
        targetAudience: "Sales and Support teams seeking unified views.",
        coreCapabilities: ["Contact Management", "Pipeline Automation", "Email Integration", "AI Insights"],
        outcome: "360-degree customer view and increased conversions.",
        tags: ["CRM", "Sales", "Automation"],
        cta: "Explore CRM Platform",
        illustration: "/project_dashboard_preview_1770603074238.jpg",
        icon: "Database",
        link: "/solutions/crm",
        projectLink: {
            label: "View Live Demo",
            url: "https://crm-demo.prohostix.com"
        }
    },
    {
        title: "ERP Systems",
        slug: "erp-systems",
        description: "Modular, scalable ERP architectures designed for seamless operations, finance, HR, and CRM integration.",
        problemSolved: "Disparate systems and manual data entry.",
        targetAudience: "Mid-to-large enterprises seeking unified operations.",
        coreCapabilities: ["Finance Management", "HR Automation", "Supply Chain Optimization", "CRM Integration"],
        outcome: "Unified, real-time business insights.",
        tags: ["Finance", "HR", "Inventory", "CRM"],
        cta: "Explore ERP Systems",
        illustration: "/software_solution_visual.jpg",
        icon: "Layers",
        link: "/solutions/erp",
        projectLink: {
            label: "View Live Demo",
            url: "https://erp-demo.prohostix.com"
        }
    },
    {
        title: "Business Automation",
        slug: "business-automation",
        description: "End-to-end workflow automation, intelligent data pipelines, and system orchestration to reduce manual overhead.",
        problemSolved: "Time-consuming, error-prone manual tasks.",
        targetAudience: "Operations-heavy businesses seeking efficiency.",
        coreCapabilities: ["Process Orchestration", "Data Extraction", "Automated Reporting", "Intelligent Routing"],
        outcome: "Reduced operational costs and errors.",
        tags: ["Automation", "AI", "Efficiency"],
        cta: "Automate Workflows",
        illustration: "/machine-intel.png",
        icon: "Workflow",
        link: "/lets-talk"
    },
    {
        title: "Custom Software",
        slug: "custom-software",
        description: "Tailored software solutions built from the ground up to align perfectly with your unique business logic and goals.",
        problemSolved: "Generic software limitations and inflexible workflows.",
        targetAudience: "Businesses with unique or complex processes.",
        coreCapabilities: ["Custom Logic Implementation", "Legacy System Integration", "Role-Based Access Control", "Scalable Architecture"],
        outcome: "Competitive advantage through bespoke technology.",
        tags: ["Custom Logic", "Security", "Scalability"],
        cta: "Build Custom Software",
        illustration: "/coding-blueprint.png",
        icon: "Code2",
        link: "/lets-talk"
    },
    {
        title: "SaaS Platforms",
        slug: "saas-platforms",
        description: "Multi-tenant, cloud-native SaaS products engineered for rapid scaling and recurring revenue models.",
        problemSolved: "Scaling limitations and tenant isolation challenges.",
        targetAudience: "Startups and enterprises launching digital products.",
        coreCapabilities: ["Multi-Tenancy", "Subscription Management", "API-First Design", "Global CDN"],
        outcome: "Rapid market entry and scalable growth.",
        tags: ["SaaS", "Cloud", "Subscription"],
        cta: "Launch SaaS Product",
        illustration: "/machine-intel.png",
        icon: "Cloud",
        link: "/lets-talk"
    },
    {
        title: "Enterprise Applications",
        slug: "enterprise-applications",
        description: "Mission-critical systems designed for high availability, fault tolerance, and massive transaction volumes.",
        problemSolved: "System downtime and performance bottlenecks.",
        targetAudience: "Critical infrastructure and finance sectors.",
        coreCapabilities: ["High Availability", "Disaster Recovery", "Consistent Hashing", "Load Balancing"],
        outcome: "Reliable operations at massive scale.",
        tags: ["Enterprise", "High Availability"],
        cta: "View Enterprise Ops",
        illustration: "/architecture-viz.png",
        icon: "Server",
        link: "/lets-talk"
    }
];

const caseStudies = [
    {
        title: "Pype CRM",
        slug: "pype-crm",
        category: "CRM & Automation",
        description: "A comprehensive CRM solution designed for high-velocity sales teams, featuring automated pipelines and AI-driven insights.",
        industry: "Technology",
        problem: "Inefficient lead tracking and lack of actionable sales data.",
        solution: "Developed a custom CRM with automated workflows, email integration, and real-time analytics dashboard.",
        techStack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
        stats: [
            { label: "Sales Increase", value: "35%" },
            { label: "Lead Response", value: "<5min" },
            { label: "User Adoption", value: "98%" }
        ],
        image: "/project_dashboard_preview_1770603074238.jpg",
        projectUrl: "https://pypecrm.com",
        cta: "View Full Case Study"
    },
    {
        title: "Client Success & Support",
        slug: "client-support",
        category: "Maintenance & Growth",
        description: "Beyond development, we provide dedicated 24/7 technical support, security patching, and system optimizations to ensure long-term success.",
        industry: "Enterprise Support",
        problem: "Software degradation over time and the need for rapid incident response.",
        solution: "We offer comprehensive SLA-based support packages including real-time monitoring, automated security updates, and continuous performance tuning.",
        techStack: ["24/7 Monitoring", "Security Audits", "Performance Tuning", "Cloud Scaling", "Bug Fixes"],
        stats: [
            { label: "Avg Response", value: "<15min" },
            { label: "Uptime Gtd.", value: "99.9%" },
            { label: "Client Retention", value: "100%" }
        ],
        image: "/tech-cube.jpg",
        cta: "View Support Plans"
    }
];

const leaders = [
    {
        role: "CEO ProHostix",
        name: "Dilshad Ashraf",
        desc: "Visionary leader driving enterprise-grade software intelligence and global operational strategy for ProHostix.",
        specialization: "Corporate Strategy",
        avatar: "/working-professional.jpg"
    },
    {
        role: "Vice President",
        name: "Akhilesh Semwal",
        desc: "Strategic executive overseeing operational excellence and partnership growth with a focus on high-scale delivery.",
        specialization: "Operations",
        avatar: "/working-professional.jpg"
    }
];

const pageContents = [
    {
        page: 'home',
        section: 'core_specializations',
        content: {
            badge: "OUR APPROACH",
            title: "ENGINEERING & OPERATIONS",
            caption: "We follow disciplined engineering and operational practices to ensure the software we deliver is reliable, secure, and built to perform in real-world business environments.",
            items: [
                { id: "architecture", title: "Reliability by Design", description: "ERP and CRM systems architected with redundancy, fault tolerance, and proven design patterns to support consistent and dependable performance." },
                { id: "deployment", title: "Scalable Cloud Deployment", description: "Applications deployed using cloud-native infrastructure with controlled rollouts, backup strategies, and region-aware scaling." },
                { id: "tracking", title: "Active Systems Tracking", description: "Post-deployment monitoring, alerting, and operational visibility to help teams track system health and respond proactively." }
            ]
        }
    },
    {
        page: 'home',
        section: 'operational_excellence',
        content: {
            title: "OPERATIONAL EXCELLENCE",
            subtitle: "Engineered for reliability. Built for scale. Managed for mission-critical performance.",
            humanImage: {
                src: "/working-professional.jpg",
                alt: "Operations engineer monitoring production systems"
            },
            cards: [
                { id: "uptime", title: "99.9% Production Uptime", description: "Mission-critical CRM and ERP systems running without interruption." },
                { id: "multiregion", title: "Multi-Region Cloud Deployment", description: "Redundant infrastructure across regions for failover and scale." },
                { id: "monitoring", title: "24/7 System Monitoring", description: "Live alerts, automated recovery, and continuous performance tracking." }
            ]
        }
    },
    {
        page: 'home',
        section: 'scalable_intelligence',
        content: {
            title: "Building at Scale",
            caption: "We design scalable software systems that support growth, reliability, and long-term operational success across web, mobile, and enterprise platforms.",
            capabilities: [
                { id: "data-analytics", title: "Data Analytics & Insights", desc: "Transform operational and business data into meaningful insights that support planning, optimization, and decision-making.", img: "/architecture-viz.png", features: ["Business Reporting", "Trend Analysis", "Insight Dashboards"], stat: "Insight-Driven Decisions", targetWidth: 0.9 },
                { id: "scalable-architecture", title: "Scalable System Architecture", desc: "Design and build software architectures that remain stable, secure, and performant as usage and complexity grow.", img: "/cloud-intel.png", features: ["Fault-Tolerant Design", "Horizontal Scaling", "Cloud-Native Systems"], stat: "High Availability Design", targetWidth: 0.85 },
                { id: "performance-optimization", title: "Performance Optimization", desc: "Improve responsiveness and efficiency through optimized data flows, system tuning, and infrastructure planning.", img: "/coding-blueprint.png", features: ["Latency Reduction", "Efficient Data Pipelines", "System Optimization"], stat: "Optimized Performance", targetWidth: 0.78 }
            ]
        }
    },
    {
        page: 'home',
        section: 'pioneer_work',
        content: {
            title: "Featured Client Work",
            caption: "A selection of enterprise-grade systems we’ve designed and delivered to solve real-world business challenges.",
            projects: [
                { id: "custom-erp", title: "Custom Enterprise ERP", description: "Architecting modular, scalable ERP systems that unify operations, finance, and supply chain management.", image: "/software_solution_visual.jpg", tags: ["ERP", "Automation", "Operations"] },
                { id: "web-ecosystems", title: "High-Performance Web Ecosystems", description: "Building SEO-optimized, lightning-fast web applications with Next.js for maximum visibility and conversion.", image: "/mobile_app_preview_1770603093871.jpg", tags: ["Web Development", "SEO", "Performance"] }
            ]
        }
    },
    {
        page: 'home',
        section: 'cta_section',
        content: {
            titlePart1: "READY TO BUILD THE",
            titlePart2: "NEXT",
            titlePart3: "LEVEL?",
            description: "Our team is currently accepting high-priority projects for Q2 2026. Let's see if your vision aligns with our architecture.",
            primaryButtonText: "Initialize Contact",
            secondaryButtonText: "View Schema"
        }
    },
    {
        page: 'company',
        section: 'core_info',
        content: {
            hero: { tagline: "Engineering First", title: "The Minds Behind ProHostix", subtitle: "We are a collective of architects, engineers, and strategists obsessed with building systems that last." },
            mission: { title: "Our Mission", description: "To democratize enterprise-grade architecture for ambitious companies.", icon: "Target" },
            vision: { title: "Our Vision", description: "A world where software infrastructure is invisible, resilient, and limitless.", icon: "Lightbulb" },
            philosophy: { title: "Philosophy", description: "Code is a liability; architecture is an asset. We build for the long term.", icon: "Heart" },
            values: [
                { title: "Reliability", desc: "Systems that never sleep. We prioritize uptime and stability above all.", icon: "ShieldCheck" },
                { title: "Scalability", desc: "Growth without the growing pains. Architectures built to expand effortlessly.", icon: "TrendingUp" },
                { title: "Partnership", desc: "We are an extension of your team, aligned with your long-term success.", icon: "Users" }
            ],
            careers: { title: "Join the Team", description: "We are always looking for exceptional talent who think in systems, not just features.", cta: "View Open Roles", link: "/careers" }
        }
    },
    {
        page: 'case-studies',
        section: 'hero',
        content: {
            tagline: "PROVEN ARCHITECTURES",
            title: "Case Studies & Systems",
            subtitle: "A deep dive into the systems we’ve engineered for high-performance and scale."
        }
    },
    {
        page: 'solutions',
        section: 'highlights',
        content: [
            { label: "Uptime Guarantee", value: "99.9%", description: "Ensuring your business is always online.", icon: "CheckCircle2" },
            { label: "Scalability", value: "Horizontal", description: "Effortlessly handle traffic spikes.", icon: "Zap" },
            { label: "Security", value: "By Design", description: "Built-in protection against threats.", icon: "ShieldCheck" }
        ]
    },
    {
        page: 'solutions',
        section: 'hero',
        content: {
            tagline: "Future-Proof Architecture",
            title: "Intelligent Solutions Built for Scale",
            subtitle: "We don't just write code; we engineer outcome-driven solutions that drive efficiency, enforce scalability, and automate complex workflows."
        }
    },
    {
        page: 'blog',
        section: 'hero',
        content: {
            tagline: "TECHNICAL INSIGHTS",
            title: "Insights From the Architecture Layer",
            subtitle: "Join 5,000+ architects receiving weekly insights on scaling, resilience, and AI integration."
        }
    },
    {
        page: 'careers',
        section: 'core_info',
        content: {
            badge: "Join the Collective",
            title: "Build the Infrastructure of Tomorrow",
            subtitle: "We are looking for architects who think in systems, designers who value precision, and engineers who enjoy solving impossible complexity.",
            perks: [
                { title: "Remote-First", desc: "Collaborate with top engineering talent from anywhere in the world." },
                { title: "Modern Tech-Stack", desc: "Work with Rust, Go, Kubernetes, and distributed AI systems." },
                { title: "Ownership Culture", desc: "Full autonomy over your projects and architectural decisions." }
            ],
            formTitle: "Technical Enquiry",
            formSubtitle: "Please provide your technical background and interest."
        }
    },
    {
        page: 'services',
        section: 'hero',
        content: {
            tagline: "From Design to Deployment",
            title: "Engineering Services That Power Intelligence",
            subtitle: "End-to-end software development services tailored for scalability, security, and performance."
        }
    },
    {
        page: 'solutions',
        section: 'crm',
        content: {
            hero: {
                tagline: "Customer-Centric Intelligence",
                title: "CRM Solutions for Modern Business",
                subtitle: "Unify customer data, automate interactions, and drive sales with our intelligent, scalable CRM platform."
            },
            crmPillars: [
                { id: "data-unification", title: "Data Unification", description: "Consolidate customer data from all touchpoints into a single, cohesive view.", problemSolved: "Data silos and fragmented customer insights.", coreCapabilities: ["Contact Management", "Interaction History", "Social Media Integration", "Custom Fields"], outcome: "360-degree customer view for personalized engagement.", icon: "Database" },
                { id: "sales-automation", title: "Sales Automation", description: "Automate repetitive sales tasks and streamline your pipeline.", problemSolved: "Inefficient sales processes and missed opportunities.", coreCapabilities: ["Lead Scoring", "Opportunity Tracking", "Email Templates", "Sales Forecasting"], outcome: "Increased sales productivity and faster deal cycles.", icon: "TrendingUp" },
                { id: "marketing-integration", title: "Marketing Integration", description: "Align sales and marketing efforts with unified campaign tracking.", problemSolved: "Misalignment between sales and marketing teams.", coreCapabilities: ["Campaign Management", "ROI Analytics", "Lead Nurturing Workflows", "Email Marketing"], outcome: "Higher conversion rates and better ROI.", icon: "Megaphone" },
                { id: "customer-support", title: "Customer Support", description: "Deliver exceptional support with integrated helpdesk and ticketing.", problemSolved: "Slow response times and disjointed support interactions.", coreCapabilities: ["Ticket Management", "Knowledge Base", "Live Chat", "SLA Tracking"], outcome: "Improved customer satisfaction and loyalty.", icon: "Headphones" }
            ],
            automationAndIntelligence: [
                { title: "AI-Powered Insights", description: "Leverage machine learning to predict customer behavior and identify upsell opportunities." },
                { title: "Workflow Engine", description: "Build visual automation workflows to trigger actions based on customer events." }
            ],
            securityAndScalability: [
                { title: "Enterprise-Grade Security", description: "SOC2 compliant, role-based access control, and data encryption at rest and in transit." },
                { title: "Infinite Scalability", description: "Cloud-native architecture that scales with your customer base, supporting millions of records." }
            ],
            cta: {
                title: "Transform Your Customer Relationships",
                buttonText: "Schedule a CRM Demo",
                link: "/contact-crm"
            }
        }
    }
];

const enquiries = [];

const jobApplications = [];

const subscribers = [];

const socialLinksData = [
    { platform: "X", url: "https://x.com/prohostix", icon: "X", order: 1 },
    { platform: "Instagram", url: "https://instagram.com/prohostix", icon: "Instagram", order: 2 },
    { platform: "Facebook", url: "https://facebook.com/prohostix", icon: "Facebook", order: 3 }
];

const seoData = [
    {
        page: 'home',
        title: 'ProHostix | Enterprise Software Development & Cloud Solutions',
        description: 'ProHostix delivers custom enterprise software, cloud infrastructure, and AI-driven solutions to scale your business. Expert engineering for modern growth.',
        keywords: ['enterprise software', 'cloud solutions', 'custom erp', 'software development', 'ai integration', ' web development', 'mobile apps'],
        robots: 'index, follow',
        ogImage: '/hero-ai.jpg',
        canonicalUrl: 'https://prohostix.com'
    },
    {
        page: 'services',
        title: 'Our Services | Custom Software & Cloud Engineering',
        description: 'Explore our comprehensive engineering services: Web & Mobile App Development, ERP Systems, Cloud DevOps, and UI/UX Design.',
        keywords: ['software services', 'web development', 'mobile app development', 'cloud devops', 'erp development', 'ui ux design'],
        robots: 'index, follow',
        ogImage: '/web-arch.png',
        canonicalUrl: 'https://prohostix.com/services'
    },
    {
        page: 'solutions',
        title: 'Business Solutions | CRM, ERP & Automation',
        description: 'Scalable business solutions designed for efficiency. Discover our CRM platforms, ERP systems, and business automation tools.',
        keywords: ['business solutions', 'crm software', 'erp systems', 'business automation', 'saas platforms', 'enterprise applications'],
        robots: 'index, follow',
        ogImage: '/software_solution_visual.jpg',
        canonicalUrl: 'https://prohostix.com/solutions'
    },
    {
        page: 'case-studies',
        title: 'Case Studies | Success Stories & Project Showcase',
        description: 'See how ProHostix helps businesses transform. Read our case studies on custom ERPs, high-performance web apps, and cloud migrations.',
        keywords: ['case studies', 'project portfolio', 'success stories', 'client work', 'software projects'],
        robots: 'index, follow',
        ogImage: '/project_dashboard_preview_1770603074238.jpg',
        canonicalUrl: 'https://prohostix.com/case-studies'
    },
    {
        page: 'company',
        title: 'About ProHostix | Engineering the Future',
        description: 'Meet the team behind ProHostix. We are architects, engineers, and strategists dedicated to building resilient, scalable software systems.',
        keywords: ['about us', 'company profile', 'software agency', 'tech team', 'engineering culture'],
        robots: 'index, follow',
        ogImage: '/working-professional.jpg',
        canonicalUrl: 'https://prohostix.com/company'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Master Seeding...');

        // Clear existing data for a clean seed as requested
        await Blog.deleteMany({});
        await Service.deleteMany({});
        await Solution.deleteMany({});
        await CaseStudy.deleteMany({});
        await Leadership.deleteMany({});
        await PageContent.deleteMany({});
        await HeroImage.deleteMany({});
        await Navigation.deleteMany({});
        await Settings.deleteMany({});
        await Enquiry.deleteMany({});
        await JobApplication.deleteMany({});
        await Subscriber.deleteMany({});
        await SocialLink.deleteMany({});
        await SeoMetadata.deleteMany({});

        // Admin User (Upsert)
        const adminEmail = "admin@prohostix.com";
        const adminPassword = "adminPassword123";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "Administrator"
            },
            { upsert: true, new: true }
        );
        console.log('Admin user ensured.');

        // Settings (Upsert)
        await Settings.findOneAndUpdate({}, siteSettings, { upsert: true });
        console.log('Settings ensured.');

        // Social Links (Upsert by platform)
        for (const link of socialLinksData) {
            await SocialLink.findOneAndUpdate(
                { platform: link.platform },
                link,
                { upsert: true }
            );
        }
        console.log('Social Links ensured.');

        // Home Hero (Upsert)
        const heroData = {
            imageUrl: "/hero-ai.jpg",
            altText: "Modern software development workspace with analytics and technology",
            badge: "Custom Software Development",
            titleLine1: "Software Solutions for",
            titleLine2: "Growing Businesses",
            subtitle: "We design and develop ERP systems, CRM platforms, websites, and mobile applications that help businesses streamline operations and scale with confidence.",
            services: "ERP Development · CRM Solutions · Web Applications · Mobile Applications",
            primaryCtaText: "Get a Free Consultation",
            primaryCtaLink: "/lets-talk",
            secondaryCtaText: "View Services →",
            secondaryCtaLink: "/services",
            isActive: true
        };
        await HeroImage.findOneAndUpdate({}, heroData, { upsert: true });
        console.log('Home Hero ensured.');

        // Seed Data
        await Blog.insertMany(blogs);
        await Service.insertMany(services);
        await Solution.insertMany(solutions);
        await CaseStudy.insertMany(caseStudies);
        await Leadership.insertMany(leaders);
        await PageContent.insertMany(pageContents);
        await Navigation.insertMany(navItems);
        await Enquiry.insertMany(enquiries);
        await JobApplication.insertMany(jobApplications);
        await Subscriber.insertMany(subscribers);
        await SeoMetadata.insertMany(seoData);

        console.log('All data collections seeded.');

        console.log('Master Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
