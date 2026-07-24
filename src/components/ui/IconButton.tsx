import Icon, { type IconName } from '@/components/icon'

export interface IconButtonProps {
  name: IconName
  label: string
  onClick?: () => void
  badge?: number
}

export default function IconButton({ name, label, onClick, badge }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="pressable-sm relative grid h-9 w-9 place-items-center rounded-full text-ink-700 active:bg-ink-50"
    >
      <Icon name={name} size={20} />
      {!!badge && (
        <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-coral-500 px-1 text-[9.5px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}
