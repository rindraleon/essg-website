import { QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';
import { AppRoutes } from './routes';
import { Layout } from './components';
import { queryClient } from './lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <AppRoutes />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
