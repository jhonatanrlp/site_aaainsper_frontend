import { AppProviders } from './app/providers/AppProviders.js';
import { AppRouter } from './app/router/AppRouter.js';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
