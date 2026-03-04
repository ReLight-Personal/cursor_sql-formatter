import './Banner.css'

interface BannerProps {
  isHidden?: boolean
  onToggleHide?: () => void
  position?: 'top' | 'bottom'
}

const Banner = ({ isHidden = false, onToggleHide, position = 'top' }: BannerProps) => {
  return (
    <div className={`banner ${isHidden ? 'banner-hidden' : ''} banner-${position}`}>
      <div className={`banner-content ${position === 'bottom' ? 'title-hidden' : ''}`}>
        <h1 className="banner-title">SQL-Tailor</h1>
        <p className="banner-subtitle">SQL/PL-SQL Beautifier</p>
      </div>
      <div className="banner-placeholder">
        {/* 추후 광고나 공지사항을 넣을 수 있는 공간 */}
      </div>
      <button 
        className="hide-button" 
        onClick={onToggleHide}
        aria-label={isHidden ? "Show banner" : "Hide banner"}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`arrow-icon ${isHidden ? 'arrow-up' : 'arrow-down'}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </div>
  )
}

export default Banner
