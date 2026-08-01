export interface ServiceCardProps {
  name: string;
  description: string;
}

export function ServiceCard({ name, description }: ServiceCardProps) {
  return (
    <button
      type="button"
      className="group w-full cursor-pointer rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_45px_-24px_rgba(245,158,11,0.45)] dark:border-amber-400/20 dark:bg-[#2b1f0d]/70"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-amber-50">{name}</h3>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-lime-500/15 text-lg text-amber-700 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-amber-200">
          ↗
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-amber-100/85">{description}</p>
    </button>
  );
}
