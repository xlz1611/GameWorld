export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-[#334155] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#334155] rounded-full"></div>
          <div className="absolute inset-2 border-4 border-brand rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <p className="text-xl font-semibold text-white mb-2">加载中...</p>
        <p className="text-muted">请稍候，正在为您准备精彩内容</p>
      </div>
    </div>
  )
}
