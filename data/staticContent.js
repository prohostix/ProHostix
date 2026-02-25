export const HERO_CONTENT = {
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

export const SERVICES = [
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
        techStack: ["React", "Node.js", "PostgreSQL", "AWS"], // Added based on context
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
        techStack: ["Flutter", "React Native", "Firebase", "Swift"],
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
        techStack: ["Python", "Django", "PostgreSQL", "Redis"],
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
        techStack: ["Figma", "Adobe XD", "Sketch", "Protopie"],
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
        techStack: ["AWS", "Docker", "Kubernetes", "Terraform"],
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
        techStack: ["New Relic", "Sentry", "PagerDuty", "Jira"],
        relatedServices: ["erp-development", "cloud-devops"]
    }
];

export const SOLUTIONS = [
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
        link: "/lets-talk",
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
        link: "/lets-talk",
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

export const LEADERSHIP = [
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

export const CASE_STUDIES = [
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

export const PAGE_CONTENT = {
    home: {
        core_specializations: {
            badge: "OUR APPROACH",
            title: "ENGINEERING & OPERATIONS",
            caption: "We follow disciplined engineering and operational practices to ensure the software we deliver is reliable, secure, and built to perform in real-world business environments.",
            items: [
                { id: "architecture", title: "Reliability by Design", description: "ERP and CRM systems architected with redundancy, fault tolerance, and proven design patterns to support consistent and dependable performance." },
                { id: "deployment", title: "Scalable Cloud Deployment", description: "Applications deployed using cloud-native infrastructure with controlled rollouts, backup strategies, and region-aware scaling." },
                { id: "tracking", title: "Active Systems Tracking", description: "Post-deployment monitoring, alerting, and operational visibility to help teams track system health and respond proactively." }
            ]
        },
        operational_excellence: {
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
        },
        scalable_intelligence: {
            title: "Building at Scale",
            caption: "We design scalable software systems that support growth, reliability, and long-term operational success across web, mobile, and enterprise platforms.",
            capabilities: [
                { id: "data-analytics", title: "Data Analytics & Insights", desc: "Transform operational and business data into meaningful insights that support planning, optimization, and decision-making.", img: "/architecture-viz.png", features: ["Business Reporting", "Trend Analysis", "Insight Dashboards"], stat: "Insight-Driven Decisions", targetWidth: 0.9 },
                { id: "scalable-architecture", title: "Scalable System Architecture", desc: "Design and build software architectures that remain stable, secure, and performant as usage and complexity grow.", img: "/cloud-intel.png", features: ["Fault-Tolerant Design", "Horizontal Scaling", "Cloud-Native Systems"], stat: "High Availability Design", targetWidth: 0.85 },
                { id: "performance-optimization", title: "Performance Optimization", desc: "Improve responsiveness and efficiency through optimized data flows, system tuning, and infrastructure planning.", img: "/coding-blueprint.png", features: ["Latency Reduction", "Efficient Data Pipelines", "System Optimization"], stat: "Optimized Performance", targetWidth: 0.78 }
            ]
        },
        pioneer_work: {
            title: "Featured Client Work",
            caption: "A selection of enterprise-grade systems we’ve designed and delivered to solve real-world business challenges.",
            projects: [
                { id: "custom-erp", title: "Custom Enterprise ERP", description: "Architecting modular, scalable ERP systems that unify operations, finance, and supply chain management.", image: "/software_solution_visual.jpg", tags: ["ERP", "Automation", "Operations"] },
                { id: "web-ecosystems", title: "High-Performance Web Ecosystems", description: "Building SEO-optimized, lightning-fast web applications with Next.js for maximum visibility and conversion.", image: "/mobile_app_preview_1770603093871.jpg", tags: ["Web Development", "SEO", "Performance"] }
            ]
        },
        cta_section: {
            titlePart1: "READY TO BUILD THE",
            titlePart2: "NEXT",
            titlePart3: "LEVEL?",
            description: "Our team is currently accepting high-priority projects for Q2 2026. Let's see if your vision aligns with our architecture.",
            primaryButtonText: "Initialize Contact",
            secondaryButtonText: "View Schema"
        }
    },
    company: {
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
    },
    case_studies: {
        hero: {
            tagline: "PROVEN ARCHITECTURES",
            title: "Case Studies & Systems",
            subtitle: "A deep dive into the systems we’ve engineered for high-performance and scale."
        }
    },
    solutions: {
        highlights: [
            { label: "Uptime Guarantee", value: "99.9%", description: "Ensuring your business is always online.", icon: "CheckCircle2" },
            { label: "Scalability", value: "Horizontal", description: "Effortlessly handle traffic spikes.", icon: "Zap" },
            { label: "Security", value: "By Design", description: "Built-in protection against threats.", icon: "ShieldCheck" }
        ],
        hero: {
            tagline: "Future-Proof Architecture",
            title: "Intelligent Solutions Built for Scale",
            subtitle: "We don't just write code; we engineer outcome-driven solutions that drive efficiency, enforce scalability, and automate complex workflows."
        }
    },
    services: {
        hero: {
            tagline: "From Design to Deployment",
            title: "Engineering Services That Power Intelligence",
            subtitle: "End-to-end software development services tailored for scalability, security, and performance."
        }
    },
    blog: {
        hero: {
            tagline: "TECHNICAL INSIGHTS",
            title: "Insights From the Architecture Layer",
            subtitle: "Join 5,000+ architects receiving weekly insights on scaling, resilience, and AI integration."
        },
        newsletter: {
            title: "Stay Ahead of Intelligent Systems",
            description: "Join 5,000+ architects receiving weekly insights on scaling, resilience, and AI integration."
        }
    },
    careers: {
        core_info: {
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
    }
};

export const SITE_SETTINGS = {
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

export const NAVIGATION = [
    { label: "Home", path: "/", icon: "LayoutGrid" },
    { label: "Solutions", path: "/solutions", icon: "Briefcase" },
    { label: "Services", path: "/services", icon: "Puzzle" },
    { label: "Case Studies", path: "/case-studies", icon: "FolderKanban" },
    { label: "Company", path: "/company", icon: "Building2" },
    { label: "Blog", path: "/blog", icon: "BookOpenText" }
];
