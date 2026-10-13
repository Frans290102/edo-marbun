import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  caseStudies,
  formatIDR,
  monthNames,
  profile,
  transactions,
  type CaseStudy,
} from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fransiskus Lucky Edo Marbun — Data Analyst Portfolio" },
      {
        name: "description",
        content:
          "Interactive data analyst portfolio of Fransiskus Lucky Edo Marbun: case studies, KPIs, and a live sales analytics playground built with SQL, Python, and Power BI expertise.",
      },
      { property: "og:title", content: "Fransiskus Lucky Edo Marbun — Data Analyst Portfolio" },
      {
        property: "og:description",
        content:
          "Explore data case studies and an interactive sales analytics dashboard by Fransiskus Lucky Edo Marbun, aspiring Data Analyst from North Sumatera, Indonesia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };
  return { dark, toggle };
}

function Index() {
  const { dark, toggle } = useTheme();
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header dark={dark} onToggleTheme={toggle} />
      <main>
        <Hero />
        <CaseStudies onOpen={setActiveCase} />
        <Playground />
        <About />
      </main>
      <Footer />
      {activeCase && <CaseModal study={activeCase} onClose={() => setActiveCase(null)} />}
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#overview", label: "Overview" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#playground", label: "Interactive Playground" },
    { href: "#about", label: "About Me" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#overview" className="font-display text-lg font-bold tracking-tight">
          Edo<span className="text-gradient">Marbun</span>
          <span className="ml-2 hidden text-xs font-normal text-muted-foreground sm:inline">
            Data Analyst Portfolio
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LinkedInIcon />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <GitHubIcon />
          </a>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="/cv-fransiskus-lucky-edo-marbun.pdf"
            download
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Download CV
          </a>
          <button
            className="rounded-md p-2 text-muted-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border px-4 py-3 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/cv-fransiskus-lucky-edo-marbun.pdf"
            download
            className="mt-2 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Download CV
          </a>
        </nav>
      )}
    </header>
  );
}

/* ---------------- Hero & KPI ---------------- */

function Hero() {
  const kpis = [
    { label: "Projects Completed", value: "12+", sub: "Analytics & BI projects" },
    { label: "Datasets Analyzed", value: "25+", sub: "Up to 12K+ rows each" },
    { label: "Core Skills", value: "10", sub: "SQL · Python · ETL · BI" },
    { label: "Main Tools", value: "6", sub: "Excel · Power BI · SQL · Python · Sheets · MySQL" },
  ];
  return (
    <section id="overview" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 0%, var(--color-chart-1) 0%, transparent 60%), radial-gradient(500px 260px at 85% 20%, var(--color-chart-2) 0%, transparent 60%)",
          opacity: 0.18,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Data Analyst Portfolio
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Turning raw data into <span className="text-gradient">clear, usable decisions</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Hi, I'm {profile.name} — an aspiring Data Analyst from {profile.location} with a strong
          foundation in data cleaning, SQL, and visualization, and hands-on experience keeping data
          accurate and workflows efficient.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#playground"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore the Playground
          </a>
          <a
            href="#case-studies"
            className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            View Case Studies
          </a>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="card-glow rounded-xl bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">{k.value}</p>
              <p className="mt-1 text-sm font-semibold">{k.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Case Studies ---------------- */

function CaseStudies({ onOpen }: { onOpen: (c: CaseStudy) => void }) {
  return (
    <section id="case-studies" className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle
        kicker="Case Studies"
        title="Selected analytics projects"
        subtitle="Real-world style analyses covering churn, sales performance, fraud detection, and workforce analytics."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {caseStudies.map((c) => (
          <article key={c.id} className="card-glow flex flex-col rounded-xl bg-card p-6">
            <div className="flex flex-wrap gap-2">
              {c.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-display mt-3 text-xl font-bold">{c.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.problem}</p>
            <p className="mt-3 border-l-2 border-primary pl-3 text-sm">
              <span className="font-semibold text-primary">Impact: </span>
              <span className="text-muted-foreground">{c.impact}</span>
            </p>
            <button
              onClick={() => onOpen(c)}
              className="mt-5 self-start rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              View Details
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CaseModal({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              {study.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-display mt-3 text-2xl font-bold">{study.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="mt-6 space-y-5 text-sm">
          <ModalBlock title="Problem Statement" body={study.problem} />
          <ModalBlock title="Methodology" body={study.methodology} />
          <ModalBlock title="Business Impact" body={study.impact} />
          <div>
            <h4 className="font-semibold text-primary">Key Insights</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
              {study.insights.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-accent">Business Recommendations</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
              {study.recommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1.5 text-muted-foreground">{body}</p>
    </div>
  );
}

/* ---------------- Interactive Playground ---------------- */

const ALL = "All";

function Playground() {
  const [category, setCategory] = useState(ALL);
  const [region, setRegion] = useState(ALL);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-12-31");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const categories = useMemo(() => [ALL, ...new Set(transactions.map((t) => t.category))], []);
  const regions = useMemo(() => [ALL, ...new Set(transactions.map((t) => t.region))], []);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (category === ALL || t.category === category) &&
          (region === ALL || t.region === region) &&
          t.date >= from &&
          t.date <= to
      ),
    [category, region, from, to]
  );

  const monthly = useMemo(() => {
    const buckets = new Array(12).fill(0);
    filtered.forEach((t) => {
      buckets[Number(t.date.slice(5, 7)) - 1] += t.revenue;
    });
    return buckets.map((revenue, i) => ({ month: monthNames[i], revenue }));
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.revenue));
    return [...map.entries()]
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const bySegment = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => map.set(t.segment, (map.get(t.segment) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q)
    );
  }, [filtered, search]);

  const totalPages = Math.max(1, Math.ceil(searched.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = searched.slice((safePage - 1) * perPage, safePage * perPage);

  const totalRevenue = filtered.reduce((s, t) => s + t.revenue, 0);

  useEffect(() => setPage(1), [category, region, from, to, search]);

  const selectCls =
    "rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <section id="playground" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          kicker="Interactive Playground"
          title="Sales & Revenue Analytics"
          subtitle="A live sample dashboard — filter by date range, product category, and region, then explore the charts and transaction table."
        />

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-end gap-3 rounded-xl bg-card p-4 card-glow">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            From
            <input type="date" value={from} min="2025-01-01" max={to} onChange={(e) => setFrom(e.target.value)} className={selectCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            To
            <input type="date" value={to} min={from} max="2025-12-31" onChange={(e) => setTo(e.target.value)} className={selectCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Region
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectCls}>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Filtered Revenue</p>
            <p className="font-display text-xl font-bold text-primary">{formatIDR(totalRevenue)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Monthly Revenue Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthly} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis
                  tickFormatter={(v: number) => formatIDR(v)}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  width={80}
                />
                <Tooltip
                  formatter={(v) => [formatIDR(Number(v)), "Revenue"]}
                  contentStyle={tooltipStyle}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue by Product Category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis
                  tickFormatter={(v: number) => formatIDR(v)}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  width={80}
                />
                <Tooltip formatter={(v) => [formatIDR(Number(v)), "Revenue"]} contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Customer Segment Distribution">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bySegment}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {bySegment.map((s, i) => (
                    <Cell key={s.name} fill={CHART_COLORS[i % CHART_COLORS.length]!} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl bg-card p-4 card-glow sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold">Transaction Summary</h3>
            <input
              type="search"
              placeholder="Search ID, product, category, region…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Region</th>
                  <th className="py-2 pr-4">Payment</th>
                  <th className="py-2 pr-4 text-right">Qty</th>
                  <th className="py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-xs">{t.id}</td>
                    <td className="py-2.5 pr-4">{t.date}</td>
                    <td className="py-2.5 pr-4">{t.product}</td>
                    <td className="py-2.5 pr-4">{t.category}</td>
                    <td className="py-2.5 pr-4">{t.region}</td>
                    <td className="py-2.5 pr-4">{t.payment}</td>
                    <td className="py-2.5 pr-4 text-right">{t.quantity}</td>
                    <td className="py-2.5 text-right font-medium">{formatIDR(t.revenue)}</td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No transactions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              {searched.length} transactions · Page {safePage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={safePage <= 1}
                onClick={() => setPage(safePage - 1)}
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40 hover:bg-secondary"
              >
                Prev
              </button>
              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage(safePage + 1)}
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40 hover:bg-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  fontSize: 12,
};

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-glow rounded-xl bg-card p-4 sm:p-6 ${className}`}>
      <h3 className="font-display mb-4 text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

/* ---------------- About & Contact ---------------- */

function About() {
  const [sent, setSent] = useState(false);
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle
        kicker="About Me"
        title="Hi, I'm Edo 👋"
        subtitle="Aspiring Data Analyst · B.Sc. Computer Science, Universitas Prima Indonesia (2020–2024)"
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Previously completed an internship at <span className="font-semibold text-foreground">Telkom Indonesia</span> as
            Data Entry & Administrator, where I processed daily data with high accuracy, ran data
            quality checks, and built Excel/Sheets templates that sped up repetitive work.
          </p>
          <h4 className="font-display mt-6 text-sm font-bold uppercase tracking-wide text-primary">
            Technical Skills
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
          <h4 className="font-display mt-6 text-sm font-bold uppercase tracking-wide text-accent">
            Key Competencies
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.competencies.map((c) => (
              <span key={c} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="card-glow rounded-xl bg-card p-6">
          <h3 className="font-display text-lg font-bold">Get in touch</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Interested in working together or have a question? Send a message.
          </p>
          {sent ? (
            <div className="mt-6 rounded-md border border-accent/40 bg-accent/10 p-4 text-sm">
              Thanks! Your message has been noted. You can also reach me directly at{" "}
              <a href={`mailto:${profile.email}`} className="font-semibold text-primary underline">
                {profile.email}
              </a>
              .
            </div>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your project or opportunity…"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          )}
          <div className="mt-6 space-y-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
            <p>📍 {profile.location}</p>
            <p>
              ✉️{" "}
              <a href={`mailto:${profile.email}`} className="hover:text-foreground">
                {profile.email}
              </a>
            </p>
            <p>📞 {profile.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

/* ---------------- Shared ---------------- */

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{kicker}</p>
      <h2 className="font-display mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-muted-foreground">
        <p>© 2026 {profile.name} · Data Analyst Portfolio</p>
        <div className="flex gap-4">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-foreground">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Icons ---------------- */

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
