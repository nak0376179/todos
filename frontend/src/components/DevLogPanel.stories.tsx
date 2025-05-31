import type { Meta, StoryObj } from '@storybook/react'
import DevLogPanel from './DevLogPanel'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'
import { DevLogProvider, useDevLog } from '@/components/DevLogContext'

const meta: Meta<typeof DevLogPanel> = {
  title: 'components/DevLogPanel',
  component: DevLogPanel,
  parameters: {
    docs: {
      description: {
        component: '開発者向けのリアルタイムログパネル。操作ログやエラーを画面右下に固定表示して可視化します。',
      },
      story: {
        height: '200px',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof DevLogPanel>

const dummyLogs = [
  { type: '追加', message: 'TODO「買い物」を追加', time: '12:01:23' },
  { type: '更新', message: 'TODOを完了に変更 (id: 123)', time: '12:02:10' },
  { type: '削除', message: 'TODOを削除 (id: 123)', time: '12:03:00' },
  { type: 'エラー', message: '追加失敗: ネットワークエラー', time: '12:04:00' },
]

export const Default: Story = {
  render: () => {
    const [logs, setLogs] = useState(dummyLogs)
    const [open, setOpen] = useState(true)
    return <DevLogPanel logs={logs} open={open} onClose={() => setOpen(false)} onClear={() => setLogs([])} />
  },
}

export const WithPushLogButton: Story = {
  render: () => {
    function WithPushLogButtonContent() {
      const { pushLog, pushErrorLog, openPanel, closePanel } = useDevLog()
      // ...省略（ボタンやDevLogPanelのJSX）
      return (
        <>
          <Stack direction="row" spacing={2} sx={{ position: 'fixed', left: 24, bottom: 24, zIndex: 3000 }}>
            <Button variant="contained" onClick={() => pushLog('追加', 'Storybookから追加')}>
              pushLogで追加
            </Button>
            <Button variant="contained" onClick={() => pushErrorLog('Storybookからエラー追加')}>
              pushErrorLogでエラー追加
            </Button>
            <Button variant="outlined" onClick={openPanel}>
              開く
            </Button>
            <Button variant="outlined" onClick={closePanel}>
              閉じる
            </Button>
          </Stack>
        </>
      )
    }

    return (
      <DevLogProvider>
        <WithPushLogButtonContent />
      </DevLogProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    if (button) button.click()
  },
}
