import { createBrowserRouter, RouterProvider } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import { PATHS, SCREENS } from './routes';
import FlowMapPage from './pages/FlowMapPage';
import PlaceholderPage from './pages/PlaceholderPage';

// 옮긴 화면은 여기에 등록 (없으면 임시 화면)
const PAGES: Record<string, React.ComponentType> = {
  [PATHS.flow]: FlowMapPage,
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
      { path: '*', element: <PlaceholderPage title="없는 화면이에요" /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
