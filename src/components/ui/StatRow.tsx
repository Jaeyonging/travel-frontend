export interface Stat {
  label: string
  value: string
  sub?: string
}

/** 가로로 균등 배치되는 숫자 요약 */
export default function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex gap-2">
      {stats.map((s) => (
        <div key={s.label} className="flex-1 rounded-xl bg-ink-50 px-2 py-3 text-center">
          <p className="text-[11px] font-semibold text-ink-500">{s.label}</p>
          <p className="mt-1 text-[15.5px] font-extrabold leading-none tracking-tight">{s.value}</p>
          {s.sub && <p className="mt-0.5 text-[10.5px] text-ink-300">{s.sub}</p>}
        </div>
      ))}
    </div>
  )
}
