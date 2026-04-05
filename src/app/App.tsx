import { RouterProvider } from 'react-router';
import { FinanceProvider } from './context/FinanceContext';
import { router } from './routes';

export default function App() {
  return (
    <FinanceProvider>
      <RouterProvider router={router} />
    </FinanceProvider>
  );
}
