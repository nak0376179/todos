import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'
import { MemoryRouter } from 'react-router-dom'
import BackToTopButton from './BackToTopButton'

const meta: Meta<typeof BackToTopButton> = {
  title: 'components/BackToTopButton',
  component: BackToTopButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof BackToTopButton>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole('button', { name: 'トップページに戻る' })
    await userEvent.click(button)
    // ここでルーティングの遷移をアサートしたい場合はMSWやモックが必要
  },
}
