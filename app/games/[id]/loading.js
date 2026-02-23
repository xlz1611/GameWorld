export default function GameLoading() {
  return (
    <div className="min-h-screen">
      <div className="h-20 bg-[#0F172A]/80 backdrop-blur-lg border-b border-white/10 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glow-card p-6 space-y-6">
              <div className="aspect-square bg-[#0F172A] rounded-xl animate-pulse"></div>
              <div className="h-8 bg-[#0F172A] rounded animate-pulse"></div>
              <div className="h-20 bg-[#0F172A] rounded-xl animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-[#0F172A] rounded-xl animate-pulse"></div>
                ))}
              </div>
              <div className="h-14 bg-[#0F172A] rounded-xl animate-pulse"></div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <div className="glow-card p-6 space-y-4">
              <div className="h-8 bg-[#0F172A] rounded animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-[#0F172A] rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div className="glow-card p-6">
              <div className="h-8 bg-[#0F172A] rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-[#0F172A] rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
