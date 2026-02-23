import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Banner from './components/Banner'
import EditorPanel from './components/EditorPanel'
import RulePanel from './components/RulePanel'
import { formatWithRules } from './utils/formatSql'
import { defaultFormatRules, type FormatRulesState } from './types/formatRules'

function App() {
  const [inputSql, setInputSql] = useState('')
  const [outputSql, setOutputSql] = useState('')
  const [rules, setRules] = useState<FormatRulesState>(defaultFormatRules)

  const runFormat = useCallback(() => {
    if (!inputSql.trim()) {
      setOutputSql('')
      return
    }
    try {
      const formatted = formatWithRules(inputSql, rules)
      setOutputSql(formatted)
    } catch (error) {
      setOutputSql(
        `포매팅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
    }
  }, [inputSql, rules])

  const handleFormat = () => runFormat()

  // 규칙 변경 시에만 Output 재반영 (Input 변경 시에는 버튼으로 포맷)
  useEffect(() => {
    if (!inputSql.trim()) return
    try {
      setOutputSql(formatWithRules(inputSql, rules))
    } catch (error) {
      setOutputSql(
        `포매팅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 규칙 변경 시에만 재포맷
  }, [rules])

  return (
    <div className="app">
      <Banner />
      <div className="main-content">
        <RulePanel rules={rules} onChange={setRules} />
        <div className="editor-container">
          <EditorPanel
            title="Input"
            value={inputSql}
            onChange={setInputSql}
            placeholder="SQL 쿼리를 입력하세요..."
          />
          <div className="divider">
            <button className="format-button" onClick={handleFormat}>
              정렬하기 →
            </button>
          </div>
          <EditorPanel
            title="Output"
            value={outputSql}
            onChange={setOutputSql}
            placeholder="정렬된 결과가 여기에 표시됩니다..."
            readOnly
          />
        </div>
      </div>
    </div>
  )
}

export default App
