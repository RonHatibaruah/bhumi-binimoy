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
  UserCheck, 
  Copy, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface FooterProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [copiedVisitor, setCopiedVisitor] = React.useState(false);
  const [copiedLead, setCopiedLead] = React.useState(false);

  const visitorEmail = 'ron.hatibaruah@gmail.com';
  const leadEmail = 'abhishek.satyam@razornext.com';

  const handleCopy = (email: string, type: 'visitor' | 'lead') => {
    navigator.clipboard.writeText(email);
    if (type === 'visitor') {
      setCopiedVisitor(true);
      setTimeout(() => setCopiedVisitor(false), 2000);
    } else {
      setCopiedLead(true);
      setTimeout(() => setCopiedLead(false), 2000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        
        {/* Top Grid: Brand & Description, Navigation, Foundational Pillars, Contact & Lead Applicant */}
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
              Assam’s official cadastral-map-anchored land marketplace connecting lawful sellers directly with verified buyers through automated statutory title due diligence and digital conveyancing.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Revenue & Disaster Management Dept., Assam</span>
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

          {/* Column 4: Lead Applicant, Inquiries & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Applicant & Inquiries</h4>

            {/* Lead Applicant Box */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Lead Applicant</span>
              </div>
              <div className="text-xs text-slate-200 font-bold">
                Abhishek Satyam
              </div>
              <div className="text-[11px] text-slate-400">
                RazorNext Software Pvt Ltd
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                <a 
                  href={`mailto:${leadEmail}`}
                  className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 truncate"
                  title="Email Lead Applicant"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{leadEmail}</span>
                </a>
                <button
                  onClick={() => handleCopy(leadEmail, 'lead')}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copy email to clipboard"
                >
                  {copiedLead ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Visitor Inquiries Box */}
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Visitor & General Inquiries</span>
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={`mailto:${visitorEmail}`}
                  className="font-mono text-xs text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5 truncate"
                  title="Email platform inquiries"
                >
                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                  <span className="truncate">{visitorEmail}</span>
                </a>
                <button
                  onClick={() => handleCopy(visitorEmail, 'visitor')}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copy email to clipboard"
                >
                  {copiedVisitor ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-amber-500/20 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
            <Scale className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Statutory Legal & Regulatory Disclaimer (ALRR 1886)</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            <strong>1. Official Records Alignment:</strong> Information displayed on <em>BhumiBinimoy (Assam Land Exchange)</em> reflects digitized cadastral and land revenue records reconciled from <em>Dharitree (Jamabandi Textual RoR)</em> and <em>Bhudakshya (Bhu-Naksha Cadastral WebGIS)</em> maintained under the authority of the Revenue & Disaster Management Department, Government of Assam.
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
            <strong>2. Statutory Approvals & Non-Substitution:</strong> Voluntary listing and 8-point automated title health scoring do not constitute a final legal title guarantee or preempt statutory revenue clearances. All property conveyances remain strictly subject to Section 10 of the <em>Assam Land and Revenue Regulation (ALRR), 1886</em>, mandatory Circle Officer Land Sale NOC clearance, Chapter X Tribal Belt and Block restrictions (Section 162), non-encumbrance verification, and formal registration before the Sub-Registrar under the <em>Registration Act, 1908</em>.
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
            <strong>3. Regulatory Standing:</strong> BhumiBinimoy operates as a government-facilitated technological marketplace (NESFIC-D-52) eliminating predatory middlemen. The platform does not act as an escrow agent, real estate broker, or lending institution.
          </p>
        </div>

        {/* Bottom Section: Copyrights, Lead Applicant & Credits */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-slate-300 font-semibold tracking-wide">
              &copy; 2026 RazorNext Software Pvt Ltd. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-400">
              Lead Applicant: <span className="text-white font-medium">Abhishek Satyam</span> • RazorNext Software Pvt Ltd
            </p>
            <p className="text-[11px] text-slate-500">
              Developed for Assam Startup NESFIC 2026 • Problem Statement: NESFIC-D-52 • Stream 1 (Government Track) • Revenue & Disaster Management Dept.
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
