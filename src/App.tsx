import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Banner from './components/Banner'
import Sidebar from './components/Sidebar'
import EditorContainer from './components/EditorContainer'
import AiPreviewModal from './components/AiPreviewModal'
import { formatWithRules, detectDialectOnly } from './utils/formatSql'
import { applyReplaceRules } from './utils/applyReplaceRules'
import { requestAiFormat } from './utils/aiFormat'
import {
  loadFormatRules,
  saveFormatRules,
  loadCustomRules,
  saveCustomRules,
  loadAiProvider,
  saveAiProvider,
  loadAiApiKey,
  saveAiApiKey,
} from './utils/storage'
import { defaultFormatRules, type FormatRulesState } from './types/formatRules'
import type { ReplaceRuleItem } from './types/customRules'
import type { AiProvider } from './types/ai'

// 입력 중 방언 감지 debounce 딜레이 (ms)
const DETECT_DEBOUNCE_MS = 300

function App() {
  // ── Editor 상태 ────────────────────────────────
  const [inputSql, setInputSql]           = useState('')
  const [outputSql, setOutputSql]         = useState('')
  const [detectedDialect, setDetectedDialect] = useState('')

  // ── 포매팅 규칙 상태 (localStorage 연동) ────────
  const [rules, setRules]               = useState<FormatRulesState>(() => loadFormatRules() ?? defaultFormatRules)
  const [customRules, setCustomRules]   = useState<ReplaceRuleItem[]>(() => loadCustomRules() ?? [])

  // ── 레이아웃 상태 ──────────────────────────────
  const [isTopBannerHidden, setIsTopBannerHidden]       = useState(false)
  const [isBottomBannerHidden, setIsBottomBannerHidden] = useState(false)
  const [isSidebarHidden, setIsSidebarHidden]           = useState(false)

  // ── AI 상태 ────────────────────────────────────
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => loadAiProvider() ?? 'openai')
  const [apiKey, setApiKey]         = useState('')
  const [keySaved, setKeySaved]     = useState(false)
  const [aiLoading, setAiLoading]   = useState(false)
  const [aiPreview, setAiPreview]   = useState<{ before: string; after: string } | null>(null)

  // ── debounce ref ───────────────────────────────
  const detectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── localStorage 동기화 ────────────────────────
  useEffect(() => { saveFormatRules(rules) },   [rules])
  useEffect(() => { saveCustomRules(customRules) }, [customRules])
  useEffect(() => { saveAiProvider(aiProvider) }, [aiProvider])

  useEffect(() => {
    const stored = loadAiApiKey(aiProvider)
    setApiKey(stored)
    setKeySaved(stored.length > 0)
  }, [aiProvider])

  // ── 실시간 방언 감지 (inputSql 변경 시) ─────────
  // 포매팅과 독립적으로 동작 — 입력할 때마다 debounce 후 감지
  useEffect(() => {
    if (detectTimerRef.current) clearTimeout(detectTimerRef.current)

    if (!inputSql.trim()) {
      setDetectedDialect('')
      return
    }

    detectTimerRef.current = setTimeout(() => {
      const { label } = detectDialectOnly(inputSql)
      setDetectedDialect(label)
    }, DETECT_DEBOUNCE_MS)

    return () => {
      if (detectTimerRef.current) clearTimeout(detectTimerRef.current)
    }
  }, [inputSql])

  // ── 포매팅 실행 (규칙/커스텀 규칙 변경 시 자동 재실행) ──
  useEffect(() => {
    if (!inputSql.trim()) {
      setOutputSql('')
      return
    }
    try {
      const result = formatWithRules(inputSql, rules)
      setOutputSql(applyReplaceRules(result.sql, customRules))
    } catch (error) {
      setOutputSql(`포매팅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
    // inputSql 변경은 버튼 클릭(handleFormat)으로만 트리거 — 규칙 변경 시에만 자동 재실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, customRules])

  // ── 포매팅 실행 함수 (버튼 클릭 / 명시적 호출용) ──
  const runFormat = useCallback(() => {
    if (!inputSql.trim()) {
      setOutputSql('')
      setDetectedDialect('')
      return
    }
    try {
      const result = formatWithRules(inputSql, rules)
      setOutputSql(applyReplaceRules(result.sql, customRules))
      setDetectedDialect(result.detectedDialectLabel)
    } catch (error) {
      setOutputSql(`포매팅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      setDetectedDialect('')
    }
  }, [inputSql, rules, customRules])

  const handleFormat = () => runFormat()

  // ── AI 관련 핸들러 ─────────────────────────────
  const handleSaveApiKey = () => {
    saveAiApiKey(aiProvider, apiKey)
    setKeySaved(true)
  }

  const handleClearApiKey = () => {
    saveAiApiKey(aiProvider, '')
    setApiKey('')
    setKeySaved(false)
  }

  const handleApiKeyChange = (key: string) => {
    setApiKey(key)
    if (keySaved) setKeySaved(false)
  }

  const handleRequestAi = async () => {
    if (!inputSql.trim() || !apiKey.trim()) return
    setAiLoading(true)
    try {
      const after = await requestAiFormat(aiProvider, apiKey, inputSql, rules)
      setAiPreview({ before: outputSql || inputSql, after })
    } catch (error) {
      setOutputSql(`AI 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setAiLoading(false)
    }
  }

  const handleApplyAiResult = () => {
    if (aiPreview) {
      setOutputSql(aiPreview.after)
      setAiPreview(null)
    }
  }

  // ── 레이아웃 토글 ──────────────────────────────
  const toggleTopBanner    = () => setIsTopBannerHidden(v => !v)
  const toggleBottomBanner = () => setIsBottomBannerHidden(v => !v)
  const toggleSidebar      = () => setIsSidebarHidden(v => !v)

  return (
    <div className="app">
      <Banner position="top" isHidden={isTopBannerHidden} onToggleHide={toggleTopBanner} />
      <div className={`main-content ${isTopBannerHidden ? 'banner-hidden' : ''} ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
        <Sidebar
          rules={rules}
          onRulesChange={setRules}
          customRules={customRules}
          onCustomRulesChange={setCustomRules}
          aiProvider={aiProvider}
          apiKey={apiKey}
          onAiProviderChange={setAiProvider}
          onApiKeyChange={handleApiKeyChange}
          onSaveApiKey={handleSaveApiKey}
          onClearApiKey={handleClearApiKey}
          onRequestAi={handleRequestAi}
          aiLoading={aiLoading}
          keySaved={keySaved}
          isHidden={isSidebarHidden}
          onToggle={toggleSidebar}
        />
        <EditorContainer
          inputSql={inputSql}
          onInputChange={setInputSql}
          outputSql={outputSql}
          onOutputChange={setOutputSql}
          onFormat={handleFormat}
          detectedDialect={detectedDialect}
        />
      </div>
      <Banner position="bottom" isHidden={isBottomBannerHidden} onToggleHide={toggleBottomBanner} />
      {aiPreview && (
        <AiPreviewModal
          before={aiPreview.before}
          after={aiPreview.after}
          onApply={handleApplyAiResult}
          onCancel={() => setAiPreview(null)}
        />
      )}
    </div>
  )
}

export default App
