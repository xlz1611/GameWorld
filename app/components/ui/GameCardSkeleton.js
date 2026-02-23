export default function GameCardSkeleton() {
  return (
    <div className="glow-card p-4">
      <div className="flex flex-col">
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <div className="aspect-square bg-[#0F172A] animate-pulse"></div>
          <div className="absolute top-3 right-3 bg-[#1E293B] text-muted px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            分类
          </div>
        </div>
        
        <div className="h-6 bg-[#0F172A] animate-pulse rounded mb-2"></div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-[#0F172A] rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-[#0F172A] animate-pulse rounded"></div>
          </div>
          <div className="h-4 w-12 bg-[#0F172A] animate-pulse rounded"></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-16 bg-[#0F172A] animate-pulse rounded"></div>
          <div className="h-4 w-12 bg-[#0F172A] animate-pulse rounded"></div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-[#0F172A] animate-pulse rounded-lg"></div>
          <div className="flex-1 h-10 bg-[#0F172A] animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
