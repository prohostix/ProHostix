export const caseStudiesContent = {
    hero: {
        tagline: "Proven Results",
        title: "Architectures That Perform",
        subtitle: "Real-world implementations of scalable, intelligent, and secure systems."
    },
    caseStudies: [
        {
            id: "sentinael",
            title: "Sentinæl Intelligence Platform",
            category: "AI Analytics & SaaS",
            description: "A distributed AI analytics platform processing 50TB+ of data daily with real-time anomaly detection.",
            industry: "Technology",
            problem: "Processing massive data volumes with low latency for anomaly detection.",
            solution: "Implemented a distributed streaming architecture using Apache Kafka and Flink.",
            techStack: ["React", "Python", "TensorFlow", "AWS", "Kafka", "Flink"],
            stats: [
                { label: "Data Processed", value: "50TB/day" },
                { label: "Latency", value: "<100ms" },
                { label: "Accuracy", value: "99.8%" }
            ],
            image: "",
            cta: "View Full Case Study"
        },
        {
            id: "krypton",
            title: "Krypton Asset Management",
            category: "FinTech & ERP",
            description: "High-frequency trading interface with institutional-grade security and sub-millisecond execution.",
            industry: "Finance",
            problem: "Ensuring ultra-low latency and security for high-frequency trading.",
            solution: "Built a custom trading engine using Rust and optimized networking protocols.",
            techStack: ["Flutter", "Go", "gRPC", "PostgreSQL", "Rust"],
            stats: [
                { label: "Transactions", value: "1M+/sec" },
                { label: "Uptime", value: "99.999%" },
                { label: "Security", value: "SOC2 Type II" }
            ],
            image: "/mobile_app_preview_1770603093871.png",
            cta: "View Full Case Study"
        },
        {
            id: "scalable-grid",
            title: "Scalable Intelligence Grid",
            category: "Distributed Systems",
            description: "Global edge network architecture ensuring zero-downtime deployment and instant failover.",
            industry: "Infrastructure",
            problem: "Global latency and resilience for content delivery.",
            solution: "Leveraged Kubernetes and edge computing principles for distributed state management.",
            techStack: ["Kubernetes", "Docker", "Terraform", "Rust"],
            stats: [
                { label: "Nodes", value: "500+" },
                { label: "Global Reach", value: "12 Zones" },
                { label: "Failover", value: "Instant" }
            ],
            image: "",
            cta: "View Full Case Study"
        }
    ],
    cta: {
        title: "Need Similar Results?",
        primaryButtonText: "View More Architectures",
        secondaryButtonText: "Build Something Similar",
        link: "/contact"
    }
};
