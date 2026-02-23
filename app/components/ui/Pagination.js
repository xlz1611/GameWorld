/**
 * 分页组件
 * 用于在游戏列表中显示分页控件，允许用户切换不同页码
 * 
 * @param {number} currentPage - 当前页码
 * @param {number} totalPages - 总页数
 * @param {Function} onPageChange - 页码变化时的回调函数
 * @returns {JSX.Element|null} 分页控件组件，如果总页数小于等于1则返回null
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center mt-12 space-x-2" aria-label="分页导航">
      <button 
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0F172A] pagination-btn focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        aria-label="上一页"
        aria-disabled={currentPage === 1}
      >
        上一页
      </button>
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNum = index + 1
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum ? 'bg-brand text-[#0F172A] font-semibold active' : 'bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A]'} pagination-btn focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]`}
              aria-label={`前往第 ${pageNum} 页`}
              aria-current={currentPage === pageNum ? 'page' : false}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      <button 
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0F172A] pagination-btn focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        aria-label="下一页"
        aria-disabled={currentPage === totalPages}
      >
        下一页
      </button>
    </nav>
  )
}

export default Pagination