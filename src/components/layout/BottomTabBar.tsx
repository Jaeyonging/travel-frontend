import { NavLink } from 'react-router-dom'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'
import { TABS, type TabItem } from './navigation'

export interface BottomTabBarProps {
  hidden?: boolean
  savedCount?: number
}

export default function BottomTabBar({ hidden = false, savedCount = 0 }: BottomTabBarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 z-40 w-full max-w-[480px] pb-safe transition-transform duration-300 ease-spring',
        hidden ? 'pointer-events-none translate-y-[130%]' : 'translate-y-0',
      )}
      aria-hidden={hidden}
    >
      <div className="relative">
        {/* 유리처럼 비치는 배경 레이어 */}
        <div className="absolute inset-0 rounded-t-[26px] border-t border-white/60 bg-white/[0.94] shadow-[0_-10px_34px_-14px_rgba(20,23,28,.30)] backdrop-blur-md" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[26px] bg-gradient-to-r from-transparent via-ink-200/70 to-transparent" />

        <div className="relative flex h-[68px] items-stretch">
          {TABS.map((tab) =>
            tab.primary ? (
              <PrimaryTab key={tab.to} tab={tab} />
            ) : (
              <SideTab
                key={tab.to}
                tab={tab}
                badge={tab.to === '/saved' ? savedCount : 0}
              />
            ),
          )}
        </div>
      </div>
    </nav>
  )
}

/** 가운데 강조 탭 (홈) */
function PrimaryTab({ tab }: { tab: TabItem }) {
  return (
    <NavLink
      to={tab.to}
      end
      className="relative flex flex-1 flex-col items-center justify-center gap-[3px]"
    >
      {({ isActive }) => (
        <>
          {/* 활성일 때 은은하게 퍼지는 빛 */}
          <span
            className={cn(
              'pointer-events-none absolute left-1/2 top-1.5 h-12 w-12 -translate-x-1/2 rounded-full bg-brand-400 blur-xl transition-opacity duration-500',
              isActive ? 'opacity-40' : 'opacity-0',
            )}
          />
          <span
            key={isActive ? 'on' : 'off'}
            className={cn(
              'pressable-sm relative -mt-1.5 grid h-[46px] w-[46px] place-items-center rounded-[18px] text-white transition-all duration-300 ease-spring',
              'bg-gradient-to-br from-brand-400 to-brand-600',
              isActive
                ? 'scale-100 shadow-[0_8px_18px_-6px_rgba(14,124,134,.65)] ring-[3px] ring-white/90'
                : 'scale-[0.92] opacity-[0.88] shadow-[0_4px_10px_-4px_rgba(20,23,28,.35)]',
            )}
          >
            <Icon name={tab.icon} size={22} strokeWidth={2.1} />
          </span>
          <span
            className={cn(
              'relative text-[9.5px] transition-colors duration-200',
              isActive ? 'font-extrabold text-brand-600' : 'font-semibold text-ink-300',
            )}
          >
            {tab.label}
          </span>
        </>
      )}
    </NavLink>
  )
}

/** 좌우 일반 탭 */
function SideTab({ tab, badge }: { tab: TabItem; badge: number }) {
  return (
    <NavLink
      to={tab.to}
      className={({ isActive }) =>
        cn(
          'pressable-sm flex flex-1 flex-col items-center justify-center gap-[3px] transition-colors duration-200',
          isActive ? 'text-brand-600' : 'text-ink-300',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'relative grid h-8 w-[52px] place-items-center rounded-full transition-all duration-300 ease-spring',
              isActive ? 'bg-brand-50' : 'bg-transparent',
            )}
          >
            <span key={isActive ? 'on' : 'off'} className={cn(isActive && 'animate-tab-pop')}>
              <Icon name={tab.icon} size={21} strokeWidth={isActive ? 2.1 : 1.7} />
            </span>
            {badge > 0 && (
              <span
                key={badge}
                className="absolute right-2 top-0 grid h-[15px] min-w-[15px] animate-badge-pop place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white ring-2 ring-white"
              >
                {badge}
              </span>
            )}
          </span>
          <span
            className={cn(
              'text-[9.5px] transition-all duration-200',
              isActive ? 'font-extrabold' : 'font-semibold',
            )}
          >
            {tab.label}
          </span>
        </>
      )}
    </NavLink>
  )
}
