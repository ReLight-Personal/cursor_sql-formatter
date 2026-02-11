import './Banner.css'

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="banner-title">SQL-Tailor</h1>
        <p className="banner-subtitle">SQL/PL-SQL Beautifier</p>
      </div>
      <div className="banner-placeholder">
        {/* 추후 광고나 공지사항을 넣을 수 있는 공간 */}
      </div>
    </div>
  )
}

export default Banner
