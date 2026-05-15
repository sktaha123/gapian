import { useEffect, useState } from 'react';
import { Book, Compass, Video, Wrench, LayoutTemplate, MessageSquare, Briefcase, Dumbbell, GraduationCap, Mail, Magnet } from 'lucide-react';

const PRODUCT_TYPES = [
  { id: 'ebook',              title: 'Ebook',               icon: Book,          desc: 'Comprehensive editorial guide with chapters',        tag: 'Long-form' },
  { id: 'guide',              title: 'Guide',               icon: Compass,       desc: 'Actionable step-by-step tactical framework',         tag: 'Tactical' },
  { id: 'course',             title: 'Course',              icon: Video,         desc: 'Structured curriculum and lesson progression',        tag: 'Education' },
  { id: 'prompt_pack',        title: 'Prompt Pack',         icon: MessageSquare, desc: 'Curated, categorized AI prompts for specific tasks',  tag: 'AI Toolkit' },
  { id: 'toolkit',            title: 'Toolkit',             icon: Wrench,        desc: 'High-value collection of resources and tools',        tag: 'Resources' },
  { id: 'template',           title: 'Template',            icon: LayoutTemplate,desc: 'Plug-and-play structural and design assets',          tag: 'Plug & Play' },
  { id: 'business_blueprint', title: 'Business Blueprint',  icon: Briefcase,     desc: 'Complete strategic and operational framework',        tag: 'Strategy' },
  { id: 'fitness_plan',       title: 'Fitness Plan',        icon: Dumbbell,      desc: 'Structured physical training and wellness regimen',   tag: 'Wellness' },
  { id: 'educational',        title: 'Educational Resource',icon: GraduationCap, desc: 'Academic or professional skill-building curriculum',  tag: 'Academic' },
  { id: 'newsletter',         title: 'Newsletter Strategy', icon: Mail,          desc: 'Full email sequence and content calendar system',     tag: 'Marketing' },
  { id: 'lead_magnet',        title: 'Lead Magnet',         icon: Magnet,        desc: 'High-conversion opt-in product for list growth',      tag: 'Growth' },
];

function TypeCard({ item, active, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
        active
          ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/[0.06] shadow-[0_0_0_1px_rgba(45,125,255,0.2),0_0_24px_rgba(45,125,255,0.06)]'
          : 'border-[#202635] bg-[#0B0B0F] hover:border-[#3A4352] hover:bg-[#111318]'
      }`}
    >
      {/* Top row: Icon + Tag */}
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
          active
            ? 'border-[#2D7DFF]/40 bg-[#2D7DFF]/20 text-[#7AB6FF]'
            : 'border-[#202635] bg-[#050505] text-[#6E7685] group-hover:border-[#3A4352] group-hover:text-[#A0A7B4]'
        }`}>
          <Icon size={17} />
        </div>
        <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] transition-colors ${
          active ? 'bg-[#2D7DFF]/10 text-[#4B8DFF]' : 'bg-[#202635] text-[#6E7685]'
        }`}>{item.tag}</span>
      </div>

      {/* Text */}
      <div>
        <h3 className={`text-[14px] font-bold tracking-tight transition-colors ${active ? 'text-white' : 'text-[#D9DEE7] group-hover:text-white'}`}>
          {item.title}
        </h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#6E7685]">
          {item.desc}
        </p>
      </div>

      {/* Active indicator dot */}
      {active && (
        <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#2D7DFF] shadow-[0_0_8px_rgba(45,125,255,0.9)]" />
      )}
    </button>
  );
}

function StepTypeSelector({ data, updateData, onCanContinue }) {
  const [selected, setSelected] = useState(data.productType || null);

  useEffect(() => {
    if (selected) {
      updateData('productType', selected);
      onCanContinue(true);
    }
  }, [selected, updateData, onCanContinue]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14 fade-up">
      <div className="mb-10 border-b border-[#202635] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF] mb-2">Step 1 — Format Selection</p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
          Choose Your Product Format
        </h2>
        <p className="text-[15px] leading-relaxed text-[#A0A7B4] max-w-xl">
          The format controls the entire specification architecture — typography, layout density, hierarchy, and component logic.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {PRODUCT_TYPES.map(type => (
          <TypeCard key={type.id} item={type} active={selected?.id === type.id} onSelect={setSelected} />
        ))}
      </div>

      {selected && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#2D7DFF]/20 bg-[#2D7DFF]/[0.04] px-5 py-4">
          <div className="h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_6px_rgba(45,125,255,0.8)]" />
          <p className="text-[13px] text-[#A0A7B4]">
            <span className="font-bold text-white">{selected.title}</span> selected — Gapian AI will engineer a{' '}
            <span className="text-[#7AB6FF]">{selected.tag.toLowerCase()}</span> specification architecture.
          </p>
        </div>
      )}
    </div>
  );
}

export default StepTypeSelector;
