import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   NOVAFORGE — MULTI-PAGE (HASH ROUTING)
   Works in artifacts + deploys to Vercel
   Igloo-style aura cards, grain, transitions
   ═══════════════════════════════════════════════ */

function useReveal(th = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: th, rootMargin: "0px 0px -30px 0px" });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return [ref, vis];
}

function AnimC({ target, suffix = "", prefix = "", active, dur = 2200 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let c = 0; const inc = target / (dur / 16);
    const t = setInterval(() => { c += inc; if (c >= target) { setV(target); clearInterval(t); } else setV(Math.floor(c)); }, 16);
    return () => clearInterval(t);
  }, [active, target, dur]);
  return <>{prefix}{v.toLocaleString()}{suffix}</>;
}

function R({ children, delay = 0, y = 40 }) {
  const [ref, vis] = useReveal(0.08);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.98)`, transition: `all 0.8s cubic-bezier(0.25,1,0.5,1) ${delay}ms` }}>{children}</div>;
}

function AuraCard({ children, glow = "rgba(255,140,66,0.1)", hGlow = "rgba(255,140,66,0.22)", border = "rgba(255,255,255,0.05)", style = {} }) {
  const [h, setH] = useState(false);
  const [mp, setMp] = useState({ x: 50, y: 50 });
  const ref = useRef(null);
  const onM = useCallback((e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }, []);
  return (
    <div ref={ref} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onMouseMove={onM}
      style={{ position: "relative", borderRadius: 24, padding: 1, background: h ? `linear-gradient(135deg, ${hGlow}, transparent 60%)` : `linear-gradient(135deg, ${border}, rgba(255,255,255,0.02))`, transition: "all 0.5s cubic-bezier(0.25,1,0.5,1)", transform: h ? "translateY(-6px)" : "translateY(0)", cursor: "default", ...style }}>
      <div style={{ borderRadius: 23, background: h ? `radial-gradient(ellipse at ${mp.x}% ${mp.y}%, ${glow}, #111118 70%)` : "#111118", transition: "background 0.4s", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 2, padding: 32 }}>{children}</div>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 1 }} />
      </div>
      <div style={{ position: "absolute", inset: -2, borderRadius: 26, zIndex: -1, background: h ? `radial-gradient(ellipse at ${mp.x}% ${mp.y}%, ${hGlow}, transparent 70%)` : "transparent", filter: "blur(24px)", opacity: h ? 1 : 0, transition: "opacity 0.5s", pointerEvents: "none" }} />
    </div>
  );
}

function Tag({ children, color = "#FF8C42" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, background: `${color}0C`, border: `1px solid ${color}20`, fontSize: 11, fontWeight: 700, color, letterSpacing: 3, textTransform: "uppercase" }}>{children}</span>;
}

function Orb({ style: s }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", ...s }} />;
}

function Sec({ children, style = {} }) {
  return <section style={{ position: "relative", padding: "100px 32px", overflow: "hidden", ...style }}>{children}</section>;
}

/* ═══ PAGES ═══ */

function HomePage({ go }) {
  const [sR, sV] = useReveal(0.2);
  return (
    <>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "130px 32px 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,140,66,0.07), transparent 60%)", pointerEvents: "none" }} />
        <Orb style={{ width: 500, height: 500, top: "5%", right: "-5%", background: "radial-gradient(circle, rgba(255,140,66,0.06), transparent 65%)", animation: "f1 20s ease-in-out infinite" }} />
        <Orb style={{ width: 400, height: 400, bottom: "10%", left: "-3%", background: "radial-gradient(circle, rgba(139,92,246,0.05), transparent 65%)", animation: "f2 24s ease-in-out infinite" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <R delay={100}><Tag><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399", display: "inline-block", animation: "gp 2s infinite" }} />AI Automation</Tag></R>
          <R delay={300}><h1 style={{ fontSize: "clamp(38px, 8vw, 76px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: -3, marginTop: 28, marginBottom: 24 }}>Stop doing<br/>things <span style={{ background: "linear-gradient(135deg, #FF6B1A, #FF8C42, #FFB347, #FBBF24)", backgroundSize: "250%", animation: "gs 5s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>manually.</span></h1></R>
          <R delay={450}><p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 500, marginBottom: 44, fontWeight: 300 }}>AI systems that turn your <span style={{ color: "#FF4D6A", fontWeight: 600 }}>25-minute</span> tasks into <span style={{ color: "#34D399", fontWeight: 600 }}>47-second</span> automated workflows. Instant lead intelligence. Zero effort.</p></R>
          <R delay={600}><div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => go("demo")} style={{ background: "linear-gradient(135deg, #FF6B1A, #FF8C42)", color: "#fff", padding: "16px 36px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 8px 40px rgba(255,107,26,0.3)" }}>Watch it Work →</button>
            <button onClick={() => go("pricing")} style={{ padding: "16px 36px", borderRadius: 14, fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>View Pricing</button>
          </div></R>
        </div>
      </section>

      <section ref={sR} style={{ padding: "50px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 28, maxWidth: 880, margin: "0 auto" }}>
          {[{ to: 2847, s: "", l: "Leads Processed", g: "linear-gradient(135deg, #4DA3FF, #00C6FF)" }, { to: 47, s: "s", l: "Avg Response", g: "linear-gradient(135deg, #FF8C42, #FFB347)" }, { to: 124, s: "hrs", l: "Saved Monthly", g: "linear-gradient(135deg, #34D399, #6EE7B7)" }, { to: 38, s: "%", p: "+", l: "Conversions Up", g: "linear-gradient(135deg, #A78BFA, #C4B5FD)" }].map((st, i) => (
            <R key={i} delay={i * 100}><div style={{ textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, fontFamily: "'Space Mono', monospace", background: st.g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}><AnimC target={st.to} suffix={st.s} prefix={st.p || ""} active={sV} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 3, textTransform: "uppercase", marginTop: 6, fontWeight: 600 }}>{st.l}</div>
            </div></R>))}
        </div>
      </section>

      <Sec>
        <R><h2 style={{ fontSize: "clamp(28px, 6.5vw, 56px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: -3, textAlign: "center", maxWidth: 660, margin: "0 auto" }}>This isn't just automation.<br/><span style={{ background: "linear-gradient(135deg, #FF4D6A, #FF8C42, #FBBF24)", backgroundSize: "250%", animation: "gs 5s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>It's a competitive edge.</span></h2></R>
        <R delay={200}><p style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", textAlign: "center", maxWidth: 480, margin: "24px auto 0", lineHeight: 1.8, fontWeight: 300 }}>While competitors check email at 9am, your AI has already scored, enriched, and responded to every overnight lead.</p></R>
        <R delay={350}><div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 44, flexWrap: "wrap" }}>
          <button onClick={() => go("demo")} style={{ background: "linear-gradient(135deg, #FF6B1A, #FF8C42)", color: "#fff", padding: "14px 32px", borderRadius: 14, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 30px rgba(255,107,26,0.25)" }}>See Live Demo →</button>
          <button onClick={() => go("features")} style={{ padding: "14px 32px", borderRadius: 14, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>Explore Features</button>
        </div></R>
      </Sec>

      <Sec>
        <R><div style={{ textAlign: "center", marginBottom: 44 }}><Tag color="#A78BFA">Results</Tag><h2 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, letterSpacing: -2, marginTop: 20 }}>Don't take my word for it.</h2></div></R>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, maxWidth: 840, margin: "0 auto" }}>
          {[{ q: "Spent 3 hours daily on leads. Now 3 minutes reviewing what AI handled.", n: "Amara O.", r: "Interior Design", gl: "rgba(255,140,66,0.08)", hg: "rgba(255,140,66,0.18)" }, { q: "Paid for itself week one. A hot lead got flagged and closed same day.", n: "David P.", r: "Marketing Agency", gl: "rgba(251,191,36,0.08)", hg: "rgba(251,191,36,0.18)" }, { q: "47s response. Clients think I have a team. It's just me.", n: "Rachel K.", r: "SaaS Founder", gl: "rgba(52,211,153,0.08)", hg: "rgba(52,211,153,0.18)" }].map((t, i) => (
            <R key={i} delay={i * 120}><AuraCard glow={t.gl} hGlow={t.hg}>
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>{Array(5).fill(0).map((_, j) => <span key={j} style={{ fontSize: 13, color: "#FBBF24" }}>★</span>)}</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontStyle: "italic", minHeight: 60 }}>"{t.q}"</p>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{t.n}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{t.r}</div></div>
            </AuraCard></R>))}
        </div>
      </Sec>

      <Sec style={{ paddingBottom: 120 }}>
        <Orb style={{ width: 500, height: 500, top: "10%", left: "20%", background: "radial-gradient(circle, rgba(255,140,66,0.05), transparent 60%)", animation: "f1 16s ease-in-out infinite" }} />
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <R><h2 style={{ fontSize: "clamp(32px, 7vw, 56px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -3 }}>Ready? <span style={{ background: "linear-gradient(135deg, #FF6B1A, #FFB347, #FBBF24)", backgroundSize: "250%", animation: "gs 5s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Let's build.</span></h2></R>
          <R delay={200}><button onClick={() => go("contact")} style={{ marginTop: 32, background: "linear-gradient(135deg, #FF6B1A, #FF8C42, #FFB347)", backgroundSize: "200%", animation: "gs 4s ease infinite", color: "#fff", padding: "18px 48px", borderRadius: 16, fontSize: 17, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 8px 50px rgba(255,107,26,0.3)" }}>🔥 Get a Quote</button></R>
        </div>
      </Sec>
    </>
  );
}

/* ═══ DEMO ═══ */
const LD = [
  { n: "Sarah Chen", co: "TechStartup.io", msg: "Need AI chatbot for SaaS. Budget £5K, 3 weeks.", sc: 92, tier: "HOT", tc: "#FF4D6A" },
  { n: "Priya Sharma", co: "Growth Agency", msg: "n8n CRM automation, 12 accounts. £2–3K.", sc: 87, tier: "HOT", tc: "#FF4D6A" },
  { n: "James Murphy", co: "Corner Café", msg: "Maybe online ordering? Not sure.", sc: 45, tier: "WARM", tc: "#FFB547" },
  { n: "Tom Williams", co: "University", msg: "Uni project. Not much budget.", sc: 18, tier: "COLD", tc: "#6B7B8D" },
];
const PP = [{ ic: "📩", l: "Captured", c: "#4DA3FF" }, { ic: "🧠", l: "Enriched", c: "#A78BFA" }, { ic: "⚡", l: "Scored", c: "#FBBF24" }, { ic: "🔀", l: "Routed", c: "#FF8C42" }, { ic: "🚀", l: "Executed", c: "#34D399" }];
const EN = { 0: { industry: "SaaS", size: "15–50", revenue: "£500K–£2M", intent: "High", budget: "£5,000", urgency: "3 weeks" }, 1: { industry: "Marketing", size: "10–25", revenue: "£200K–£1M", intent: "High", budget: "£2–3K", urgency: "ASAP" }, 2: { industry: "F&B", size: "1–5", revenue: "<£100K", intent: "Low", budget: "Unknown", urgency: "None" }, 3: { industry: "Education", size: "N/A", revenue: "N/A", intent: "None", budget: "£0", urgency: "None" } };
const AC = { HOT: ["🔔 Slack alert — 0.3s", "📧 AI email — 12s", "📋 CRM deal — 18s", "📅 Booking link — 24s"], WARM: ["📧 Nurture sequence — 0.5s", "📋 CRM contact — 8s", "⏰ Follow-up — 12s"], COLD: ["📧 Newsletter — 0.5s", "📋 Low-priority — 5s"] };

function DemoPage() {
  const [li, setLi] = useState(0);
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState(false);
  const t = useRef(null);
  const ld = LD[li];
  const go = () => { if (run) return; setRun(true); setStep(0); let s = 0; t.current = setInterval(() => { s++; if (s < 5) setStep(s); else { clearInterval(t.current); setStep(5); setRun(false); } }, 900); };
  const nx = () => { setStep(-1); setLi(p => (p + 1) % LD.length); };
  useEffect(() => () => { if (t.current) clearInterval(t.current); }, []);

  return (
    <Sec style={{ paddingTop: 120 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <R><div style={{ textAlign: "center", marginBottom: 44 }}>
          <Tag color="#4DA3FF">Interactive Demo</Tag>
          <h1 style={{ fontSize: "clamp(28px, 5.5vw, 48px)", fontWeight: 900, letterSpacing: -2, marginTop: 20 }}>Watch AI process leads <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>in real-time.</span></h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 12 }}>Pick a lead. Hit execute. Watch the pipeline run.</p>
        </div></R>
        <R delay={200}><AuraCard glow="rgba(77,163,255,0.08)" hGlow="rgba(77,163,255,0.15)">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 10px #34D399", animation: "gp 2s infinite" }} /><span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 3, fontWeight: 700 }}>LIVE</span></div>
            <div style={{ display: "flex", gap: 4 }}>{LD.map((_, i) => <button key={i} onClick={() => { if (!run) { setLi(i); setStep(-1); } }} style={{ width: 28, height: 28, borderRadius: 9, fontSize: 11, fontWeight: 800, fontFamily: "'Space Mono',monospace", background: i === li ? "linear-gradient(135deg,#FF8C42,#FFB347)" : "rgba(255,255,255,0.04)", border: i === li ? "none" : "1px solid rgba(255,255,255,0.07)", color: i === li ? "#fff" : "rgba(255,255,255,0.2)", cursor: run ? "default" : "pointer", transition: "all 0.3s", boxShadow: i === li ? "0 4px 14px rgba(255,140,66,0.3)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</button>)}</div>
          </div>
          {/* Lead */}
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: "16px 18px", marginBottom: 18, border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, rgba(77,163,255,0.15), rgba(167,139,250,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "#4DA3FF", flexShrink: 0 }}>{ld.n.charAt(0)}</div>
              <div><div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{ld.n} <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>· {ld.co}</span></div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2, fontStyle: "italic" }}>"{ld.msg}"</div></div>
            </div>
          </div>
          {/* Pipeline */}
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>{PP.map((p, i) => <div key={i} style={{ flex: 1, height: 50, borderRadius: 12, background: step > i ? `${p.c}12` : step === i ? `${p.c}0A` : "rgba(255,255,255,0.02)", border: `1.5px solid ${step > i ? p.c + "35" : step === i ? p.c + "45" : "rgba(255,255,255,0.05)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.5s cubic-bezier(0.25,1,0.5,1)", boxShadow: step === i ? `0 0 18px ${p.c}15` : "none" }}><span style={{ fontSize: 15 }}>{step > i ? "✅" : p.ic}</span><span style={{ fontSize: 7, color: step >= i ? p.c : "rgba(255,255,255,0.15)", fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 1 }}>{p.l}</span></div>)}</div>
          {/* Enrichment */}
          {step >= 1 && <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)", borderRadius: 14, padding: 16, marginBottom: 14, animation: "ci 0.5s ease" }}><div style={{ fontSize: 9, color: "#A78BFA", letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>🧠 AI ENRICHMENT</div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 6 }}>{Object.entries(EN[li]).map(([k, v], idx) => <div key={k} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 9, padding: "7px 9px", animation: `ci 0.3s ease ${idx * 50}ms both` }}><div style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2, fontWeight: 700 }}>{k}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{v}</div></div>)}</div></div>}
          {/* Score */}
          {step >= 3 && <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 16, padding: "16px 20px", marginBottom: 14, border: `1px solid ${ld.tc}18`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "ci 0.5s ease", boxShadow: `0 0 25px ${ld.tc}08` }}><div><div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 3, fontWeight: 700 }}>SCORE</div><div style={{ fontSize: 36, fontWeight: 900, color: ld.tc, fontFamily: "'Space Mono',monospace", lineHeight: 1, textShadow: `0 0 25px ${ld.tc}30` }}>{ld.sc}</div></div><div style={{ padding: "7px 18px", borderRadius: 100, background: `${ld.tc}10`, border: `1.5px solid ${ld.tc}25`, color: ld.tc, fontSize: 12, fontWeight: 900, letterSpacing: 4 }}>🎯 {ld.tier}</div></div>}
          {/* Actions */}
          {step === 5 && <div style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)", borderRadius: 14, padding: 16, marginBottom: 14, animation: "ci 0.5s ease" }}><div style={{ fontSize: 9, color: "#34D399", letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>🚀 DISPATCHED</div>{AC[ld.tier].map((a, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", padding: "7px 0", borderBottom: i < AC[ld.tier].length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animation: `ci 0.4s ease ${i * 80}ms both` }}>{a}</div>)}</div>}
          {/* Button */}
          {step === -1 ? <button onClick={go} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FF6B1A,#FF8C42,#FFB347)", backgroundSize: "200%", animation: "gs 4s ease infinite", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 35px rgba(255,107,26,0.2),0 8px 20px rgba(255,107,26,0.25)", position: "relative", overflow: "hidden" }}><span style={{ position: "relative", zIndex: 1 }}>⚡ Execute Workflow</span><div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)", animation: "sh 2.5s ease infinite" }} /></button> : step === 5 ? <button onClick={nx} style={{ width: "100%", padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Next Lead →</button> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF8C42", animation: `db 1.2s ease ${i * 0.15}s infinite` }} />)}<span style={{ fontSize: 11, color: "#FF8C42", fontWeight: 700, letterSpacing: 3 }}>PROCESSING</span></div>}
        </AuraCard></R>
        {/* Before/After */}
        <div style={{ marginTop: 56 }}>
          <R><h3 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, textAlign: "center", marginBottom: 24 }}><span style={{ color: "#FF4D6A" }}>25 min</span> → <span style={{ color: "#34D399" }}>47 sec</span></h3></R>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <R delay={100}><AuraCard glow="rgba(255,77,106,0.06)" hGlow="rgba(255,77,106,0.15)" border="rgba(255,77,106,0.08)"><div style={{ fontSize: 10, color: "#FF4D6A", fontWeight: 800, letterSpacing: 3, marginBottom: 14 }}>❌ BEFORE</div>{["Read forms", "Google company", "Guess quality", "Write emails", "Update sheets", "Set reminders"].map((t, i) => <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "5px 0" }}>• {t}</div>)}<div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(255,77,106,0.06)", textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Space Mono',monospace", color: "#FF4D6A" }}>~25 min</div></div></AuraCard></R>
            <R delay={200}><AuraCard glow="rgba(52,211,153,0.06)" hGlow="rgba(52,211,153,0.15)" border="rgba(52,211,153,0.08)"><div style={{ fontSize: 10, color: "#34D399", fontWeight: 800, letterSpacing: 3, marginBottom: 14 }}>✅ AFTER</div>{["AI reads", "Auto intel", "ML scored", "AI emails", "CRM synced", "Auto follow-up"].map((t, i) => <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "5px 0" }}>• {t}</div>)}<div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.06)", textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Space Mono',monospace", color: "#34D399" }}>~47 sec</div></div></AuraCard></R>
          </div>
        </div>
      </div>
    </Sec>
  );
}

/* ═══ FEATURES ═══ */
function FeaturesPage({ go }) {
  const F = [
    { ic: "🧠", t: "AI Lead Scoring", d: "Every lead scored 0–100 with AI analysis of intent, budget, size, urgency.", gl: "rgba(167,139,250,0.1)", hg: "rgba(167,139,250,0.22)", ig: "linear-gradient(135deg,#A78BFA20,#A78BFA08)" },
    { ic: "⚡", t: "Instant Response", d: "AI drafts personalised emails in seconds. Faster than your competitors can type.", gl: "rgba(77,163,255,0.1)", hg: "rgba(77,163,255,0.22)", ig: "linear-gradient(135deg,#4DA3FF20,#4DA3FF08)" },
    { ic: "🔄", t: "CRM Auto-Sync", d: "HubSpot, Salesforce, Sheets — every lead enriched and logged automatically.", gl: "rgba(52,211,153,0.1)", hg: "rgba(52,211,153,0.22)", ig: "linear-gradient(135deg,#34D39920,#34D39908)" },
    { ic: "📊", t: "Live Dashboard", d: "Real-time pipeline visibility. Every lead, score, and action at a glance.", gl: "rgba(251,191,36,0.1)", hg: "rgba(251,191,36,0.22)", ig: "linear-gradient(135deg,#FBBF2420,#FBBF2408)" },
    { ic: "🔔", t: "Smart Alerts", d: "Slack, email, SMS — instant hot lead notifications. Never miss big deals.", gl: "rgba(255,77,106,0.1)", hg: "rgba(255,77,106,0.22)", ig: "linear-gradient(135deg,#FF4D6A20,#FF4D6A08)" },
    { ic: "🔗", t: "500+ Integrations", d: "Gmail, Calendly, Stripe, Shopify, Mailchimp — any API, connected.", gl: "rgba(255,140,66,0.1)", hg: "rgba(255,140,66,0.22)", ig: "linear-gradient(135deg,#FF8C4220,#FF8C4208)" },
    { ic: "🛡️", t: "Error Handling", d: "Retry logic, fallback paths, monitoring. Nothing breaks silently.", gl: "rgba(99,102,241,0.1)", hg: "rgba(99,102,241,0.22)", ig: "linear-gradient(135deg,#6366F120,#6366F108)" },
    { ic: "📈", t: "Analytics", d: "Conversion rates, response times, pipeline health — data-driven optimisation.", gl: "rgba(236,72,153,0.1)", hg: "rgba(236,72,153,0.22)", ig: "linear-gradient(135deg,#EC489920,#EC489908)" },
    { ic: "🎯", t: "Custom Logic", d: "Every workflow built around YOUR rules. Not one-size-fits-all.", gl: "rgba(20,184,166,0.1)", hg: "rgba(20,184,166,0.22)", ig: "linear-gradient(135deg,#14B8A620,#14B8A608)" },
  ];
  return (
    <Sec style={{ paddingTop: 120 }}>
      <R><div style={{ textAlign: "center", marginBottom: 52 }}><Tag color="#FBBF24">Capabilities</Tag><h1 style={{ fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, letterSpacing: -3, marginTop: 20 }}>Everything on <span style={{ background: "linear-gradient(135deg,#FBBF24,#FF8C42)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>autopilot.</span></h1><p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 14, maxWidth: 460, margin: "14px auto 0" }}>Every feature eliminates manual work and accelerates revenue.</p></div></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, maxWidth: 920, margin: "0 auto" }}>{F.map((f, i) => <R key={i} delay={i * 70}><AuraCard glow={f.gl} hGlow={f.hg}><div style={{ width: 48, height: 48, borderRadius: 14, background: f.ig, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{f.ic}</div><h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>{f.t}</h3><p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>{f.d}</p></AuraCard></R>)}</div>
      <R delay={300}><div style={{ textAlign: "center", marginTop: 52 }}><button onClick={() => go("demo")} style={{ background: "linear-gradient(135deg,#FF6B1A,#FF8C42)", color: "#fff", padding: "14px 36px", borderRadius: 14, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 30px rgba(255,107,26,0.25)" }}>See it in Action →</button></div></R>
    </Sec>
  );
}

/* ═══ PRICING ═══ */
function PricingPage({ go }) {
  const P = [
    { n: "Starter", p: "£150", d: "One workflow, 2–3 apps", f: ["Single automation", "AI processing", "2–3 connections", "Docs + Loom video", "3-day delivery"], c: "#4DA3FF", gl: "rgba(77,163,255,0.08)", hg: "rgba(77,163,255,0.2)", pop: false },
    { n: "Business", p: "£500", d: "Multi-step AI system", f: ["Multi-step workflow", "AI scoring + enrichment", "4–6 connections", "Error handling", "Training session", "7-day delivery"], c: "#FF8C42", gl: "rgba(255,140,66,0.1)", hg: "rgba(255,140,66,0.25)", pop: true },
    { n: "Enterprise", p: "£1,500", d: "Full infrastructure", f: ["3+ workflows", "Complete AI pipeline", "Dashboard + analytics", "Unlimited connections", "30-day support", "14-day delivery"], c: "#A78BFA", gl: "rgba(167,139,250,0.08)", hg: "rgba(167,139,250,0.2)", pop: false },
  ];
  const Q = [
    { q: "What platforms can you connect?", a: "Hundreds — Gmail, Slack, Sheets, HubSpot, Salesforce, Mailchimp, Stripe, Shopify, social media, and more." },
    { q: "How quickly can I get set up?", a: "Starter: 3 days. Business: 7 days. Enterprise: 14 days. Most see ROI week one." },
    { q: "Can I manage it myself after?", a: "Yes — every delivery includes docs and a Loom walkthrough. Business+ includes live training." },
    { q: "What if I need changes?", a: "All plans include revisions. I also offer ongoing support for continuous optimisation." },
  ];
  return (
    <Sec style={{ paddingTop: 120 }}>
      <R><div style={{ textAlign: "center", marginBottom: 52 }}><Tag>Pricing</Tag><h1 style={{ fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, letterSpacing: -3, marginTop: 20 }}>Choose your <span style={{ background: "linear-gradient(135deg,#FF8C42,#FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>level.</span></h1><p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 14, maxWidth: 420, margin: "14px auto 0" }}>Every plan includes AI, docs, and a video walkthrough.</p></div></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, maxWidth: 860, margin: "0 auto" }}>{P.map((p, i) => <R key={i} delay={i * 120}><AuraCard glow={p.gl} hGlow={p.hg} border={p.pop ? `${p.c}20` : undefined}><div style={{ position: "relative" }}>{p.pop && <div style={{ position: "absolute", top: -8, right: -8, padding: "3px 10px", borderRadius: 100, background: `${p.c}15`, border: `1px solid ${p.c}25`, color: p.c, fontSize: 8, fontWeight: 800, letterSpacing: 2 }}>POPULAR</div>}<div style={{ fontSize: 12, fontWeight: 700, color: p.c, marginBottom: 6 }}>{p.n}</div><div style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Space Mono',monospace", lineHeight: 1, marginBottom: 4 }}>{p.p}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>{p.d}</div>{p.f.map((f, fi) => <div key={fi} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "7px 0", display: "flex", gap: 8, alignItems: "center", borderBottom: fi < p.f.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}><span style={{ color: p.c }}>✓</span>{f}</div>)}<button onClick={() => go("contact")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 24, padding: "13px 20px", borderRadius: 12, background: p.pop ? `linear-gradient(135deg,#FF6B1A,${p.c})` : "rgba(255,255,255,0.03)", border: p.pop ? "none" : "1px solid rgba(255,255,255,0.06)", color: p.pop ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: p.pop ? `0 8px 25px ${p.c}30` : "none" }}>Get Started</button></div></AuraCard></R>)}</div>
      <div style={{ maxWidth: 600, margin: "70px auto 0" }}>
        <R><h3 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, textAlign: "center", marginBottom: 28 }}>Common Questions</h3></R>
        {Q.map((q, i) => <R key={i} delay={i * 80}><AuraCard glow="rgba(255,255,255,0.02)" hGlow="rgba(255,140,66,0.08)" style={{ marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{q.q}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{q.a}</div></AuraCard></R>)}
      </div>
    </Sec>
  );
}

/* ═══ CONTACT ═══ */
function ContactPage({ go }) {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <Sec style={{ paddingTop: 120 }}>
      <Orb style={{ width: 500, height: 500, top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(255,140,66,0.05), transparent 60%)" }} />
      <div style={{ maxWidth: 500, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <R><div style={{ textAlign: "center", marginBottom: 44 }}><Tag color="#34D399">Contact</Tag><h1 style={{ fontSize: "clamp(30px, 6vw, 48px)", fontWeight: 900, letterSpacing: -2, marginTop: 20 }}>Let's build <span style={{ background: "linear-gradient(135deg,#FF8C42,#FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>something.</span></h1><p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 12 }}>Tell me what eats your time. I'll show you how AI fixes it.</p></div></R>
        {!sent ? (
          <R delay={200}><AuraCard glow="rgba(255,140,66,0.06)" hGlow="rgba(255,140,66,0.12)">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ k: "name", ph: "Your Name", ty: "text" }, { k: "email", ph: "your@email.com", ty: "email" }].map(f => <input key={f.k} type={f.ty} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", fontSize: 14, color: "rgba(255,255,255,0.8)", outline: "none", fontFamily: "inherit", transition: "border-color 0.3s", width: "100%" }} onFocus={e => e.target.style.borderColor = "rgba(255,140,66,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />)}
              <textarea placeholder="Tell me about your project..." value={form.msg} onChange={e => setForm(p => ({ ...p, msg: e.target.value }))} rows={4} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", fontSize: 14, color: "rgba(255,255,255,0.8)", outline: "none", fontFamily: "inherit", resize: "vertical", transition: "border-color 0.3s", width: "100%" }} onFocus={e => e.target.style.borderColor = "rgba(255,140,66,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
              <button onClick={() => { if (form.name && form.email && form.msg) setSent(true); }} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FF6B1A,#FF8C42)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 30px rgba(255,107,26,0.3)" }}>Send Message 🔥</button>
            </div>
          </AuraCard></R>
        ) : (
          <R><AuraCard glow="rgba(52,211,153,0.1)" hGlow="rgba(52,211,153,0.2)" border="rgba(52,211,153,0.15)">
            <div style={{ textAlign: "center", padding: "36px 16px" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Message Sent!</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>Thanks {form.name}! I'll reply within 24 hours.</div>
              <button onClick={() => go("home")} style={{ marginTop: 24, background: "none", border: "none", color: "#FF8C42", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Back to Home</button>
            </div>
          </AuraCard></R>
        )}
        <R delay={300}><div style={{ textAlign: "center", marginTop: 36, color: "rgba(255,255,255,0.2)", fontSize: 12 }}>Or email: <span style={{ color: "#FF8C42" }}>hello@novaforge.dev</span></div></R>
      </div>
    </Sec>
  );
}

/* ═══ MAIN APP ═══ */
export default function App() {
  const [page, setPage] = useState("home");
  const [fadeKey, setFadeKey] = useState(0);
  const contentRef = useRef(null);

  const go = (p) => {
    setPage(p);
    setFadeKey(k => k + 1);
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "instant" });
  };

  const navActive = (p) => page === p;
  const navStyle = (p) => ({
    fontSize: 12, fontWeight: navActive(p) ? 700 : 500,
    color: navActive(p) ? "#FFB347" : "rgba(255,255,255,0.4)",
    background: navActive(p) ? "rgba(255,140,66,0.08)" : "transparent",
    border: "none", padding: "7px 14px", borderRadius: 9, cursor: "pointer",
    transition: "all 0.3s",
  });

  return (
    <div style={{ fontFamily: "'Sora',-apple-system,sans-serif", color: "#E8E8ED", background: "#0C0C10", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0C0C10;overflow:hidden}
        ::selection{background:rgba(255,140,66,0.3);color:#fff}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,140,66,0.2);border-radius:10px}
        @keyframes gp{0%,100%{opacity:1;box-shadow:0 0 12px #34D399}50%{opacity:0.5;box-shadow:0 0 6px #34D399}}
        @keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes sh{0%{transform:translateX(-200%)}100%{transform:translateX(200%)}}
        @keyframes ci{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes f1{0%,100%{transform:translate(0,0)}33%{transform:translate(25px,-20px)}66%{transform:translate(-15px,12px)}}
        @keyframes f2{0%,100%{transform:translate(0,0)}33%{transform:translate(-20px,25px)}66%{transform:translate(18px,-18px)}}
        @keyframes db{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1.2);opacity:1}}
        @keyframes gr{0%,100%{transform:translate(0,0)}10%{transform:translate(-1%,-1%)}50%{transform:translate(-1%,1%)}90%{transform:translate(0,1%)}}
        @keyframes pageIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0.025, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px", animation: "gr 0.5s steps(1) infinite" }} />

      {/* Nav */}
      <nav style={{ flexShrink: 0, background: "rgba(12,12,16,0.85)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
        <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#E8E8ED" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#FF6B1A,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 0 18px rgba(255,140,66,0.25)" }}>🔥</div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>Nova<span style={{ color: "#FF8C42" }}>Forge</span></span>
        </button>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <button onClick={() => go("demo")} style={navStyle("demo")}>Demo</button>
          <button onClick={() => go("features")} style={navStyle("features")}>Features</button>
          <button onClick={() => go("pricing")} style={navStyle("pricing")}>Pricing</button>
          <button onClick={() => go("contact")} style={{ fontSize: 12, fontWeight: 700, color: "#fff", border: "none", padding: "7px 18px", borderRadius: 10, marginLeft: 6, background: "linear-gradient(135deg,#FF6B1A,#FF8C42)", boxShadow: "0 4px 16px rgba(255,107,26,0.25)", cursor: "pointer" }}>Get a Quote</button>
        </div>
      </nav>

      {/* Content */}
      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div key={fadeKey} style={{ animation: "pageIn 0.45s cubic-bezier(0.25,1,0.5,1)" }}>
          {page === "home" && <HomePage go={go} />}
          {page === "demo" && <DemoPage />}
          {page === "features" && <FeaturesPage go={go} />}
          {page === "pricing" && <PricingPage go={go} />}
          {page === "contact" && <ContactPage go={go} />}
        </div>
        {/* Footer */}
        <footer style={{ padding: "32px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 800, fontSize: 14 }}>Nova<span style={{ color: "#FF8C42" }}>Forge</span></span><span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>© 2026</span></div>
          <div style={{ display: "flex", gap: 16 }}>{[{ l: "Home", p: "home" }, { l: "Demo", p: "demo" }, { l: "Features", p: "features" }, { l: "Pricing", p: "pricing" }, { l: "Contact", p: "contact" }].map(x => <button key={x.l} onClick={() => go(x.p)} style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", background: "none", border: "none", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={e => e.target.style.color = "#FFB347"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.18)"}>{x.l}</button>)}</div>
        </footer>
      </div>
    </div>
  );
}
