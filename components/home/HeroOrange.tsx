import Link from 'next/link';
import styles from './HeroOrange.module.css';
import HeroCrmShowcase from './HeroCrmShowcase';

export default function HeroOrange() {
    return (
        <section className={styles.hero} aria-labelledby="orange-hero-title">
            <div className={styles.inner}>
                <div className={styles.leftCopy}>
                    <p className={styles.eyebrow}>Unlock your<br />business potential<br />with expert<br />software.</p>
                    <p className={styles.support}>From practical strategy to dependable delivery, we build technology that moves your business forward.</p>
                    <Link className={styles.cta} href="/lets-talk">Start a project</Link>
                </div>

                <h1 id="orange-hero-title" className={styles.headline}>
                    <span>Custom</span>
                    <span>Software</span>
                    <span>Studio</span>
                </h1>
                <p className={styles.headlineNote}>Strategy, product design and engineering brought together to build systems that scale with you.</p>

                <HeroCrmShowcase />

                <div className={styles.metrics} aria-label="Our approach">
                    <div className={`${styles.metric} ${styles.metricLight}`}>
                        <span className={styles.metricKicker}>Built for<br />your workflow</span>
                        <span className={styles.metricValue}>01</span>
                        <span className={styles.metricLabel}>Purpose before features.</span>
                    </div>
                    <div className={styles.metric}>
                        <span className={styles.metricKicker}>Designed to<br />grow with you</span>
                        <span className={styles.metricValue}>∞</span>
                        <span className={styles.metricLabel}>Scalable by design.</span>
                    </div>
                </div>

                <Link className={styles.growthCard} href="/case-studies">
                    <span className={styles.growthTitle}>Your partner in business growth</span>
                    <span className={styles.growthArrow}>↘</span>
                    <span className={styles.growthMeta}>Explore how focused software turns operational challenges into lasting advantage.</span>
                </Link>

                <div className={styles.giantWord} aria-hidden="true">PROHOSTIX</div>
            </div>

            <div className={styles.services}>
                <span className={styles.serviceTitle}>What we build</span>
                <div className={styles.servicePills}>
                    <Link className={styles.pill} href="/services/custom-software">Custom software</Link>
                    <Link className={styles.pill} href="/solutions/erp-systems">ERP systems</Link>
                    <Link className={styles.pill} href="/services/saas-development">SaaS platforms</Link>
                    <Link className={styles.pill} href="/services/mobile-development">Mobile apps</Link>
                    <Link className={styles.pill} href="/services/cloud-devops">Cloud &amp; DevOps</Link>
                </div>
            </div>
        </section>
    );
}
