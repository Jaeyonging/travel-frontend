import { NavLink } from 'react-router-dom'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'
import { TABS } from './navigation'

export interface BottomTabBarProps {
  hidden?: boolean
  savedCount?: number
}

export default function BottomTabBar({ hidden = false, savedCount = 0 }: BottomTabBarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 z-40 w-full max-w-[480px] border-t border-ink-100 bg-white/95 pb-safe backdrop-blur-md transition-transform duration-300 ease-spring',
        hidden ? 'pointer-events-none translate-y-full' : 'translate-y-0',
      )}
      aria-hidden={hidden}
    >
      <div className="flex h-[62px] items-stretch">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              cn(
                'pressable-sm relative flex flex-1 flex-col items-center justify-center gap-1 pt-1 transition-colors duration-200',
                isActive ? 'text-brand-500' : 'text-ink-300',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute inset-x-0 top-0 mx-auto h-[3px] rounded-full bg-brand-500 transition-all duration-300 ease-spring',
                    isActive ? 'w-7 opacity-100' : 'w-0 opacity-0',
                  )}
                />
                <span
                  key={isActive ? 'on' : 'off'}
                  className={cn('relative', isActive && 'animate-tab-pop')}
                >
                  <Icon name={tab.icon} size={22} strokeWidth={isActive ? 2.1 : 1.7} />
                  {tab.to === '/saved' && savedCount > 0 && (
                    <span
                      key={savedCount}
                      className="absolute -right-2 -top-1 grid h-[15px] min-w-[15px] animate-badge-pop place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white"
                    >
                      {savedCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10.5px] transition-all duration-200',
                    isActive ? 'font-extrabold' : 'font-semibold',
                  )}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
