export const blogContent = {
    hero: {
        tagline: "Technical Insights",
        title: "Insights From the Architecture Layer",
        subtitle: "Join 5,000+ architects receiving weekly insights on scaling, resilience, and AI integration."
    },
    categories: [
        { id: "erp-systems", label: "ERP Systems" },
        { id: "architecture", label: "Architecture" },
        { id: "ai-automation", label: "AI & Automation" },
        { id: "cloud-devops", label: "Cloud & DevOps" },
        { id: "product-engineering", label: "Product Engineering" }
    ],
    posts: [
        {
            id: 1,
            title: "Scaling PostgreSQL to 1 Billion Rows",
            excerpt: "Advanced indexing techniques and partitioning strategies for high-velocity transactional databases.",
            date: "Feb 10, 2026",
            readTime: "8 min read",
            category: "Architecture",
            slug: "scaling-postgresql-billion-rows",
            image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=800&auto=format&fit=crop",
            content: "As systems scale towards a billion rows, standard indexing and query patterns begin to degrade. This deep dive explores the shift from monolithic database architectures to partitioned, horizontally scalable strategies.\n\nKey areas explored include:\n- Native Declarative Partitioning in PostgreSQL 12+.\n- BRIN Indexing for massive datasets where traditional B-Trees become too large for memory.\n- The role of Citus for distributed PostgreSQL workloads.\n\nWe provide benchmarks comparing sequential scans vs. partitioned lookups, demonstrating a 40x improvement in query latency for time-series data clusters."
        },
        {
            id: 2,
            title: "The Death of Monoliths: Microservices Patterns",
            excerpt: "When to split your services and how to manage the complexity of distributed transactions.",
            date: "Feb 08, 2026",
            readTime: "12 min read",
            category: "Architecture",
            slug: "monoliths-to-microservices",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
            content: "Microservices are often marketed as a silver bullet, but the transition from a monolith is fraught with architectural pitfalls. This article outlines the 'Strangler Fig' pattern for incremental migration and explores the trade-offs of runtime complexity.\n\nTopics include:\n- Service boundary discovery using Domain Driven Design (DDD).\n- Synchronous vs. Asynchronous communication (REST vs. gRPC vs. Message Brokers).\n- The Saga Pattern for managing distributed transactions without 2PC (Two Phase Commit)."
        },
        {
            id: 3,
            title: "AI in ERP: Beyond the Hype",
            excerpt: "Practical applications of machine learning in resource planning, from demand forecasting to anomaly detection.",
            date: "Feb 05, 2026",
            readTime: "6 min read",
            category: "ERP Systems",
            slug: "ai-in-erp",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
            content: "Enterprise Resource Planning (ERP) is being redefined by AI. We look past the generative AI hype to focus on predictive analytics that provide real-world ROI.\n\nArchitecture insights:\n- Integrating TensorFlow models directly into ERP middleware.\n- Real-time inventory optimization using Reinforcement Learning.\n- Automated fraud detection in financial sub-ledgers using Graph Neural Networks."
        },
        {
            id: 4,
            title: "Zero-Downtime Deployments with Kubernetes",
            excerpt: "A deep dive into rolling updates, blue-green deployments, and canary releases in production.",
            date: "Jan 28, 2026",
            readTime: "10 min read",
            category: "Cloud & DevOps",
            slug: "kubernetes-deployments",
            image: "https://images.unsplash.com/photo-1667372393119-c81c0c27a7f9?q=80&w=800&auto=format&fit=crop",
            content: "Modern engineering requires that production systems never sleep. This technical guide breaks down the Kubernetes Deployment object and how to configure it for truly zero-downtime releases.\n\nAnalysis includes:\n- Readiness and Liveness probes: Tuning for stability.\n- Custom Resource Definitions (CRDs) for advanced traffic splitting.\n- Using Istio Service Mesh for fine-grained Canary releases with weight-based routing."
        },
        {
            id: 5,
            title: "Designing for Resilience: Circuit Breakers",
            excerpt: "Implementing fault tolerance patterns to prevent cascading system failures.",
            date: "Jan 22, 2026",
            readTime: "7 min read",
            category: "Product Engineering",
            slug: "circuit-breakers-pattern",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
            content: "In a distributed system, failure is inevitable. The Circuit Breaker pattern is the primary defense against cascading failures. We examine the 'Open', 'Closed', and 'Half-Open' states of a circuit and how to implement them in high-concurrency environments.\n\nWe also compare libraries like Resilience4j and Hystrix, providing a Go implementation for a custom interceptor-based circuit breaker."
        }
    ],
    newsletter: {
        title: "Stay Ahead of Intelligent Systems",
        subtitle: "Get the latest architectural patterns and engineering insights delivered to your inbox.",
        placeholder: "Enter your email",
        buttonText: "Subscribe"
    }
};
