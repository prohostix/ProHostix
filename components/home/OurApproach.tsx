'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './OurApproach.module.css';

const phases = [
    { number: '01', label: 'Architecture', title: 'Reliability by design', copy: 'ERP and CRM systems architected with redundancy, fault tolerance and proven patterns for dependable performance.' },
    { number: '02', label: 'Deployment', title: 'Scalable cloud delivery', copy: 'Cloud-native infrastructure with controlled rollouts, backup strategies and region-aware scaling.' },
    { number: '03', label: 'Observability', title: 'Active systems tracking', copy: 'Post-deployment monitoring, alerting and operational visibility help teams respond proactively.' },
    { number: '04', label: 'Operations', title: 'Long-term control', copy: 'Deep observability and maintainable systems keep infrastructure stable as operations grow.' },
];

export default function OurApproach() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className={`${styles.section} ${visible ? styles.visible : ''}`} aria-labelledby="approach-title">
            <div className={styles.frame}>
                <header className={`${styles.cell} ${styles.intro}`}>
                    <p className={styles.kicker}>Our approach · ProHostix</p>
                    <h2 id="approach-title" className={styles.title}>Engineering &amp;<br /><span>operations.</span></h2>
                </header>
                <div className={`${styles.cell} ${styles.manifesto}`}>
                    <p>We follow disciplined engineering and operational practices to ensure every product is <strong>reliable, secure and built to perform in real-world business environments.</strong></p>
                </div>
                {phases.map((phase, index) => (
                    <article key={phase.number} style={{ '--phase-delay': `${180 + index * 65}ms` } as CSSProperties} className={`${styles.cell} ${styles.phase} ${[styles.phaseOne, styles.phaseTwo, styles.phaseThree, styles.phaseFour][index]}`}>
                        <div className={styles.phaseTop}><span className={styles.phaseLabel}>{phase.label}</span><span className={styles.phaseNumber}>{phase.number}</span></div>
                        <div className={styles.phaseText}><h3>{phase.title}</h3><p className={styles.phaseCopy}>{phase.copy}</p></div>
                    </article>
                ))}
                <figure className={`${styles.cell} ${styles.visual}`}>
                    <img src="/images/approach/engineering-operations-v2.png" alt="A resilient distributed cloud and operations control system" />
                    <figcaption className={styles.visualTag}>Operational focus · visible control</figcaption>
                </figure>
                <aside className={`${styles.cell} ${styles.outcome}`}>
                    <span className={styles.outcomeMark}>✣</span>
                    <h3>Built for long-term control in engineering and operations.</h3>
                    <div className={styles.outcomeFooter}><p>Every system we deliver is engineered for reliability, deep observability and long-term maintainability—so your infrastructure scales with confidence.</p><span className={styles.outcomeArrow}>↗</span></div>
                </aside>
            </div>
        </section>
    );
}
