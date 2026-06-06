import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Zap, ShieldCheck, FileEdit, Truck, CreditCard, Shield, Globe, BarChart2, Recycle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative">
      {/* Subtle dotted background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Recycle className="w-7 h-7 text-[#047857]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#047857]">Cleaners</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 absolute left-1/2 -translate-x-1/2">
            <a href="#" className="text-[#047857]">Home</a>
            <a href="#about" className="hover:text-[#047857] transition-colors">About</a>
            <a href="#service" className="hover:text-[#047857] transition-colors">Service</a>
            <a href="#contact" className="hover:text-[#047857] transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/signin" className="text-sm font-bold text-slate-600 hover:text-[#047857]">Log In</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-8 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d1fae5]/50 border border-[#a7f3d0] text-[#047857] text-[10px] font-bold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              NEXT-GEN WASTE TECH
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.05] mb-6 text-[#0f172a]">
              Smart Waste <br/> Management <br/>
              <span className="text-[#047857]">for the Modern <br/> Enterprise.</span>
            </h1>
            
            <p className="text-slate-600 text-lg mb-10 max-w-md leading-relaxed font-medium">
              Optimize your logistical footprint with Cleaners. We combine real-time analytics with high-performance recycling workflows to turn waste into resource.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <Link to="/signup" className="flex items-center gap-2 px-6 py-3.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-lg transition-all shadow-md">
                Schedule a Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#" className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold rounded-lg transition-all shadow-sm">
                View Case Studies
              </a>
            </div>

            <div className="flex items-center gap-12">
              <div>
                <p className="text-[32px] font-black text-[#0f172a] leading-none mb-1">98%</p>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Efficiency Rate</p>
              </div>
              <div>
                <p className="text-[32px] font-black text-[#0f172a] leading-none mb-1">12k+</p>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Fleet Tons Managed</p>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[500px]">
            {/* Hero Image */}
            <div className="bg-[#1e293b] rounded-[2rem] w-full h-full absolute inset-0 overflow-hidden shadow-2xl">
               <img src="/home_hero_bg.jpg" alt="Waste Management" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -left-12 bottom-12 bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 w-72 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#047857] rounded-xl flex items-center justify-center text-white shadow-sm">
                     <BarChart2 className="w-5 h-5" />
                   </div>
                   <span className="font-bold text-[#0f172a] text-sm">Live Performance</span>
                 </div>
              </div>
              <div className="mb-2 flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Daily Diversion Goal</span>
                <span className="text-[#047857] text-sm font-black">75%</span>
              </div>
              <div className="h-2.5 w-full bg-[#dbeafe] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#047857] w-[75%] rounded-full"></div>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold">4.2 Tons diverted today</p>
            </div>
          </div>
        </section>

        {/* Features - Add a subtle gradient background separator */}
        <div id="about" className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] pt-8 pb-16 scroll-mt-20">
          <section className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-6">
            {[
              { icon: Leaf, title: "Eco-friendly First", desc: "Every route and pickup is optimized to reduce carbon emissions and maximize material recovery through advanced algorithmic routing." },
              { icon: Zap, title: "High-Speed Execution", desc: "Response times under 60 minutes for urgent collection needs, powered by our ultra-low latency dynamic dispatch engine." },
              { icon: ShieldCheck, title: "Absolute Reliability", desc: "99.9% pickup fulfillment rate with guaranteed blockchain-verified chain of custody for all complex industrial waste types." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="w-12 h-12 bg-[#ecfdf5] text-[#059669] rounded-2xl flex items-center justify-center mb-6 border border-[#d1fae5]">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Steps to Sustainability */}
        <section id="service" className="max-w-7xl mx-auto px-8 py-16 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Three Steps to Sustainability</h2>
              <p className="text-slate-600 text-lg">Our streamlined platform removes the friction from environmental responsibility through a unified cloud interface.</p>
            </div>
            <a href="#" className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 mt-4 md:mt-0 transition-colors">
              Learn about our tech <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: 1, icon: FileEdit, title: "Post Requests", desc: "Submit waste details via our intuitive dashboard or fully-integrated RESTful API in seconds." },
              { step: 2, icon: Truck, title: "Smart Collection", desc: "Our nearest optimized carrier arrives for an efficient, zero-fuss pickup tracked in real-time." },
              { step: 3, icon: CreditCard, title: "Seamless Payment", desc: "Automated billing and comprehensive sustainability reporting delivered to your inbox instantly." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-10 group-hover:bg-emerald-50 transition-colors"></div>
                <div className="w-14 h-14 bg-[#064e3b] text-white rounded-2xl flex items-center justify-center mb-6 relative">
                   <item.icon className="w-6 h-6" />
                   <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#10b981] rounded-full text-xs flex items-center justify-center font-bold border-2 border-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Infrastructure & Security */}
        <section className="bg-[#f1f5f9] py-16">
           <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative bg-[#0f172a] rounded-[2rem] overflow-hidden p-10 flex flex-col justify-end min-h-[400px]">
              {/* Mock Dark City Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent z-10"></div>
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
              
              <div className="relative z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#6ee7b7] text-xs font-bold tracking-wider mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
                  Native in 42 Cities
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Global Infrastructure</h2>
                <p className="text-slate-300 max-w-md text-sm leading-relaxed font-medium">Our distributed network of smart hubs ensures zero-waste targets are met across three continents.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-[#047857] rounded-[2rem] p-8 flex-1 text-white shadow-lg">
                 <Shield className="w-10 h-10 text-[#6ee7b7] mb-6" />
                 <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                 <p className="text-[#d1fae5] text-sm leading-relaxed font-medium">SOC2 Type II compliant management for sensitive industrial waste streams with military-grade encryption.</p>
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex-1">
                 <div className="flex -space-x-3 mb-6">
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=1" alt="Avatar" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=2" alt="Avatar" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=3" alt="Avatar" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#ecfdf5] text-[#065f46] text-xs font-bold flex items-center justify-center">+500</div>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Trusted by Leaders</h3>
                 <p className="text-slate-500 text-sm font-medium">Join 500+ forward-thinking global companies optimizing their environmental operations.</p>
              </div>
            </div>
           </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="max-w-7xl mx-auto px-8 py-16 scroll-mt-20">
          <div className="bg-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/30 to-transparent"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Synchronize Your Logistics?</h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Start your enterprise-ready free trial today and experience the future of circular economy management. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-[#4ade80] hover:bg-[#22c55e] text-slate-900 font-bold rounded-xl transition-colors">
                  Get Started Free
                </Link>
                <a href="#" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 text-white font-medium rounded-xl transition-colors">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12 px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
               <div className="flex items-center gap-2 mb-6">
                  <Leaf className="w-5 h-5 text-[#047857]" />
                  <span className="font-bold text-slate-900">Cleaners</span>
               </div>
               <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                 Empowering the modern enterprise with high-performance circular logistics and smart data.
               </p>
               <p className="text-slate-400 text-xs font-medium">© 2024 Cleaners. All rights reserved.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-[#047857]">Features</a></li>
                <li><a href="#" className="hover:text-[#047857]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#047857]">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-[#047857]">About Us</a></li>
                <li><a href="#" className="hover:text-[#047857]">Careers</a></li>
                <li><a href="#" className="hover:text-[#047857]">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Connect</h4>
              <div className="flex items-center gap-3">
                 <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#ecfdf5] hover:text-[#047857] transition-colors"><Globe className="w-4 h-4" /></a>
                 <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#ecfdf5] hover:text-[#047857] transition-colors"><Globe className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
