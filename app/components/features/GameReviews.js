'use client'

import { useState, useEffect } from 'react'
import { Star, Send, Clock, User } from 'lucide-react'
import { useUser } from '../../lib/UserContext'

const GameReviews = ({ gameId }) => {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isLoggedIn, getAuthHeaders } = useUser()

  useEffect(() => {
    loadReviews()
  }, [gameId])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/games/${gameId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.comments || [])
      }
    } catch (err) {
      console.warn('加载评论失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!newReview.trim() || userRating === 0) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/games/${gameId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ content: newReview.trim(), rating: userRating })
      })

      const data = await res.json()

      if (res.ok) {
        setReviews(prev => [data.comment, ...prev])
        setNewReview('')
        setUserRating(0)
      } else {
        setError(data.error || '发表评论失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-brand fill-brand' : 'text-muted'}`}
        strokeWidth={1.5}
      />
    ))
  }

  const handleRatingChange = (rating) => {
    setUserRating(rating)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0

  const ratingDistribution = Array.from({ length: 5 }, (_, index) => {
    const star = 5 - index
    const count = reviews.filter(r => r.rating === star).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { star, count, percentage }
  })

  return (
    <div className="space-y-8">
      {/* 评分和评论统计 */}
      <div className="bg-[#0F172A] rounded-xl p-6" aria-labelledby="rating-stats-heading">
        <h2 id="rating-stats-heading" className="sr-only">评分统计</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <div className="text-4xl font-bold text-white">
                {reviews.length > 0 ? avgRating.toFixed(1) : '暂无'}
              </div>
              <div className="flex">
                {renderStars(
                  reviews.length > 0 ? Math.round(avgRating) : 0
                )}
              </div>
            </div>
            <p className="text-muted text-sm">
              基于 {reviews.length} 条用户评价
            </p>
          </div>

          {/* 评分分布 */}
          <div className="w-full md:w-1/2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="w-16 flex justify-end">
                  <span className="text-sm text-muted">{star}星</span>
                </div>
                <div className="flex-1 bg-[#1E293B] rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                    aria-label={`${star}星评价占比 ${percentage.toFixed(0)}%`}
                  />
                </div>
                <div className="w-12 text-right">
                  <span className="text-sm text-muted">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 发表评论 */}
      <div className="bg-[#0F172A] rounded-xl p-6" aria-labelledby="add-review-heading">
        <h3 id="add-review-heading" className="text-xl font-bold mb-4 text-white">发表评论</h3>

        {!isLoggedIn ? (
          <div className="text-center py-6">
            <p className="text-muted mb-3">请先登录后再发表评论</p>
            <a
              href="/auth/login"
              className="inline-block bg-brand text-[#0F172A] font-semibold px-6 py-2 rounded-xl hover:bg-brand-hover transition-colors"
            >
              去登录
            </a>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 评分选择 */}
            <div className="mb-4">
              <label className="block text-sm text-muted mb-2" htmlFor="rating-stars">给游戏打分</label>
              <div id="rating-stars" className="flex space-x-2 rating-stars">
                {Array.from({ length: 5 }, (_, index) => {
                  const rating = index + 1
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
                      aria-label={`给游戏打 ${rating} 星`}
                      aria-pressed={userRating === rating}
                    >
                      <Star
                        className={`w-8 h-8 ${index < userRating ? 'text-brand fill-brand' : 'text-muted hover:text-brand'}`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 评论内容 */}
            <div className="mb-4">
              <label className="block text-sm text-muted mb-2" htmlFor="review-content">写下你的评论</label>
              <textarea
                id="review-content"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="分享你的游戏体验..."
                className="w-full bg-[#1E293B] border border-[#334155] rounded-xl p-4 text-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] resize-none min-h-[120px]"
                maxLength={500}
                aria-label="评论内容"
                aria-describedby="review-length"
              />
              <div id="review-length" className="text-right mt-2">
                <span className="text-xs text-muted">
                  {newReview.length}/500
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || userRating === 0 || submitting}
              className={`w-full py-3 rounded-xl transition-colors ${(!newReview.trim() || userRating === 0) ? 'bg-[#1E293B] border border-[#334155] text-muted cursor-not-allowed' : submitting ? 'bg-brand/70 text-[#0F172A] cursor-not-allowed' : 'bg-brand text-[#0F172A] font-semibold hover:bg-brand-hover'} focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]`}
              aria-label="提交评论"
              aria-disabled={!newReview.trim() || userRating === 0 || submitting}
            >
              {submitting ? '发布中...' : '发表评论'}
            </button>
          </>
        )}
      </div>

      {/* 评论列表 */}
      <div aria-labelledby="reviews-list-heading">
        <h3 id="reviews-list-heading" className="text-xl font-bold mb-4 text-white">用户评论</h3>

        {loading ? (
          <div className="text-center py-12 bg-[#0F172A] rounded-xl">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">加载评论中...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-[#0F172A] rounded-xl">
            <User className="w-16 h-16 text-muted mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted">暂无评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          <div className="space-y-4" aria-live="polite">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#0F172A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-brand" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">{review.user?.name || '未知用户'}</h4>
                      <div className="flex items-center space-x-1 text-xs text-muted">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-muted leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GameReviews
