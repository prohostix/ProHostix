'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PioneerWork.module.css';

const projects = [
    { id: 'pype-crm', title: 'Pype CRM', image: '/images/hero/prohostix-crm-dashboard.png', tags: ['CRM', 'Automation'] },
    { id: 'pype-erm', title: 'Pype ERM', image: '/software_solution_visual.jpg', tags: ['ERP', 'Education'] },
    { id: 'collabo', title: 'Collabo', image: '/software-illustration.jpg', tags: ['Collaboration', 'Enterprise'] },
    { id: 'skilldad-lms', title: 'SkillDad LMS', image: '/cognitive-design.png', tags: ['LMS', 'EdTech'] },
];

export default function PioneerWork() {
    const router = useRouter();
    const sectionRef = useRef<HTMLElement>(null);
    const [activeStep, setActiveStep] = useState(0);
    const maxStep = Math.max(0, projects.length - 3);
    const visibleSlots = [0, 1, 2].map((slot) => {
        const replacements = activeStep <= slot ? 0 : Math.floor((activeStep - 1 - slot) / 3) + 1;
        const projectIndex = slot + replacements * 3;
        return { slot, projectIndex, project: projects[projectIndex] };
    }).filter((item) => item.project);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const next = Math.min(maxStep, Math.max(0, Math.floor(value * (maxStep + .999))));
        setActiveStep((current) => current === next ? current : next);
    });

    return (
        <section ref={sectionRef} className={styles.section} aria-labelledby="featured-work-title">
            <motion.div className={styles.board} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>
                <div className={styles.headingRow}>
                    <div className={styles.headingWrap}><h2 id="featured-work-title">Works</h2><sup>({String(projects.length).padStart(3, '0')})</sup></div>
                    <p>Our own products, built for clarity, resilience and measurable business impact.</p>
                </div>

                <div className={styles.projects}>
                    {visibleSlots.map(({ slot, projectIndex, project }) => (
                        <div key={slot} className={styles.projectSlot} style={{ gridColumn: slot + 1 }}>
                            <AnimatePresence initial={false} mode="wait">
                                <motion.article
                                    key={project.id}
                                    className={styles.project}
                                    initial={{ opacity: 0, y: 12, scale: .992, filter: 'blur(5px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: .72, delay: .06, ease: [.22, 1, .36, 1] } }}
                                    exit={{ opacity: 0, y: -8, scale: .992, filter: 'blur(5px)', transition: { duration: .52, ease: [.4, 0, .2, 1] } }}
                                    onClick={() => router.push('/case-studies')}
                                >
                                    <div className={styles.projectMeta}><span>{String(projectIndex + 1).padStart(2, '0')}</span><div><strong>{project.title}</strong><small>{(project.tags || []).slice(0, 2).join(' / ')}</small></div></div>
                                    <div className={styles.imageWrap}><img src={project.image} alt={project.title} /><span>View project ↗</span></div>
                                </motion.article>
                            </AnimatePresence>
                        </div>
                    ))}
                    <span className={styles.dragCue} aria-hidden="true">Scroll</span>
                </div>

            </motion.div>
        </section>
    );
}
