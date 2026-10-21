import { createBrowserRouter, RouterProvider } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import { PATHS, SCREENS } from './routes';
import FlowMapPage from './pages/FlowMapPage';
import PlaceholderPage from './pages/PlaceholderPage';
import UiKitPage from './pages/UiKitPage';
import WelcomePage from './pages/welcome/WelcomePage';
import GuidePage from './pages/guide/GuidePage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import ReviewWritePage from './pages/reviews/ReviewWritePage';
import DirectoryPage from './pages/directory/DirectoryPage';
import VendorPage from './pages/vendor/VendorPage';
import LoginPage from './pages/auth/LoginPage';
import SignupUserPage from './pages/auth/SignupUserPage';
import SignupBizPage from './pages/auth/SignupBizPage';
import HomePage from './pages/home/HomePage';
import BudgetPage from './pages/budget/BudgetPage';
import BudgetResultPage from './pages/budget/BudgetResultPage';
import MyPage from './pages/mypage/MyPage';
import InvitePage from './pages/invite/InvitePage';
import PartnerPage from './pages/partner/PartnerPage';
import PartnerJoinPage from './pages/partner/PartnerJoinPage';
import PartnerDashPage from './pages/partner/PartnerDashPage';
import PartnerPreviewPage from './pages/partner/PartnerPreviewPage';

// 옮긴 화면은 여기에 등록 (없으면 임시 화면)
const PAGES: Record<string, React.ComponentType> = {
  [PATHS.home]: HomePage,
  [PATHS.budget]: BudgetPage,
  [PATHS.budgetResult]: BudgetResultPage,
  [PATHS.mypage]: MyPage,
  [PATHS.invite]: InvitePage,
  [PATHS.partner]: PartnerPage,
  [PATHS.partnerJoin]: PartnerJoinPage,
  [PATHS.partnerDash]: PartnerDashPage,
  [PATHS.partnerPreview]: PartnerPreviewPage,
  [PATHS.flow]: FlowMapPage,
  [PATHS.welcome]: WelcomePage,
  [PATHS.guide]: GuidePage,
  [PATHS.onboarding]: OnboardingPage,
  [PATHS.reviews]: ReviewsPage,
  [PATHS.reviewWrite]: ReviewWritePage,
  [PATHS.directory]: DirectoryPage,
  [PATHS.vendor]: VendorPage,
  [PATHS.login]: LoginPage,
  [PATHS.signup]: SignupUserPage,
  [PATHS.signupBiz]: SignupBizPage,
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      ...SCREENS.map((s) => {
        const Page = PAGES[s.path];
        const page = Page ? <Page /> : <PlaceholderPage title={s.title} />;
        return { path: s.path, element: s.auth ? <RequireAuth type={s.auth}>{page}</RequireAuth> : page };
      }),
      { path: PATHS.flow, element: <FlowMapPage /> },
      { path: PATHS.uiKit, element: <UiKitPage /> },
      { path: '*', element: <PlaceholderPage title="없는 화면이에요" /> },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' }); // 깃허브 페이지 배포 경로(/wedding-way)

export default function App() {
  return <RouterProvider router={router} />;
}
