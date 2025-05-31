/**
 * DevLogPanel - 開発者向けリアルタイムログパネル
 *
 * ## 概要
 * 画面右下に固定表示される、開発者用の操作・エラーログパネルです。
 * TODOアプリの開発時に、追加・削除・更新・エラーなどの履歴をリアルタイムで可視化できます。
 *
 * ## 特徴
 * - MUIベースのデザインでダークテーマ対応
 * - ログは自動スクロール
 * - 開閉・クリアボタン付き
 * - 任意のログ配列をpropsで渡して利用
 * - Storybookのautodocsで詳細な説明が表示されます
 *
 * ## Props
 * @param logs ログ配列。各要素は { type: string; message: string; time: string }
 * @param open パネルの表示状態（true: 表示, false: 非表示）
 * @param onClose パネルを閉じるコールバック
 * @param onOpen パネルを開くコールバック
 * @param onClear ログをクリアするコールバック
 *
 * ## 利用例
 * ```tsx
 * import DevLogPanel from './DevLogPanel'
 *
 * const [logs, setLogs] = useState([
 *   { type: '追加', message: 'TODO「買い物」を追加', time: '12:01:23' },
 *   { type: 'エラー', message: '追加失敗: ネットワークエラー', time: '12:04:00' },
 * ])
 * const [open, setOpen] = useState(true)
 *
 * <DevLogPanel logs={logs} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} onClear={() => setLogs([])} />
 * ```
 *
 * ## Tips
 * - ログの型や内容は自由に拡張できます。
 * - useDevLogフックと組み合わせると、どのページでも簡単に導入できます。
 * - 開発時のみ表示したい場合は、VITE_ENV=localやdevelでisDev判定を使うのがおすすめです。
 */
import { Paper, Box, Typography, IconButton, Divider, Fade, Fab } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import BugReportIcon from '@mui/icons-material/BugReport'
import React, { useRef, useEffect, useState } from 'react'

type Log = { type: string; message: string; time: string }

type DevLogPanelProps = {
  /** ログ配列。各要素は { type: string; message: string; time: string } */
  logs: Log[]
  /** パネルの表示状態（true: 表示, false: 非表示） */
  open: boolean
  /** パネルを閉じるコールバック */
  onClose: () => void
  /** パネルを開くコールバック */
  onOpen: () => void
  /** ログをクリアするコールバック */
  onClear: () => void
}

// @ts-ignore
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

// パネルの最小・最大サイズ
const MIN_WIDTH = 260
const MIN_HEIGHT = 120
const MAX_WIDTH = 600
const MAX_HEIGHT = 600

export default function DevLogPanel({ logs, open, onClose, onOpen, onClear }: DevLogPanelProps) {
  if (!isDev) return null

  const logEndRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [panelPos, setPanelPos] = useState({ top: window.innerHeight - 360, left: 20 })
  const [size, setSize] = useState({ width: 340, height: 320 })
  const [resizing, setResizing] = useState(false)
  const resizeStart = useRef({ x: 0, y: 0, width: 340, height: 320 })

  // ログ自動スクロール
  useEffect(() => {
    if (open && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, open])

  // ウィンドウリサイズ時にパネルが画面外に出ないように調整
  useEffect(() => {
    const handleResize = () => {
      setPanelPos((pos) => ({
        top: Math.min(pos.top, window.innerHeight - 40),
        left: Math.min(pos.left, window.innerWidth - 40),
      }))
      setSize((s) => ({
        width: Math.min(s.width, window.innerWidth - 40),
        height: Math.min(s.height, window.innerHeight - 40),
      }))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ドラッグイベント
  const onDragStart = (e: React.MouseEvent) => {
    setDragging(true)
    const panelRect = panelRef.current?.getBoundingClientRect()
    setOffset({
      x: e.clientX - (panelRect?.left ?? 0),
      y: e.clientY - (panelRect?.top ?? 0),
    })
    document.body.style.userSelect = 'none'
  }
  const onDrag = (e: MouseEvent) => {
    if (!dragging) return
    const newLeft = Math.min(Math.max(0, e.clientX - offset.x), window.innerWidth - size.width)
    const newTop = Math.min(Math.max(0, e.clientY - offset.y), window.innerHeight - size.height)
    setPanelPos({ left: newLeft, top: newTop })
  }
  const onDragEnd = () => {
    setDragging(false)
    document.body.style.userSelect = ''
  }
  // リサイズイベント
  const onResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setResizing(true)
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    }
    document.body.style.userSelect = 'none'
  }
  const onResize = (e: MouseEvent) => {
    if (!resizing) return
    const dx = e.clientX - resizeStart.current.x
    const dy = e.clientY - resizeStart.current.y
    setSize({
      width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.current.width + dx)),
      height: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.current.height + dy)),
    })
  }
  const onResizeEnd = () => {
    setResizing(false)
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', onDragEnd)
    } else {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onDragEnd)
    }
  }, [dragging, offset, size.width, size.height])

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', onResize)
      window.addEventListener('mouseup', onResizeEnd)
    } else {
      window.removeEventListener('mousemove', onResize)
      window.removeEventListener('mouseup', onResizeEnd)
    }
    return () => {
      window.removeEventListener('mousemove', onResize)
      window.removeEventListener('mouseup', onResizeEnd)
    }
  }, [resizing])

  return (
    <>
      <Fade in={open}>
        <Paper
          ref={panelRef}
          elevation={8}
          sx={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            width: size.width,
            height: size.height,
            minWidth: MIN_WIDTH,
            minHeight: MIN_HEIGHT,
            maxWidth: MAX_WIDTH,
            maxHeight: MAX_HEIGHT,
            zIndex: 2000,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            boxShadow: 8,
            bgcolor: '#222',
            color: '#fff',
            fontSize: 13,
            overflow: 'hidden',
            cursor: dragging ? 'grabbing' : 'default',
            transition: dragging ? 'none' : 'box-shadow 0.2s',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={0.5}
            sx={{ cursor: 'grab', userSelect: 'none' }}
            onMouseDown={onDragStart}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <BugReportIcon fontSize="small" />
              <Typography fontWeight="bold" fontSize={15}>
                Dev Log
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" color="inherit" onClick={onClear}>
                <ClearAllIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ bgcolor: '#444', mb: 0.5 }} />
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            {logs.length === 0 ? (
              <Typography color="#aaa" fontSize={13} textAlign="center" mt={2}>
                ログはありません
              </Typography>
            ) : (
              logs.map((log, i) => {
                const isError = log.type === 'エラー'
                return (
                  <Box
                    key={i}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={0.5}
                    sx={isError ? { bgcolor: '#f44336', color: '#fff', borderRadius: 1, px: 1 } : {}}
                  >
                    <Typography fontWeight="bold" color={isError ? '#fff' : '#90caf9'} fontSize={12} minWidth={38}>
                      [{log.type}]
                    </Typography>
                    <Typography fontSize={13} color={isError ? '#fff' : '#fff'}>
                      {log.message}
                    </Typography>
                    <Typography fontSize={11} color={isError ? '#fff' : '#bbb'} ml="auto">
                      {log.time}
                    </Typography>
                  </Box>
                )
              })
            )}
            <div ref={logEndRef} />
          </Box>
          {/* リサイズハンドル */}
          <Box
            onMouseDown={onResizeStart}
            sx={{
              position: 'absolute',
              right: 2,
              bottom: 2,
              width: 18,
              height: 18,
              cursor: 'nwse-resize',
              zIndex: 2101,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              userSelect: 'none',
            }}
          >
            <svg width="18" height="18">
              <polyline points="4,18 18,4" stroke="#888" strokeWidth="2" />
              <polyline points="10,18 18,10" stroke="#888" strokeWidth="2" />
            </svg>
          </Box>
        </Paper>
      </Fade>
      {!open && (
        <Fab
          color="primary"
          size="small"
          sx={{ position: 'fixed', left: 32, bottom: 96, zIndex: 2100 }}
          onClick={onOpen}
          aria-label="Open Dev Log"
        >
          <BugReportIcon />
        </Fab>
      )}
    </>
  )
}
