import connectDB from './db.js';
import JobRequisition from './models/JobRequisition.js';

export const DEFAULT_JOBS = [
    {
        title: 'Senior Full-Stack Engineer (Next.js & Node.js)',
        department: 'Engineering',
        location: 'Remote / Noida, India',
        type: 'Full-time',
        experienceLevel: 'Senior',
        minYears: 4,
        requiredSkills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'REST API'],
        preferredSkills: ['TailwindCSS', 'Docker', 'Redis', 'GraphQL', 'AWS'],
        description: 'Lead architecture and rapid delivery of enterprise web applications, high-throughput microservices, and client portals at Prohostix.',
        status: 'Active' as const,
    },
    {
        title: 'AI/ML & LLM Solutions Engineer',
        department: 'AI & Innovation',
        location: 'Remote / Hybrid',
        type: 'Full-time',
        experienceLevel: 'Mid-Senior',
        minYears: 3,
        requiredSkills: ['Python', 'LLM', 'FastAPI', 'RAG', 'PyTorch', 'Vector Databases'],
        preferredSkills: ['LangChain', 'Docker', 'Fine-Tuning', 'Hugging Face', 'Kubernetes'],
        description: 'Design and deploy state-of-the-art Generative AI agents, RAG search pipelines, and automated reasoning models for enterprise clients.',
        status: 'Active' as const,
    },
    {
        title: 'DevOps & Cloud Infrastructure Architect',
        department: 'Infrastructure & SRE',
        location: 'Remote / Hybrid',
        type: 'Full-time',
        experienceLevel: 'Senior',
        minYears: 5,
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
        preferredSkills: ['Prometheus', 'Grafana', 'Nginx', 'Ansible', 'Security Compliance'],
        description: 'Own Prohostix multi-tenant cloud infrastructure, disaster recovery, zero-downtime deployment pipelines, and global server orchestration.',
        status: 'Active' as const,
    },
    {
        title: 'Lead UI/UX & Design Systems Engineer',
        department: 'Design & Product',
        location: 'Remote / Noida, India',
        type: 'Full-time',
        experienceLevel: 'Mid-Senior',
        minYears: 3,
        requiredSkills: ['Figma', 'UI/UX', 'Design Systems', 'React', 'TailwindCSS'],
        preferredSkills: ['Framer Motion', 'Prototyping', 'User Research', 'Accessibility'],
        description: 'Craft high-converting, aesthetic, accessible user interfaces and maintain the unified design language across all Prohostix client projects.',
        status: 'Active' as const,
    },
];

export async function ensureDefaultJobs() {
    await connectDB();
    const count = await JobRequisition.countDocuments();
    if (count === 0) {
        await JobRequisition.insertMany(DEFAULT_JOBS);
        console.log('Seeded default ProHostix job requisitions.');
    }
}

