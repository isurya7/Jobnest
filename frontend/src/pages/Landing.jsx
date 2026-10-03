import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <span className="text-xl font-bold text-slate-900">Jobnest</span>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block">How it works</a>
          <button
            onClick={() => navigate("/auth")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl -z-10" />

        <span className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          AI-powered skill matching
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          Stop applying blind.<br />
          <span className="text-indigo-600">Know your match</span> before you apply.
        </h1>

        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10">
          Jobnest reads your resume, compares it against real job listings using
          skill and meaning-based matching, and shows you exactly where you stand — before you spend an hour on an application.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-200"
          >
            Get started free
          </button>
          <a
            href="#how-it-works"
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium px-8 py-3.5 rounded-xl transition"
          >
            See how it works
          </a>
        </div>

        {/* Mock match card preview */}
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-5 text-left">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-slate-900">Backend Engineer</p>
              <p className="text-sm text-slate-500">Remote · Acme Co.</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              High match
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: "87%" }} />
          </div>
          <div className="flex gap-1.5">
            <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1">Python</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1">Django</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1">PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          <Stat number="300+" label="Live jobs tracked" />
          <Stat number="2" label="Sources aggregated" />
          <Stat number="100%" label="Free to use" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Built for how job search actually works</h2>
          <p className="text-slate-600 max-w-lg mx-auto">Not another board to scroll endlessly. Just the signal that matters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            emoji="📄"
            title="Resume-based matching"
            desc="We read your CV and compare it against every listing using real skill and meaning-based matching, not just keyword search."
          />
          <FeatureCard
            emoji="🎯"
            title="Honest match scores"
            desc="Every job shows a High, Medium, or Low match tag with a real percentage, so you know exactly where to spend your time."
          />
          <FeatureCard
            emoji="📊"
            title="Track every application"
            desc="Save jobs, apply directly on the source site, and keep your whole search organized in one place."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-slate-100 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Three steps. That's it.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Step number="1" title="Upload your resume" desc="We extract your skills and experience automatically — no manual tagging needed." />
            <Step number="2" title="Browse your matches" desc="Every job in your feed is scored against your actual profile, ranked highest-fit first." />
            <Step number="3" title="Apply with confidence" desc="Apply directly on the source site and track every application's status in one dashboard." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to stop guessing?</h2>
        <p className="text-slate-600 mb-8">Create your profile in under two minutes.</p>
        <button
          onClick={() => navigate("/auth")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-200"
        >
          Get started free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-sm text-slate-400">
          <span>Jobnest</span>
          <span>Built as a portfolio project</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-3xl font-bold text-slate-900">{number}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4">
        {emoji}
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

export default Landing;