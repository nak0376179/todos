import type { Preview } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import React from 'react'
import { DevLogProvider } from '../src/components/DevLogContext'
import { Provider as JotaiProvider } from 'jotai'

const queryClient = new QueryClient()

const preview: Preview = {
  decorators: [
    (Story: any) => (
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <DevLogProvider>
            <MemoryRouter>
              <Story />
            </MemoryRouter>
          </DevLogProvider>
        </QueryClientProvider>
      </JotaiProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  tags: ['autodocs'],
}

export default preview
