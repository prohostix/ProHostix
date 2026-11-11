'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './ProhostixHeroEmbed.module.css';
import layout from './HeroOrange.module.css';

type ProhostixHeroEmbedProps = {
  active: boolean;
};

/**
 * The supplied Prohostix WebGL hero is kept mounted between route changes.
 * Its bundle owns the canvas and reads scroll progress from data-px-hero.
 */
export default function ProhostixHeroEmbed({ active }: ProhostixHeroEmbedProps) {
  const syncCanvas = () => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    });
  };

  useEffect(() => {
    if (active) syncCanvas();
  }, [active]);

  return (
    <section
      className={`${styles.hero} ${active ? '' : styles.hidden}`}
      data-px-hero
      aria-label="Prohostix product experience"
      aria-hidden={!active}
    >
      <div className={styles.sticky}>
        <canvas id="c" className={styles.canvas} />
        <div className={styles.layout}>
          <div className={layout.inner}>
            <div className={layout.leftCopy}>
              <p className={`${layout.eyebrow} ${styles.eyebrow}`}>
                <span>Unlock your</span>
                <span>Business potential</span>
                <span>With expert</span>
                <span>Software.</span>
              </p>
              <p className={`${layout.support} ${styles.support}`}>From practical strategy to dependable delivery, we build technology that moves your business forward.</p>
              <Link className={layout.cta} href="/lets-talk">Start a project</Link>
            </div>

            <h1 className={`${layout.headline} ${styles.headline}`}>
              <span>Custom</span>
              <span>Software</span>
              <span>Studio</span>
            </h1>
            <p className={`${layout.headlineNote} ${styles.headlineNote}`}>Strategy, product design and engineering brought together to build systems that scale with you.</p>

            <div className={`${layout.metrics} ${styles.metrics}`} aria-label="Our approach">
              <div className={`${layout.metric} ${layout.metricLight}`}>
                <span className={`${layout.metricKicker} ${styles.metricKicker}`}>Built for<br />your workflow</span>
                <span className={layout.metricValue}>01</span>
                <span className={layout.metricLabel}>Purpose before features.</span>
              </div>
              <div className={layout.metric}>
                <span className={`${layout.metricKicker} ${styles.metricKicker}`}>Designed to<br />grow with you</span>
                <span className={layout.metricValue}>∞</span>
                <span className={layout.metricLabel}>Scalable by design.</span>
              </div>
            </div>

            <Link className={`${layout.growthCard} ${styles.growthCard}`} href="/case-studies">
              <span className={`${layout.growthTitle} ${styles.growthTitle}`}>Your partner in business growth</span>
              <span className={layout.growthArrow}>↘</span>
              <span className={`${layout.growthMeta} ${styles.growthMeta}`}>Explore how focused software turns operational challenges into lasting advantage.</span>
            </Link>

            <div className={`${layout.giantWord} ${styles.giantWord}`} aria-hidden="true">PROHOSTIX</div>
          </div>

          <div className={`${layout.services} ${styles.services}`}>
            <span className={layout.serviceTitle}>What we build</span>
            <div className={layout.servicePills}>
              <Link className={layout.pill} href="/services/custom-software">Custom software</Link>
              <Link className={layout.pill} href="/solutions/erp-systems">ERP systems</Link>
              <Link className={layout.pill} href="/services/saas-development">SaaS platforms</Link>
              <Link className={layout.pill} href="/services/mobile-development">Mobile apps</Link>
              <Link className={layout.pill} href="/services/cloud-devops">Cloud &amp; DevOps</Link>
            </div>
          </div>
        </div>
      </div>
      <Script
        src="/embeds/prohostix-hero.js?v=20261110-2"
        strategy="afterInteractive"
        onLoad={syncCanvas}
      />
    </section>
  );
}
