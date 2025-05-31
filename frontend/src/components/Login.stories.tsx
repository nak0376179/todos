import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import Login from './Login'

const meta: Meta<typeof Login> = {
  title: 'components/Login',
  component: Login,
  parameters: {
    msw: {
      handlers: [
        // デフォルトは何も返さない
      ],
    },
  },
}
export default meta

type Story = StoryObj<typeof Login>

const userId = 'test@example.com'
const userResponse = {
  user_id: userId,
  email: userId,
  created_at: new Date().toISOString(),
}

export const 既存ユーザーログイン成功: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/users/:user_id', () => {
          return HttpResponse.json(userResponse, { status: 200 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByLabelText('ユーザーID（メールアドレス）')
    await userEvent.clear(input)
    await userEvent.type(input, userId)
    const button = await canvas.findByRole('button', { name: 'ログイン' })
    await userEvent.click(button)
  },
}

export const バリデーションエラー: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByLabelText('ユーザーID（メールアドレス）')
    await userEvent.clear(input)
    await userEvent.type(input, 'invalid-email')
    const button = await canvas.findByRole('button', { name: 'ログイン' })
    await userEvent.click(button)

    // エラーメッセージの確認
    await canvas.findByText('有効なメールアドレスを入力してください')
  },
}
