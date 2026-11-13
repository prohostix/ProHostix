'use client';
import React from "react";
import { motion } from "framer-motion";
import { Asterisk, Zap, Database, Cloud, Mail, Workflow, ShieldCheck, Smartphone, Server, MousePointer2 } from "lucide-react";
import { PAGE_CONTENT } from "../../data/staticContent";

/* ---------------------------------------------
   SMALL PIECES
---------------------------------------------- */
const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-8%" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** Emerald circle with an asterisk — the section's bullet mark */
function Mark({ size = 22 }: { size?: number }) {
    return (
        <span
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-400 text-black"
            style={{ width: size, height: size }}
        >
            <Asterisk size={size * 0.65} strokeWidth={2.6} />
        </span>
    );
}

const CARD =
    "relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.02] transition-colors duration-500 hover:border-emerald-500/30";

/* ---------------------------------------------
   TOP-ROW VISUALS
---------------------------------------------- */
const BARS = [22, 34, 40, 30, 52, 44, 66, 48, 38, 58, 74, 50, 42, 60, 36, 46];

function InsightsVisual({ label }: { label: string }) {
    return (
        <div className="relative mx-auto h-[210px] w-full max-w-[290px]">
            <div className="absolute inset-x-6 top-0 h-full rounded-2xl bg-white/[0.03]" />
            <div className="absolute inset-x-0 top-3 rounded-2xl border border-white/[0.06] bg-[#101412] px-5 pb-4 pt-4">
                <p className="mb-3 text-sm font-medium text-emerald-400">{label}</p>
                <div className="flex h-[96px] items-end justify-between gap-[5px]">
                    {BARS.map((h, i) => (
                        <motion.span
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.04, ease: "easeOut" }}
                            className="w-[5px] rounded-full bg-gradient-to-t from-emerald-600 to-emerald-300"
                        />
                    ))}
                </div>
                <div className="mt-3 flex justify-between text-[9px] text-white/30">
                    <span>Jan 10</span>
                    <span>Jan 11</span>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
}

function ReleaseVisual() {
    return (
        <div className="relative mx-auto h-[210px] w-full max-w-[290px]">
            <div className="absolute inset-x-10 top-6 flex h-10 items-center rounded-t-2xl border border-white/[0.05] bg-white/[0.03] px-5">
                <span className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-white/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" /> Reviewed
                </span>
            </div>
            <div className="absolute inset-x-0 top-[52px] flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#111513] p-3.5 shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-black">
                    <Zap size={22} className="fill-emerald-400 text-emerald-400" />
                </span>
                <div>
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> New
                    </p>
                    <p className="text-base font-medium text-white">Latest release</p>
                    <p className="text-[11px] text-white/35">Today, 11:50</p>
                </div>
            </div>
            <div className="absolute inset-x-8 top-[142px] space-y-3 opacity-40">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-px w-full border-t border-dashed border-emerald-400/50" />
                ))}
            </div>
        </div>
    );
}

function GrowthVisual() {
    return (
        <div className="relative mx-auto h-[210px] w-full max-w-[290px]">
            <div className="absolute inset-0 flex justify-between px-2 pt-10 text-[9px] text-white/15">
                {["45", "35", "25", "5", "0", "-5"].map((n) => (
                    <span key={n} className="border-l border-dashed border-white/10 pl-1.5">{n}</span>
                ))}
            </div>
            <div className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-2xl" />
            <svg viewBox="0 0 290 210" className="absolute inset-0 h-full w-full" fill="none">
                <motion.path
                    d="M10 190 C 70 180, 90 150, 120 150 C 160 150, 170 175, 195 120 C 215 75, 225 40, 275 20"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                />
                <circle cx="198" cy="112" r="16" fill="#34d399" fillOpacity="0.18" />
                <circle cx="198" cy="112" r="7" fill="#34d399" />
            </svg>
        </div>
    );
}

/* ---------------------------------------------
   BOTTOM-ROW VISUALS
---------------------------------------------- */
const TOOL_ICONS_TOP = [Database, Cloud, Mail];
const TOOL_ICONS_BOTTOM = [Workflow, ShieldCheck, Server, Smartphone];

function ToolBadge({ Icon }: { Icon: React.ComponentType<any> }) {
    return (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#131715] shadow-lg">
            <Icon size={26} className="text-emerald-300" strokeWidth={1.6} />
        </span>
    );
}

function Avatars() {
    const people = [
        { initials: "DA", ring: "ring-violet-500", bg: "bg-rose-900/80" },
        { initials: "RK", ring: "ring-sky-400", bg: "bg-slate-700" },
        { initials: "SN", ring: "ring-emerald-300", bg: "bg-amber-900/70" },
    ];
    return (
        <div className="relative flex items-center">
            <div className="flex -space-x-2">
                {people.map((p) => (
                    <span
                        key={p.initials}
                        className={`flex h-16 w-16 items-center justify-center rounded-full text-base font-semibold text-white ring-4 ${p.ring} ${p.bg}`}
                    >
                        {p.initials}
                    </span>
                ))}
                <span className="h-16 w-16 rounded-full border-4 border-white/[0.06] bg-white/[0.03]" />
            </div>
            <MousePointer2 size={18} className="absolute left-[168px] top-[48px] fill-white text-white" />
            <span className="absolute left-[178px] top-[62px] rounded-full bg-emerald-400 px-4 py-1 text-sm font-semibold text-black">
                Dilshad
            </span>
        </div>
    );
}

/* ---------------------------------------------
   MAIN SECTION
---------------------------------------------- */
export default function ScalableIntelligence() {
    const data: any = PAGE_CONTENT.home.scalable_intelligence;
    const { title, caption, eyebrow, capabilities = [], integration, collaboration, chips = [] } = data;
    const visuals = [
        <InsightsVisual key="v1" label="Insights" />,
        <ReleaseVisual key="v2" />,
        <GrowthVisual key="v3" />,
    ];

    return (
        <section className="relative w-full overflow-hidden border-t border-white/5 bg-black py-24">
            <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
                {/* HEADER */}
                <motion.div {...fadeUp} className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center">
                    <span className="mb-5 inline-flex items-center gap-2 text-sm text-white/80">
                        <Mark size={20} /> {eyebrow}
                    </span>
                    <h2 className="mb-5 bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-transparent md:text-6xl">
                        {title}
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/50 md:text-lg">{caption}</p>
                </motion.div>

                {/* TOP ROW — 3 capability cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {capabilities.slice(0, 3).map((cap: any, i: number) => (
                        <motion.div
                            key={cap.id}
                            {...fadeUp}
                            transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                            className={`${CARD} flex h-[430px] flex-col p-8`}
                        >
                            <div className="flex flex-1 items-center">{visuals[i]}</div>
                            <h3 className="mb-2 text-2xl font-normal tracking-tight text-white">{cap.title}</h3>
                            <p className="line-clamp-2 text-[15px] leading-relaxed text-white/45">{cap.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* BOTTOM ROW — 2 wide cards */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.div {...fadeUp} className={`${CARD} flex min-h-[210px] items-center`}>
                        <div className="relative z-10 w-[44%] p-8">
                            <h3 className="mb-3 text-2xl font-normal leading-tight tracking-tight text-white">{integration.title}</h3>
                            <p className="text-[15px] leading-relaxed text-white/45">{integration.desc}</p>
                        </div>
                        <div className="pointer-events-none absolute -right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
                            <div className="flex gap-3 pr-4">{TOOL_ICONS_TOP.map((I, i) => <ToolBadge key={i} Icon={I} />)}</div>
                            <div className="flex gap-3 pl-12">{TOOL_ICONS_BOTTOM.map((I, i) => <ToolBadge key={i} Icon={I} />)}</div>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.1 }}
                        className={`${CARD} flex min-h-[210px] items-center`}
                    >
                        <div className="relative z-10 w-[44%] p-8">
                            <h3 className="mb-3 text-2xl font-normal leading-tight tracking-tight text-white">{collaboration.title}</h3>
                            <p className="text-[15px] leading-relaxed text-white/45">{collaboration.desc}</p>
                        </div>
                        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 sm:block">
                            <Avatars />
                        </div>
                        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
                    </motion.div>
                </div>

                {/* CHIPS */}
                <motion.div {...fadeUp} className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-4">
                    {chips.map((chip: string) => (
                        <span
                            key={chip}
                            className="inline-flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 text-[15px] text-white/60"
                        >
                            <Mark size={20} /> {chip}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
