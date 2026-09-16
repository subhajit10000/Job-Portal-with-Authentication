import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//sample data for category
const categories = [
    {
        title: "Software Development",
        icon: "💻",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "UI/UX Design",
        icon: "🎨",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "Marketing",
        icon: "📢",
        gradient: "from-orange-500 to-red-500",
    },
    {
        title: "Finance & Accounting",
        icon: "💰",
        gradient: "from-emerald-500 to-green-500",
    },
    {
        title: "Human Resources",
        icon: "👥",
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        title: "Sales",
        icon: "📈",
        gradient: "from-yellow-500 to-orange-500",
    },
];


const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Infosys",
    "TCS",
    "Wipro",
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-(--hero-bg) pt-32 transition-colors">
        {/* Background circles */}
        <div className="absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 dark:bg-indigo-600/30 blur-3xl" />
        <div className="absolute -right-40 top-40 -z-10 h-96 w-96 rounded-full bg-purple-500/20 dark:bg-purple-600/30 blur-3xl" />
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Grid background */}
        <div
          className="absolute inset-0 -z-20 opacity-[0.05] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            color: "var(--color-text)",
          }}
        />
        <div className="mx-auto max-w-7xl px-5 pb-32 pt-6 h-130 lg:px-8">

          {/* Main Heading */}

          <h2 className="mx-auto max-w-5xl text-center text-5xl font-black leading-[1.05] tracking-tight text-(--color-text) sm:text-6xl lg:text-7xl">

            Discover a job where

            <span className="block bg-linear-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              your talent shines.
            </span>

          </h2>


          <p className="mx-auto mt-7 max-w-2xl text-center text-lg leading-8 text-(--color-text-muted)">

            Connect with thousands of top companies and discover opportunities
            that match your skills, experience, and career ambitions.

          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                >
                  Get Started
                </Link>

                <Link
                  to="/jobs"
                  className="rounded-xl border border-(--color-border) bg-(--color-surface)/70 px-6 py-3 font-semibold text-(--color-text) backdrop-blur transition hover:border-(--color-navy)"
                >
                  Browse Jobs
                </Link>
              </>
            )}

            {user?.role === "candidate" && (
              <Link
                to="/jobs"
                className="rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
              >
                Browse Jobs
              </Link>
            )}

            {user?.role === "recruiter" && (
              <Link
                to="/post-job"
                className="rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
              >
                Post a Job
              </Link>
            )}
          </div>
        </div>
      </section>

    {/* browse category*/}
    <section
                id="categories"
                className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
            >

                <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>

                        <p className="mb-3 font-bold uppercase tracking-[3px] text-(--color-navy)">
                            Explore opportunities
                        </p>

                        <h2 className="text-4xl font-black tracking-tight text-(--color-text) sm:text-5xl">
                            Browse by category
                        </h2>

                        <p className="mt-4 max-w-xl text-(--color-text-muted)">
                            Explore thousands of opportunities across the most popular
                            industries and career paths.
                        </p>

                    </div>

                    <Link to="/jobs" className="font-bold text-(--color-navy) hover:text-(--color-amber) transition">
                        View all categories →
                    </Link>

                </div>


                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => (

                        <Link
                            key={category.title}
                            to="/jobs"
                            className="card-surface group relative overflow-hidden rounded-3xl border-2 border-(--color-border) text-xl font-black p-7 transition duration-300 hover:-translate-y-2 hover:border-transparent"
                        >

                            <div
                                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${category.gradient} text-2xl shadow-lg`}
                            >
                                {category.icon}
                            </div>

                            <h3 className="text-xl font-bold text-(--color-text)">
                                {category.title}
                            </h3>


                            <p className="text-base font-normal text-(--color-text-muted)">
                                Explore jobs →
                            </p>

                            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 transition group-hover:scale-120" />

                        </Link>

                    ))}

                </div>

            </section>




      {/*trusted by companies*/}
    <section
                id="companies"
                className="border-y border-(--color-border) bg-(--color-surface) py-20 transition-colors"
            >

                <div className="mx-auto max-w-7xl px-5 lg:px-8">

                    <p className="text-center text-sm font-bold uppercase tracking-[3px] text-(--color-text-muted)">
                        Trusted by leading companies
                    </p>

                    <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">

                        {companies.map((company) => (

                            <div
                                key={company}
                                className="flex h-24 items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-bg) text-xl font-black text-(--color-text-muted) transition duration-300 hover:-translate-y-1 hover:text-(--color-navy) hover:shadow-lg"
                            >
                                {company}
                            </div>

                        ))}

                    </div>

                </div>

            </section>







      {/* CTA */}
      <section className="px-5 pb-24 lg:px-8">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-700 via-purple-700 to-fuchsia-700 px-6 py-20 text-center shadow-2xl shadow-indigo-500/20 sm:px-12">

                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />

                    <div className="relative">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white backdrop-blur">
                            ★
                        </div>

                        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black text-white sm:text-5xl">
                            Ready to take the next step in your career?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
                            Join thousands of professionals who are already finding better
                            opportunities with HirePath.
                        </p>

                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link to="/jobs" className="rounded-xl bg-white px-7 py-4 font-black text-indigo-700 shadow-xl transition hover:-translate-y-1">
                                Find a Job →
                            </Link>

                            <Link to={user ? "/post-job" : "/register"} className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-black text-white backdrop-blur transition hover:bg-white/20">
                                Post a Job
                            </Link>

                        </div>

                    </div>

                </div>

            </section>
    </div>
  );
}
