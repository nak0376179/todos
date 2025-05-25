import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// MSW 初期化
initialize();

// QueryClient を作成
const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    // 他の Storybook のパラメータ
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
