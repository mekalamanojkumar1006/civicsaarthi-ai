import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Bell, CheckCheck, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface NotificationItem {
  id: string
  titleEn: string
  titleTe: string
  titleHi: string
  descriptionEn: string
  descriptionTe: string
  descriptionHi: string
  timeEn: string
  timeTe: string
  timeHi: string
  unread: boolean
  type: 'scheme' | 'system' | 'reminder'
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    titleEn: 'New Scheme Matched',
    titleTe: 'కొత్త పథకం జతచేయబడింది',
    titleHi: 'नई योजना से मेल खाया',
    descriptionEn: 'You are eligible for PM Surya Ghar: Muft Bijli Yojana.',
    descriptionTe: 'మీరు పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజనకు అర్హులు.',
    descriptionHi: 'आप पीएम सूर्य घर: मुफ्त बिजली योजना के लिए पात्र हैं।',
    timeEn: '10m ago',
    timeTe: '10 నిమిషాల క్రితం',
    timeHi: '10 मिनट पहले',
    unread: true,
    type: 'scheme',
  },
  {
    id: '2',
    titleEn: 'Application Deadline Approaching',
    titleTe: 'దరఖాస్తు గడువు సమీపిస్తోంది',
    titleHi: 'आवेदन की अंतिम तिथि निकट है',
    descriptionEn: 'Post Matric Scholarship 2026 deadline is in 3 days.',
    descriptionTe: 'పోస్ట్ మెట్రిక్ స్కాలర్‌షిప్ 2026 గడువు 3 రోజుల్లో ముగుస్తుంది.',
    descriptionHi: 'पोस्ट मैट्रिक छात्रवृत्ति 2026 की अंतिम तिथि में 3 दिन शेष हैं।',
    timeEn: '2h ago',
    timeTe: '2 గంటల క్రితం',
    timeHi: '2 घंटे पहले',
    unread: true,
    type: 'reminder',
  },
  {
    id: '3',
    titleEn: 'Document Verified',
    titleTe: 'పత్రం ధ్రువీకరించబడింది',
    titleHi: 'दस्तावेज़ सत्यापित हुआ',
    descriptionEn: 'Your Income Certificate has been verified successfully.',
    descriptionTe: 'మీ ఆదాయ ధ్రువీకరణ పత్రం విజయవంతంగా ధ్రువీకరించబడింది.',
    descriptionHi: 'आपका आय प्रमाण पत्र सफलतापूर्वक सत्यापित हो गया है।',
    timeEn: '1d ago',
    timeTe: 'నిన్న',
    timeHi: '1 दिन पहले',
    unread: false,
    type: 'system',
  },
]

export function NotificationMenu() {
  const { t, isTelugu, isHindi, fontClass } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState<{ top: number; right: number; maxWidth: number }>({
    top: 0,
    right: 0,
    maxWidth: 384,
  })

  const unreadCount = notifications.filter((n) => n.unread).length

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const top = rect.bottom + 8

    // Target width: 384px on desktop/tablet; clamped to (viewportWidth - 24) on small screens
    const effectiveWidth = Math.min(384, Math.max(280, viewportWidth - 24))
    const idealRight = viewportWidth - rect.right

    // Clamping to keep panel within screen margins (>= 12px from both edges)
    const maxRight = Math.max(12, viewportWidth - effectiveWidth - 12)
    const clampedRight = Math.min(Math.max(12, idealRight), maxRight)

    setPosition({
      top,
      right: clampedRight,
      maxWidth: effectiveWidth,
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    function handleScroll() {
      updatePosition()
    }

    function handleResize() {
      updatePosition()
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, updatePosition])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const toggleItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    )
  }

  return (
    <div className={`relative inline-block ${fontClass}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          updatePosition()
          setIsOpen((prev) => !prev)
        }}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
              width: `${position.maxWidth}px`,
              maxWidth: `${position.maxWidth}px`,
            }}
            className="fixed rounded-2xl bg-white border border-[var(--color-border)] shadow-2xl z-[100] overflow-hidden animate-scale-in"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-raised)]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[var(--color-foreground)]">{t('notifTitle')}</span>
                {unreadCount > 0 && (
                  <span className="badge badge-accent text-[10px] px-1.5 py-0.2">
                    {unreadCount} {t('notifNew')}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-[var(--color-secondary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" /> {t('notifMarkAllRead')}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-[var(--color-border-subtle)]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--color-muted-foreground)]">
                  {t('notifEmpty')}
                </div>
              ) : (
                notifications.map((n) => {
                  const title = isTelugu ? n.titleTe : isHindi ? n.titleHi : n.titleEn
                  const description = isTelugu ? n.descriptionTe : isHindi ? n.descriptionHi : n.descriptionEn
                  const time = isTelugu ? n.timeTe : isHindi ? n.timeHi : n.timeEn
                  return (
                    <div
                      key={n.id}
                      onClick={() => toggleItemRead(n.id)}
                      className={cn(
                        'p-3.5 transition-colors hover:bg-[var(--color-muted)] flex items-start gap-3 text-left cursor-pointer',
                        n.unread && 'bg-[var(--color-secondary-50)]/40'
                      )}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          n.unread ? 'bg-[var(--color-secondary)]' : 'bg-transparent'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--color-foreground)] leading-snug">{title}</p>
                        <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5 line-clamp-2 leading-relaxed">
                          {description}
                        </p>
                        <span className="flex items-center gap-1 text-[10px] text-[var(--color-muted-foreground)] mt-1 font-medium">
                          <Clock className="w-3 h-3" /> {time}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
