import React from 'react'

export const Footer = () => {
  return (
    
            <footer className="bg-slate-950 text-slate-300">

                <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                        {/* Brand */}

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-xl font-black text-white">
                                    J
                                </div>

                                <span className="text-xl font-black text-white">
                                    Job<span className="text-indigo-400">Sphere</span>
                                </span>

                            </div>

                            <p className="mt-5 max-w-xs leading-7 text-slate-400">
                                Helping talented people find meaningful careers and helping
                                companies find exceptional talent.
                            </p>

                        </div>


                        {/* Job Seekers */}

                        <div>

                            <h3 className="font-bold text-white">
                                For Job Seekers
                            </h3>

                            <div className="mt-5 space-y-3 text-sm">

                                <a href="#" className="block hover:text-white">
                                    Browse Jobs
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Career Advice
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Resume Builder
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Salary Guide
                                </a>

                            </div>

                        </div>


                        {/* Employers */}

                        <div>

                            <h3 className="font-bold text-white">
                                For Employers
                            </h3>

                            <div className="mt-5 space-y-3 text-sm">

                                <a href="#" className="block hover:text-white">
                                    Post a Job
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Find Candidates
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Pricing
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Employer Resources
                                </a>

                            </div>

                        </div>


                        {/* Company */}

                        <div>

                            <h3 className="font-bold text-white">
                                Company
                            </h3>

                            <div className="mt-5 space-y-3 text-sm">

                                <a href="#" className="block hover:text-white">
                                    About Us
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Contact
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Privacy Policy
                                </a>

                                <a href="#" className="block hover:text-white">
                                    Terms & Conditions
                                </a>

                            </div>

                        </div>

                    </div>


                    {/* Bottom */}

                    <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row">

                        <p>
                            © 2026 JobSphere. All rights reserved.
                        </p>

                        <div className="flex gap-5">

                            <a href="#" className="hover:text-white">
                                LinkedIn
                            </a>

                            <a href="#" className="hover:text-white">
                                Instagram
                            </a>

                            <a href="#" className="hover:text-white">
                                Twitter
                            </a>

                        </div>

                    </div>

                </div>

            </footer>
  )
}
