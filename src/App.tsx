import { useState } from 'react'
import { format } from 'sql-formatter'
import './App.css'
import Banner from './components/Banner'
import EditorPanel from './components/EditorPanel'

function App() {
  const [inputSql, setInputSql] = useState('')
  const [outputSql, setOutputSql] = useState('')

  const handleFormat = () => {
    if (!inputSql.trim()) {
      setOutputSql('')
      return
    }

    try {
      const formatted = format(inputSql, {
        language: 'sql',
        indent: '  ',
        keywordCase: 'upper',
      })
      setOutputSql(formatted)
    } catch (error) {
      setOutputSql(`포매팅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  return (
    <div className="app">
      <Banner />
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
  )
}

export default App
