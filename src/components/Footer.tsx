import React from 'react';
import { 
  Mail, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Github, 
  MapPin, 
  FileCheck, 
  Scale, 
  Heart, 
  Copy, 
  Check
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface FooterProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [copied, setCopied] = React.useState(false);
  const emailAddress = 'ron.hatibaruah@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        
        {/* Top Grid: Brand & Description, Navigation, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Gov Context */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-tight block">
                  BhumiBinimoy <span className="text-emerald-400 font-serif">ভূমি বিনিময়</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Assam Land Exchange • NESFIC-D-52
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Assam’s official cadastral-map-anchored land marketplace connecting lawful sellers directly with verified buyers through automated statutory title due diligence.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Revenue & Disaster Management Dept.</span>
            </div>
          </div>

          {/* Column 2: Quick Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('marketplace')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• Cadastral Map Explorer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('deal-room')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• Buyer Due-Diligence Deal Room</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('seller-portal')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• Landowner Voluntary Listing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('workflow-tracker')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• Assisted Conveyancing State Machine</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('admin-console')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• Circle Officer Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: GovTech Pillars & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Foundational Pillars</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Dharitree:</strong> Jamabandi Textual RoR</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span><strong>Bhudakshya:</strong> Cadastral WebGIS Dags</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span><strong>e-Panjeeyan:</strong> SRO Deed Registry</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong>e-Khajana:</strong> Land Revenue Touzi GRAS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span><strong>Mission Basundhara:</strong> 72h Auto-Mutation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Visitor Contact & GitHub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Inquiries & Contact</h4>
            <p className="text-xs text-slate-400">
              For technical inquiries, government collaborations, or investor dialogue:
            </p>

            {/* Email Contact Box */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Innovator & Architect</span>
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={`mailto:${emailAddress}`}
                  className="font-mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 truncate"
                  title="Click to send email"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{emailAddress}</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <a
              href="https://github.com/RonHatibaruah/bhumi-binimoy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors pt-1"
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span>github.com/RonHatibaruah/bhumi-binimoy</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

        </div>

        {/* Middle Section: Statutory Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <Scale className="w-4 h-4 shrink-0" />
            <span>Statutory Governance Disclaimer (ALRR 1886)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Information displayed on BhumiBinimoy (Assam Land Exchange) reflects authenticated records available with the Government of Assam under the <em>Assam Land and Revenue Regulation (ALRR), 1886</em> as of the query date. Listing of any parcel on the portal does not in itself constitute a formal guarantee of title or preempt statutory revenue approvals under Section 10 of the ALRR 1886, Land Sale NOC verification by the competent Circle Officer, or Chapter X Tribal Belt and Block restrictions.
          </p>
        </div>

        {/* Bottom Section: Copyrights & Credits */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-slate-400 font-medium">
              &copy; 2026 Ron Hatibaruah. All rights reserved.
            </p>
            <p className="text-[11px]">
              Developed for Assam Startup NESFIC 2026 • Problem Statement: NESFIC-D-52 • Stream 1 (Government Track).
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400 font-mono">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Dispur, Guwahati, Assam</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400 font-mono">v1.0.0 Cloudflare Edge</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
