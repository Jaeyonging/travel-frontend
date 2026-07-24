import { useNavigate } from 'react-router-dom'
import { Button, EmptyState } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { ROUTES } from '@/app/routes'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div>
      <TopBar title="페이지를 찾을 수 없어요" back />
      <EmptyState
        icon="search"
        title="주소가 잘못됐어요"
        description="삭제되었거나 이동한 화면일 수 있어요."
        action={<Button onClick={() => navigate(ROUTES.home)}>홈으로 가기</Button>}
      />
    </div>
  )
}
