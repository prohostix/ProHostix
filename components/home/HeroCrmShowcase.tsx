import styles from './HeroOrange.module.css';

const kpis = [
    ['Exp. Revenue', '₹0', 'green'], ['Pipeline', '0', 'orange'],
    ['Follow-ups', '2,374', 'red'], ['Won', '9', 'green'],
    ['Lost Deals', '0', 'red'], ['Revenue', '₹10.2K', 'blue'],
];

const stages = [
    ['New', '40', 'violet'], ['Contacted', '83', 'blue'],
    ['Interested', '10', 'green'], ['Qualified', '0', 'orange'],
    ['Won', '2', 'green'], ['Lost', '89', 'red'],
    ['Follow up', '114', 'pink'], ['Disqualified', '2', 'yellow'],
];

export default function HeroCrmShowcase() {
    return (
        <section className={styles.crmShowcase} aria-label="Animated ProHostix CRM dashboard">
            <div className={styles.crmGlow} aria-hidden="true" />
            <div className={styles.crmDashboardFrame}>
                <aside className={styles.replicaRail} aria-label="CRM navigation">
                    <b>P</b><span className={styles.replicaActive}>▦</span><span>♙</span><span>↔</span><span>◷</span><span>↻</span><span>◎</span>
                </aside>
                <main className={styles.replicaMain}>
                    <header className={styles.replicaHeader}>
                        <div className={styles.replicaSearch}>⌕ <span>Search leads, contacts, accounts...</span></div>
                        <div className={styles.replicaTools}><i className={styles.livePulse} /> ⚡　♧　⚙　<span>M</span></div>
                    </header>

                    <div className={styles.replicaTitle}>
                        <div><h3>Dashboard <span>👋</span></h3><p>Here&apos;s what&apos;s happening with your CRM today.</p></div>
                        <div><button>All Branches⌄</button><button>▣ This Month⌄</button></div>
                    </div>

                    <div className={styles.replicaKpis}>
                        {kpis.map(([label, value, tone], index) => <article key={label} style={{ animationDelay: `${index * 90}ms` }}><i className={styles[`tone${tone}`]} /><small>{label}</small><strong>{value}</strong></article>)}
                    </div>
                    <div className={styles.replicaWin}><span>Win Rate (this month)</span><i><b /></i><strong>100%</strong></div>

                    <div className={styles.replicaAlerts}>
                        <article><b>♙</b><span><strong>Unattended Leads <em>35</em></strong><small>Assigned but never contacted</small></span><i>→</i></article>
                        <article><b>◷</b><span><strong>No Activity Leads <em>2,921</em></strong><small>No update in 30+ days</small></span><i>→</i></article>
                    </div>

                    <div className={styles.replicaBody}>
                        <section className={styles.replicaCalls}>
                            <header><strong>⌕ Call Overview</strong><span>View Report →</span></header>
                            <div className={styles.replicaGauge}><i /><b>26%</b><small>Connected</small></div>
                            <footer><span><b>2,097</b>Connected Calls</span><span><b>7,952</b>Total Calls</span></footer>
                        </section>
                        <section className={styles.replicaStages}>
                            <header><strong>⌁ Leads by Stage</strong><button>All Campaigns⌄</button></header>
                            <div>{stages.map(([label, value, tone]) => <article key={label}><span><i className={styles[`tone${tone}`]} />{label}</span><b>{value}</b></article>)}</div>
                        </section>
                    </div>
                    <div className={styles.replicaFooterPanels}>
                        <section><header><strong>✣ User Trends</strong><span>Last 7 days</span></header><div className={styles.trendChart}><i /><i /><i /><i /><i /><i /><i /></div></section>
                        <section><header><strong>♙ User Ranking</strong><button>View All</button></header><div className={styles.rankingRows}><span><b>AK</b><i>Akshay Kumar</i><strong>126 calls</strong></span><span><b>SM</b><i>Sarah Mathew</i><strong>98 calls</strong></span></div></section>
                    </div>
                </main>
                <span className={styles.replicaShine} aria-hidden="true" />
            </div>

            <div className={`${styles.crmFloatCard} ${styles.crmFloatLeads}`}>
                <span className={styles.floatCardLabel}>Leads by stage</span>
                <div><span><i className={styles.dotViolet} />New<strong>40</strong></span><span><i className={styles.dotBlue} />Contacted<strong>83</strong></span></div>
            </div>
            <div className={`${styles.crmFloatCard} ${styles.crmFloatCalls}`}>
                <span className={styles.floatCardLabel}>Call overview</span>
                <div className={styles.miniGauge}><i /><strong>26%</strong><small>Connected</small></div>
            </div>
        </section>
    );
}
