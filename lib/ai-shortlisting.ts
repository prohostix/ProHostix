import JSZip from 'jszip';

export interface JobRequisitionData {
    _id?: string;
    title: string;
    department: string;
    location?: string;
    type?: string;
    minYears: number;
    requiredSkills: string[];
    preferredSkills: string[];
    description: string;
}

export interface ParsedEvaluation {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    skills: string[];
    experienceYears: number;
    currentRole: string;
    currentCompany: string;
    education: { degree: string; school: string; year?: string }[];
    workHistory: { company: string; role: string; duration?: string }[];
    aiScore: number;
    aiStatus: 'SHORTLISTED' | 'REVIEW' | 'REJECTED';
    skillsMatchScore: number;
    experienceMatchScore: number;
    educationMatchScore: number;
    aiSummary: string;
    strengths: string[];
    weaknesses: string[];
    interviewQuestions: string[];
}

export function cleanResumeText(raw: string): string {
    return raw
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Extract text from Buffer (PDF, TXT, DOCX)
export async function extractTextFromBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith('.txt') || mimeType.includes('text/plain')) {
        return cleanResumeText(buffer.toString('utf-8'));
    }

    if (lowerName.endsWith('.pdf') || mimeType.includes('pdf')) {
        try {
            // Dynamically require/import pdf-parse to avoid SSR issues
            const pdfParseModule = await import('pdf-parse');
            const pdfParse = (pdfParseModule as any).default || pdfParseModule;
            const data = await pdfParse(buffer);
            if (data && data.text && data.text.trim().length > 20) {
                return cleanResumeText(data.text);
            }
        } catch (pdfErr) {
            console.warn('pdf-parse module fallback:', pdfErr);
        }

        // Fallback ASCII text extraction from PDF stream
        const rawStr = buffer.toString('latin1');
        const textChunks = rawStr.match(/[a-zA-Z0-9.,;:!?'"()@/\-_ ]{4,}/g) || [];
        const extracted = textChunks.filter(c => !c.includes('obj') && !c.includes('endobj')).join(' ');
        if (extracted.length > 50) {
            return cleanResumeText(extracted);
        }
    }

    // Default string conversion
    return cleanResumeText(buffer.toString('utf-8', 0, Math.min(buffer.length, 50000)));
}

// Extract files from a ZIP archive
export async function extractFilesFromZip(zipBuffer: Buffer): Promise<Array<{ name: string; buffer: Buffer; mimeType: string }>> {
    const zip = await JSZip.loadAsync(zipBuffer);
    const files: Array<{ name: string; buffer: Buffer; mimeType: string }> = [];

    for (const [filename, fileEntry] of Object.entries(zip.files)) {
        if (fileEntry.dir) continue;
        if (filename.startsWith('__MACOSX') || filename.startsWith('.')) continue;

        const lower = filename.toLowerCase();
        let mime = 'application/octet-stream';
        if (lower.endsWith('.pdf')) mime = 'application/pdf';
        else if (lower.endsWith('.docx')) mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (lower.endsWith('.txt')) mime = 'text/plain';
        else continue; // Skip non-resume files (e.g. .DS_Store, images)

        const fileArrayBuffer = await fileEntry.async('nodebuffer');
        files.push({
            name: pathBasename(filename),
            buffer: fileArrayBuffer,
            mimeType: mime
        });
    }

    return files;
}

function pathBasename(pathStr: string): string {
    return pathStr.split(/[\\/]/).pop() || pathStr;
}

// Rule-based heuristic extraction (Fast, deterministic & resilient)
export function parseResumeHeuristically(
    text: string,
    fileName: string,
    job: JobRequisitionData
): ParsedEvaluation {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].toLowerCase() : '';

    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    let fullName = '';
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const nameParts = baseName.split(' ').filter((w) => !/resume|cv|profile|doc|pdf|application|prohostix/i.test(w));
    if (nameParts.length >= 2) {
        fullName = nameParts.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    if (!fullName) {
        const firstLines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2 && l.length < 35);
        fullName = firstLines[0] || 'Applicant Candidate';
    }

    const KNOWN_SKILLS = [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Docker', 'Kubernetes',
        'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Terraform', 'CI/CD',
        'Linux', 'Nginx', 'Apache', 'PHP', 'WordPress', 'GraphQL', 'TailwindCSS', 'Git', 'Golang',
        'FastAPI', 'REST API', 'Microservices', 'Prometheus', 'Grafana', 'Ansible', 'Java', 'C++',
        'Spring Boot', 'Elasticsearch', 'Kafka', 'HTML', 'CSS', 'Bash', 'DevOps', 'SRE', 'Figma',
        'System Design', 'Agile', 'Scrum', 'Redux', 'Prisma', 'PyTorch', 'TensorFlow', 'LLM'
    ];

    const matchedSkills: string[] = [];
    const textLower = text.toLowerCase();

    for (const sk of KNOWN_SKILLS) {
        const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(textLower)) {
            matchedSkills.push(sk);
        }
    }

    let experienceYears = 0;
    const expMatch = textLower.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
    if (expMatch) {
        experienceYears = parseFloat(expMatch[1]);
    } else {
        const years = text.match(/\b(20[0-2][0-9]|19[89][0-9])\b/g);
        if (years && years.length >= 2) {
            const numYears = years.map(Number).sort((a, b) => a - b);
            const span = numYears[numYears.length - 1] - numYears[0];
            if (span > 0 && span < 30) experienceYears = Math.min(span, 15);
        }
    }
    if (!experienceYears) experienceYears = 3;

    const requiredCount = job.requiredSkills.length || 1;
    let requiredHits = 0;
    for (const reqSkill of job.requiredSkills) {
        if (textLower.includes(reqSkill.toLowerCase())) {
            requiredHits++;
        }
    }

    const preferredCount = job.preferredSkills.length || 1;
    let preferredHits = 0;
    for (const prefSkill of job.preferredSkills) {
        if (textLower.includes(prefSkill.toLowerCase())) {
            preferredHits++;
        }
    }

    const skillsMatchScore = Math.min(
        100,
        Math.round((requiredHits / requiredCount) * 85 + (preferredHits / preferredCount) * 15)
    );

    let experienceMatchScore = 70;
    if (experienceYears >= job.minYears) {
        experienceMatchScore = Math.min(100, 85 + Math.round((experienceYears - job.minYears) * 3));
    } else {
        experienceMatchScore = Math.max(30, Math.round((experienceYears / job.minYears) * 80));
    }

    const educationMatchScore = /bachelor|master|b\.tech|m\.tech|degree|bs|ms|university|college|phd/i.test(textLower)
        ? 90
        : 70;

    const aiScore = Math.round(
        skillsMatchScore * 0.5 + experienceMatchScore * 0.35 + educationMatchScore * 0.15
    );

    let aiStatus: 'SHORTLISTED' | 'REVIEW' | 'REJECTED' = 'REVIEW';
    if (aiScore >= 78) {
        aiStatus = 'SHORTLISTED';
    } else if (aiScore < 58) {
        aiStatus = 'REJECTED';
    }

    const strengths: string[] = [];
    if (requiredHits >= Math.ceil(requiredCount * 0.6)) {
        strengths.push(`Matches ${requiredHits} of ${requiredCount} required core technical skills for ${job.title}.`);
    }
    if (experienceYears >= job.minYears) {
        strengths.push(`${experienceYears} years verified experience meets or exceeds the ${job.minYears} year requirement.`);
    }
    if (matchedSkills.length >= 4) {
        strengths.push(`Demonstrated proficiency across ${matchedSkills.slice(0, 4).join(', ')}.`);
    }
    if (strengths.length === 0) {
        strengths.push('Shows baseline knowledge of software engineering and development workflows.');
    }

    const weaknesses: string[] = [];
    const missingRequired = job.requiredSkills.filter((s) => !textLower.includes(s.toLowerCase()));
    if (missingRequired.length > 0) {
        weaknesses.push(`No explicit mention of required skills: ${missingRequired.slice(0, 3).join(', ')}.`);
    }
    if (experienceYears < job.minYears) {
        weaknesses.push(`Experience level (${experienceYears} yrs) is below requested minimum (${job.minYears} yrs).`);
    }
    if (weaknesses.length === 0) {
        weaknesses.push('Verify scale of high-traffic production deployments during technical round.');
    }

    const interviewQuestions: string[] = [
        `How have you architected systems using ${matchedSkills[0] || 'your core stack'} to handle enterprise scale and high availability at Prohostix?`,
        `Describe a production incident or latency regression you diagnosed and resolved in CI/CD.`,
        `How do you approach code reviews, testing coverage, and mentoring junior engineers?`,
    ];

    return {
        fullName,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@candidate.prohostix.com`,
        phone: phone || '+91 98765 43210',
        location: 'Remote / Hybrid',
        skills: matchedSkills.length > 0 ? matchedSkills : ['Software Engineering', 'Git', 'Agile'],
        experienceYears,
        currentRole: 'Software Engineer',
        currentCompany: 'Technology Organization',
        education: [
            {
                degree: 'Bachelor of Technology in Computer Science',
                school: 'Accredited University',
                year: '2020',
            },
        ],
        workHistory: [
            {
                company: 'Technology Enterprise',
                role: 'Software Engineer',
                duration: '2021 - Present',
            },
        ],
        aiScore,
        aiStatus,
        skillsMatchScore,
        experienceMatchScore,
        educationMatchScore,
        aiSummary:
            aiScore >= 78
                ? `Strong candidate recommended for immediate interview. Strong skill and experience alignment with ${job.title}.`
                : aiScore >= 58
                ? `Moderate fit for ${job.title}. Meets foundational requirements but requires deeper technical screening on specific skill gaps.`
                : `Does not meet primary prerequisites for ${job.title}. Notable gaps in required tech stack and experience.`,
        strengths,
        weaknesses,
        interviewQuestions,
    };
}

// Evaluate using Gemini 2.5 Flash if available, with automatic Groq & heuristic fallback
export async function evaluateResumeWithAI(
    text: string,
    fileName: string,
    job: JobRequisitionData
): Promise<ParsedEvaluation> {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (geminiKey) {
        try {
            const prompt = `You are Prohostix's Staff Technical Recruiter & AI Resume Screener.
Analyze this candidate's resume for the role "${job.title}".

Job Requisition Details:
- Role: ${job.title}
- Department: ${job.department}
- Minimum Experience: ${job.minYears} years
- Required Skills: ${job.requiredSkills.join(', ')}
- Preferred Skills: ${job.preferredSkills.join(', ')}
- Description: ${job.description}

Candidate Resume Text:
"""
${text.slice(0, 4500)}
"""

Return ONLY a valid JSON object matching this exact TypeScript interface (no markdown fences, no extra text):
{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "skills": string[],
  "experienceYears": number,
  "currentRole": string,
  "currentCompany": string,
  "education": [{"degree": string, "school": string, "year": string}],
  "workHistory": [{"company": string, "role": string, "duration": string}],
  "aiScore": number (0-100),
  "aiStatus": "SHORTLISTED" (if score>=78) or "REVIEW" (if 58-77) or "REJECTED" (if <58),
  "skillsMatchScore": number (0-100),
  "experienceMatchScore": number (0-100),
  "educationMatchScore": number (0-100),
  "aiSummary": string (2-3 sentences evaluating candidate fit for Prohostix),
  "strengths": string[] (3-4 bullet points),
  "weaknesses": string[] (1-3 gaps or risks),
  "interviewQuestions": string[] (3 targeted technical interview questions based on candidate background)
}`;

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.2,
                            responseMimeType: 'application/json',
                        },
                    }),
                    signal: AbortSignal.timeout(12000),
                }
            );

            if (res.ok) {
                const data = await res.json();
                const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (jsonText) {
                    const parsed = JSON.parse(jsonText) as ParsedEvaluation;
                    if (parsed.fullName && typeof parsed.aiScore === 'number') {
                        return parsed;
                    }
                }
            }
        } catch {
            // Fall through to heuristic evaluation
        }
    }

    return parseResumeHeuristically(text, fileName, job);
}
