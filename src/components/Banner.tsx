import './Banner.css'

interface BannerProps {
  isHidden?: boolean
  onToggleHide?: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const Banner = ({ isHidden = false, onToggleHide, position = 'top' }: BannerProps) => {
  const getArrowDirection = () => {
    if (position === 'top') {
      return isHidden ? 'arrow-down' : 'arrow-up'
    } else if (position === 'bottom') {
      return isHidden ? 'arrow-up' : 'arrow-down'
    } else if (position === 'left') {
      return isHidden ? 'arrow-right' : 'arrow-left'
    } else if (position === 'right') {
      return isHidden ? 'arrow-left' : 'arrow-right'
    }
    return 'arrow-down'
  }

  const getAriaLabel = () => {
    if (isHidden) {
      return position === 'top' ? "Show top banner" : 
             position === 'bottom' ? "Show bottom banner" :
             position === 'left' ? "Show left banner" : "Show right banner"
    } else {
      return position === 'top' ? "Hide top banner" : 
             position === 'bottom' ? "Hide bottom banner" :
             position === 'left' ? "Hide left banner" : "Hide right banner"
    }
  }

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
        aria-label={getAriaLabel()}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`arrow-icon ${getArrowDirection()}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </div>
  )
}

export default Banner
