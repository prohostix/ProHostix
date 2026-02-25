export const servicesContent = {
    hero: {
        tagline: "From Design to Deployment",
        title: "Engineering Services That Power Intelligence",
        subtitle: "End-to-end software development services tailored for scalability, security, and performance."
    },
    serviceStack: [
        {
            id: "web-development",
            slug: "web-development",
            title: "Web Applications",
            description: "Scalable, high-performance web systems built for growth.",
            deliverables: ["Modern Frameworks", "Secure Backends", "API Integration"],
            outcome: "Systems that scale effortlessly with your business.",
            // Detail Page Content
            illustration: "/web-arch.png",
            longDescription: "We engineer robust, scalable web ecosystems that drive business growth. From complex enterprise dashboards to high-traffic consumer portals, our architectures are built for performance, security, and long-term maintainability.",
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
            id: "mobile-development",
            slug: "mobile-development",
            title: "Mobile Apps",
            description: "Native-grade experiences for iOS and Android.",
            deliverables: ["iOS & Android", "Cross-Platform", "App Store Ready"],
            outcome: "Captivating users on every device.",
            // Detail Page Content
            illustration: "/neural-mobile.png",
            longDescription: "Reach your users wherever they are with intuitive, high-performance mobile applications. We build native and cross-platform solutions that deliver smooth, engaging experiences on both iOS and Android.",
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
            id: "erp-development",
            slug: "erp-development",
            title: "ERP Systems",
            description: "Tailored engines to streamline complex business operations.",
            deliverables: ["Custom Modules", "Process Automation", "Data Migration"],
            outcome: "Unified operations. Real-time visibility.",
            // Detail Page Content
            illustration: "/software-illustration.png",
            longDescription: "Eliminate improved improved fragmented workflows with custom Enterprise Resource Planning (ERP) systems. We build centralized platforms that unify your operations, finance, HR, and supply chain data into a single source of truth.",
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
            id: "ui-ux-design",
            slug: "ui-ux-design",
            title: "UI/UX Design",
            description: "Intuitive interfaces that drive user engagement.",
            deliverables: ["Design Systems", "Prototyping", "User Research"],
            outcome: "Products users love and stick with.",
            // Detail Page Content
            illustration: "/cognitive-design.png",
            longDescription: "Great software starts with great design. We combine aesthetic excellence with deep user empathy to create intuitive, engaging interfaces that solve real problems and delight users.",
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
            id: "cloud-devops",
            slug: "cloud-devops",
            title: "Cloud & DevOps",
            description: "Resilient infrastructure for automated, reliable deployment.",
            deliverables: ["AWS / Azure", "CI/CD Pipelines", "Auto-Scaling"],
            outcome: "Zero downtime. Maximum velocity.",
            // Detail Page Content
            illustration: "/cloud-intel.png",
            longDescription: "Scale confidently with robust cloud infrastructure and automated DevOps pipelines. We ensure your systems are resilient, secure, and capable of handling massive traffic spikes without manual intervention.",
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
            id: "maintenance-support",
            slug: "maintenance-support",
            title: "Maintenance",
            description: "24/7 security and performance optimization.",
            deliverables: ["Security Audits", "Performance Tuning", "24/7 Support"],
            outcome: "Stability you can count on, always.",
            // Detail Page Content
            illustration: "/tech-cube.png",
            longDescription: "Software is living; it needs care to thrive. Our dedicated support teams provide 24/7 monitoring, security patches, and performance optimization to keep your critical systems running smoothly.",
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
    ],
    engagementModel: {
        steps: [
            {
                id: "discover",
                title: "Discover",
                description: "We analyze your requirements, understand your business goals, and define the strategic roadmap.",
                icon: "Search"
            },
            {
                id: "build",
                title: "Build",
                description: "Agile development with regular updates, ensuring the product evolves with your feedback.",
                icon: "Hammer"
            },
            {
                id: "scale",
                title: "Scale",
                description: "Deployment optimization, performance tuning, and strategies for long-term growth.",
                icon: "TrendingUp"
            }
        ]
    },
    cta: {
        title: "Ready to Build?",
        buttonText: "Request a Technical Consultation",
        link: "/lets-talk"
    }
};
