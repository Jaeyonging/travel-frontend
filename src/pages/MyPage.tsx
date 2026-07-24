import { useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '@/components/icon'
import { Badge, Button, Divider, StatRow } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { useToast } from '@/components/feedback'
import { SnsContentRow } from '@/features/sns'
import DevErrorSimulator from '@/features/settings/DevErrorSimulator'
import { usePwaInstall } from '@/hooks'
import { formatMinutes } from '@/lib/format'
import { useCandidates, useCatalog, useTrip } from '@/store'
import { ROUTES } from '@/app/routes'

const MENU: { icon: IconName; label: string; sub?: string }[] = [
  { icon: 'bell', label: '알림 설정' },
  { icon: 'shield', label: '데이터 및 개인정보', sub: '원본 영상은 저장하지 않아요' },
  { icon: 'share', label: '친구에게 앱 공유하기' },
]

export default function MyPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const { candidates } = useCandidates()
  const { snsContents } = useCatalog()
  const { itinerary } = useTrip()
  const { canInstall, installed, install } = usePwaInstall()

  const totalStay = candidates.reduce((sum, p) => sum + p.stayMinutes, 0)

  const handleInstall = async () => {
    const outcome = await install()
    if (outcome === 'unavailable') {
      toast('브라우저 메뉴 → "홈 화면에 추가"로 설치할 수 있어요', 'default')
    }
  }

  return (
    <div className="pb-8">
      <TopBar title="MY" />

      <div className="flex items-center gap-3 px-5 py-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#FEE500] text-ink-900">
          <Icon name="user" size={24} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[17px] font-extrabold tracking-tight">여행자님</p>
            <Badge className="bg-ink-50 text-ink-500">카카오 연동</Badge>
          </div>
          <p className="mt-0.5 text-[12px] text-ink-500">담은 곳과 일정이 계정에 저장돼요</p>
        </div>
        <button
          type="button"
          className="pressable rounded-lg border border-ink-200 px-2.5 py-1.5 text-[12px] font-bold text-ink-700"
        >
          프로필
        </button>
      </div>

      <div className="px-5 pb-4">
        <StatRow
          stats={[
            { label: '등록 콘텐츠', value: `${snsContents.length}개` },
            { label: '담은 곳', value: `${candidates.length}곳` },
            { label: '예상 체류', value: formatMinutes(totalStay) },
            { label: '만든 일정', value: '1개' },
          ]}
        />
      </div>

      {!installed && (
        <div className="mx-5 mb-4 flex items-center gap-3 rounded-2xl bg-brand-600 p-4 text-white">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
            <Icon name="pin" size={20} strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-extrabold">앱으로 설치하기</p>
            <p className="mt-0.5 text-[11.5px] text-brand-100">
              홈 화면에서 바로 열고, 오프라인에서도 담은 곳을 볼 수 있어요
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            className="pressable shrink-0 rounded-lg bg-white px-3 py-2 text-[12.5px] font-extrabold text-brand-600"
          >
            {canInstall ? '설치' : '방법'}
          </button>
        </div>
      )}

      <Divider />

      <section className="py-5">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-[15px] font-extrabold tracking-tight">등록한 SNS 콘텐츠</h2>
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className="pressable text-[12.5px] font-bold text-brand-500"
          >
            추가
          </button>
        </div>
        <div className="mt-3 space-y-2 px-5">
          {snsContents.map((content) => (
            <SnsContentRow
              key={content.id}
              content={content}
              subline={`장소 ${content.extractedPlaceIds.length}곳`}
              onClick={() => navigate(ROUTES.extractResult, { state: { url: content.url } })}
            />
          ))}
        </div>
      </section>

      <Divider />

      <ul className="py-2">
        {MENU.map((menu) => (
          <li key={menu.label}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left active:bg-ink-50"
            >
              <Icon name={menu.icon} size={19} className="text-ink-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold">{menu.label}</span>
                {menu.sub && <span className="block text-[11.5px] text-ink-300">{menu.sub}</span>}
              </span>
              <Icon name="chevron-right" size={17} className="text-ink-300" />
            </button>
          </li>
        ))}
      </ul>

      <Divider />

      <DevErrorSimulator />

      <Divider />

      <div className="px-5 pb-6">
        <Button
          variant="outline"
          size="md"
          full
          onClick={() => navigate(ROUTES.plan(itinerary.id))}
        >
          내 일정 보러가기
        </Button>
        <p className="mt-4 text-[11px] leading-relaxed text-ink-300">
          2026 관광데이터 활용 공모전 웹앱 개발 부문 프로토타입 · 한국관광공사 국문관광정보 서비스
          OpenAPI / 카카오 API 활용 예정 · 현재 데이터는 목업입니다.
        </p>
      </div>
    </div>
  )
}
