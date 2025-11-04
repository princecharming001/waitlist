import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseWaitlistTable = import.meta.env.VITE_SUPABASE_WAITLIST_TABLE

const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
const WAITLIST_DISPLAY_OFFSET = 3006

function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  const isSupabaseConfigured = Boolean(supabaseClient && supabaseWaitlistTable)
  const displayCountRef = useRef(0)
  const animationFrameRef = useRef(null)

  const sectionOrder = useMemo(
    () => ['hero', 'pillars', 'smarter', 'features-grid', 'calendar', 'insights', 'final-section', 'footer'],
    [],
  )

  useEffect(() => {
    displayCountRef.current = displayCount
  }, [displayCount])

  const clearCountAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  useEffect(() => () => clearCountAnimation(), [clearCountAnimation])

  const animateCountTo = useCallback(
    (target, startFrom = null) => {
      if (typeof target !== 'number') return
      
      const start = startFrom !== null ? startFrom : displayCountRef.current
      if (start >= target) {
        setDisplayCount(target)
        displayCountRef.current = target
        return
      }

      clearCountAnimation()

      const duration = 2500 // 2.5 seconds for the animation
      const startTime = performance.now()
      const difference = target - start

      // Easing function: starts fast, slows down at the end
      const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      }

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutExpo(progress)
        const currentCount = Math.floor(start + difference * easedProgress)

        setDisplayCount(currentCount)
        displayCountRef.current = currentCount

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          setDisplayCount(target)
          displayCountRef.current = target
          clearCountAnimation()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [clearCountAnimation],
  )

  const fetchWaitlistCount = useCallback(async (animateFromZero = false) => {
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - check your .env file')
      return
    }
    
    const { count, error } = await supabaseClient
      .from(supabaseWaitlistTable)
      .select('*', { head: true, count: 'exact' })

    if (error) {
      console.error('❌ Failed to fetch waitlist count:', error)
      return
    }

    // console.log('📊 Database entries:', count)
    // console.log('📊 Offset:', WAITLIST_DISPLAY_OFFSET)
    const targetCount = WAITLIST_DISPLAY_OFFSET + (count ?? 0)
    // console.log('📊 Total display count:', targetCount)
    
    if (animateFromZero) {
      // Start animation from 0 on initial load
      animateCountTo(targetCount, 0)
    } else {
      // Animate from current count (for incremental updates)
      animateCountTo(targetCount)
    }
  }, [animateCountTo, isSupabaseConfigured])

  useEffect(() => {
    // Animate from 0 ONLY on initial mount
    fetchWaitlistCount(true)
    
    // Poll database every 30 seconds to stay in sync (without animating from 0)
    const pollInterval = setInterval(() => {
      fetchWaitlistCount(false)
    }, 30000) // 30 seconds
    
    return () => clearInterval(pollInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      let currentIndex = 0

      sectionOrder.forEach((id, index) => {
        const section = document.getElementById(id)
        if (section) {
          const { offsetTop } = section
          if (scrollPosition >= offsetTop) {
            currentIndex = index
          }
        }
      })

      setActiveSectionIndex(currentIndex)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionOrder])

  const scrollToSection = useCallback(
    (index) => {
      const clampedIndex = Math.min(Math.max(index, 0), sectionOrder.length - 1)
      const targetId = sectionOrder[clampedIndex]
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveSectionIndex(clampedIndex)
      }
    },
    [sectionOrder],
  )

  const handleWaitlistSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    if (!isSupabaseConfigured) {
      setStatus({
        type: 'error',
        message:
          'Waitlist submission is disabled because Supabase environment variables are missing. Please set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_SUPABASE_WAITLIST_TABLE in your .env file.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'loading', message: '' })

      const { error } = await supabaseClient
        .from(supabaseWaitlistTable)
        .insert({
          email: email.trim(),
        })

      if (error) {
        throw error
      }

      setStatus({ type: 'success', message: 'Thanks! You are on the waitlist.' })
      setEmail('')
      // Increment count by 1 with smooth animation
      animateCountTo(displayCountRef.current + 1)
      setTimeout(() => {
        setIsWaitlistOpen(false)
        setStatus({ type: 'idle', message: '' })
      }, 2000)
    } catch (error) {
      console.error('Supabase waitlist submission failed', error)
      setStatus({
        type: 'error',
        message: 'Something went wrong while saving your email. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="relative w-full min-h-screen bg-white font-['SF_Pro_Display',system-ui,sans-serif] overflow-x-hidden">
      {/* Background Effect */}
      <div className="fixed top-0 left-0 w-full h-[1045px] bg-gradient-to-br from-[#D0E5FF] via-[#E8F2FF] to-white opacity-80 blur-[100px] -z-10" />
      
      {/* Secondary Effect */}
      <div className="fixed top-[326px] left-[412px] w-[654px] h-[371px] bg-gradient-to-b from-white via-[#DEEDFF] to-[#DEEDFF] blur-[180px] opacity-60 -z-10" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-[100px] h-[77px] bg-white/10 backdrop-blur-[25px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="images/translogo.png"
              alt="Plureto logo"
              className="h-[44px] w-auto object-contain drop-shadow-sm"
              loading="lazy"
            />
            <span className="font-semibold text-[44px] leading-[53px] tracking-[-0.04em] text-[#3D74B6]">
              Plureto
            </span>
          </div>
        </div>
        
        {/* Backed By Badge */}
        <div className="flex items-center -mt-1">
          <p className="font-normal text-[14px] leading-[20px] text-[#6B7280]">
            Backed by{' '}
            <span className="font-semibold text-[#3D74B6]">Sam Altman's</span>{' '}
            <span className="italic text-[#1E1E1E]">The Residency</span>
          </p>
        </div>
      </header>

      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Instagram - Left */}
        <div className="absolute left-[201px] top-[620px] w-[117px] h-[117px] rotate-[0.53deg]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#D5DCE7] border border-[#C3DBFF] rounded-[20px] shadow-[16px_-18px_53px_#FFFFFF,inset_0px_-112px_12px_#FFFFFF]" />
            <div className="absolute inset-[6px] bg-gradient-to-br from-white/10 to-purple-50/10 border-2 border-[#D3E7FF] rounded-[18px] backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[46px] h-[46px] bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 rounded-[12px] flex items-center justify-center text-white text-xl shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp - Top Right */}
        <div className="absolute left-[1294px] top-[378px] w-[117px] h-[117px] rotate-[0.63deg]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#D5DCE7] border border-[#C3DBFF] rounded-[20px] shadow-[16px_-18px_53px_#FFFFFF,inset_0px_-112px_12px_#FFFFFF]" />
            <div className="absolute inset-[6px] bg-gradient-to-br from-white/10 to-green-50/10 border-2 border-[#D3E7FF] rounded-[18px] backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[46px] h-[46px] bg-[#25D366] rounded-[12px] flex items-center justify-center text-white shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Google - Right Side */}
        <div className="absolute left-[1190px] top-[536px] w-[110px] h-[110px] -rotate-[16deg]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#D5DCE7] border border-[#3D74B6] rounded-[20px] shadow-[16px_-18px_53px_#FFFFFF,inset_0px_-112px_12px_#FFFFFF]" />
            <div className="absolute inset-[6px] bg-gradient-to-br from-white/10 to-blue-50/10 border-2 border-[#3D74B6] rounded-[18px] backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-lg flex items-center justify-center font-bold text-[#4285F4] text-xl">
                G
              </div>
            </div>
          </div>
        </div>

        {/* FaceTime - Top Left */}
        <div className="absolute left-[143px] top-[359px] w-[117px] h-[117px] rotate-[25deg]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#D5DCE7] border border-[#C3DBFF] rounded-[20px] shadow-[16px_-18px_53px_#FFFFFF,inset_0px_-124px_18px_#FFFFFF]" />
            <div className="absolute inset-[6px] bg-gradient-to-br from-white/10 to-green-50/10 border-2 border-[#D3E7FF] rounded-[18px] backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[46px] h-[46px] bg-[#00E676] rounded-[12px] flex items-center justify-center text-white shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative px-[100px] pt-[120px] pb-[80px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[699px]">
          <h2 className="font-bold text-[72px] leading-[86px] tracking-[-0.05em] capitalize text-[#1E1E1E] mb-[12px]">
            It's Like Life,<br />
            But With Cheat Codes.
          </h2>
          <p className="font-bold text-[26px] leading-[32px] text-[#303030] mb-[48px] max-w-[655px]">
            Plureto learns who you are and helps you choose better in work, relationships, and life.
          </p>
          
          {/* Join Waitlist Button */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsWaitlistOpen((prev) => !prev)}
              className="relative flex items-center gap-[10px] px-[36px] py-[24px] bg-white/5 border border-white rounded-[10px] shadow-[0px_4px_22px_9px_rgba(61,116,182,0.25),inset_0px_4px_10px_8px_#FFFFFF] backdrop-blur-[10px] hover:shadow-[0px_6px_30px_12px_rgba(61,116,182,0.35)] transition-all group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#167EE6"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#12B347"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFD500"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FF4B26"/>
              </svg>
              <span className="font-medium text-[22px] leading-[26px] tracking-[-0.02em] text-black">
                {isWaitlistOpen ? 'Hide waitlist form' : 'Join the waitlist'}
              </span>
            </button>
            {isWaitlistOpen && (
              <form
                onSubmit={handleWaitlistSubmit}
                className="mt-[24px] rounded-[16px] bg-white/70 p-[20px] shadow-[0px_24px_60px_rgba(61,116,182,0.18)] border border-white/60 backdrop-blur-xl max-w-[420px]"
              >
                <label className="block text-[16px] font-medium text-[#1E1E1E] mb-[12px]">
                  Enter your email
                </label>
                <div className="flex flex-col gap-[12px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[12px] border border-[#C5D7F5] bg-white/80 px-[16px] py-[14px] text-[16px] text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#3D74B6]/60"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !isSupabaseConfigured}
                    className="w-full rounded-[12px] bg-gradient-to-r from-[#3D74B6] to-[#6A9FFF] py-[14px] text-white font-semibold text-[16px] shadow-[0px_14px_32px_rgba(61,116,182,0.35)] hover:shadow-[0px_20px_40px_rgba(61,116,182,0.45)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Get early access'}
                  </button>
                </div>
                {status.type === 'error' && (
                  <p className="mt-[12px] text-sm text-red-500">
                    {status.message}
                  </p>
                )}
                {status.type === 'success' && (
                  <p className="mt-[12px] text-sm text-green-600">
                    {status.message}
                  </p>
                )}
                {status.type === 'loading' && (
                  <p className="mt-[12px] text-sm text-[#3D74B6]">
                    Saving your spot...
                  </p>
                )}
                <p
                  className={`mt-[16px] text-xs ${isSupabaseConfigured ? 'text-[#6F7C95]' : 'text-[#B91C1C] font-semibold'}`}
                >
                  {isSupabaseConfigured ? (
                    <span>
                     
                    </span>
                  ) : (
                    <span>
                      Waitlist submissions are disabled right now. Please add <code className="bg-[#FFE5E5] px-1 rounded">VITE_SUPABASE_URL</code>, <code className="bg-[#FFE5E5] px-1 rounded">VITE_SUPABASE_ANON_KEY</code>, and <code className="bg-[#FFE5E5] px-1 rounded">VITE_SUPABASE_WAITLIST_TABLE</code> to your <code className="bg-[#FFE5E5] px-1 rounded">.env</code> file so emails can reach your Supabase database.
                    </span>
                  )}
                </p>
              </form>
            )}
          </div>
          
            <div className="mt-[40px] flex flex-col">
              {/* <span className="text-[15px] uppercase tracking-[0.6em] text-[#5B6F92]/70">Join the Momentum</span> */}
              <span className="mt-[12px] inline-flex items-baseline gap-[12px]">
                <span className="text-[72px] leading-[70px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8AA8FF] via-[#5C7FE5] to-[#2F54A7] drop-shadow-[0_20px_45px_rgba(79,118,203,0.35)]">
                  {`${displayCount.toLocaleString()}+`}
                </span>
                <span className="text-[20px] leading-[26px] font-medium text-[#22304A]/90">
                  people already inside
                </span>
              </span>
              <div className="mt-[12px] h-[2px] w-[160px] bg-gradient-to-r from-[#2F54A7] via-[#5C7FE5] to-transparent rounded-full" />
            </div>
          </div>
        </div>
      </section>

      
      {/* Plureto helps section with Phone Mockups */}
      <section id="pillars" className="relative px-[100px] py-[60px] mt-[80px]">
        <div className="mx-auto max-w-[1280px]">
          <h3 className="font-bold text-[52px] leading-[62px] tracking-[-0.02em] text-[#3D74B6] mb-[31px] max-w-[1084px]">
            Plureto helps you make better choices by truly knowing you.
          </h3>

          <div className="flex flex-wrap gap-[18px] mb-[40px]">
            <span className="font-medium text-[18px] leading-[41px] text-[#666666]">Always On Insights</span>
            <span className="font-medium text-[18px] leading-[41px] text-[#666666]">Smart Recall</span>
            <span className="font-medium text-[18px] leading-[41px] text-[#666666]">Emotional Intelligence</span>
            <span className="font-medium text-[18px] leading-[41px] text-[#666666]">Growth Tracking</span>
          </div>

          {/* Phone Mockups - Bigger */}
          <div className="flex justify-center">
            <div className="relative w-[70vw] max-w-[1000px]">
              <img
                src="images/a.png"
                alt="Plureto app interface"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Phone Mockups - Hidden/Merged */}
      <section id="mockups" className="hidden"></section>

      {/* Black Section - It's time to think smarter */}
      <section id="smarter" className="relative w-full bg-black px-[152px] py-[120px] my-[120px] text-white">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="font-medium text-[96px] leading-[115px] tracking-[-0.04em] max-w-[1175px]">
            <span className="text-white">It's time to think smarter</span>
            <br />
            <span className="text-white/80">Decisions. Plans.</span>
            <br />
            <span className="text-white/70">Conversations. Goals.</span>
            <br />
            <span className="text-white/60">Really, your whole life.</span>
          </h2>
        </div>
      </section>

      {/* Help Features Section */}
      <section id="features-grid" className="relative px-[126px] py-[80px]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-[114px]">
          {/* Left Feature */}
          <div>
            <h3 className="font-semibold text-[35px] leading-[43px] text-black mb-[24px]">
              Help, Right When You Need It
            </h3>
            <p className="font-normal text-[26px] leading-[32px] text-[#1E1E1E] mb-[32px]">
              Plureto spots what's on your screen and drops help the moment you need it.
            </p>
            <div className="w-full h-[310px] rounded-[32px] flex items-center justify-center overflow-hidden">
              <img
                src="images/feature-icons.png"
                alt="Apps Plureto integrates with"
                className="w-[88%] h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Feature */}
          <div>
            <h3 className="font-semibold text-[35px] leading-[43px] text-black mb-[24px]">
              Growth, One Chat at a Time
            </h3>
            <p className="font-normal text-[26px] leading-[32px] text-[#1E1E1E] mb-[32px]">
              It remembers your choices, gives weekly nudges, and chats with you on an emotional level.
            </p>
            <div className="relative w-full h-[310px] rounded-[32px] flex items-center justify-center overflow-hidden">
              <img
                src="images/feature-reminder.png"
                alt="Growth reminders on Plureto"
                className="relative w-[90%] h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="relative px-[126px] py-[120px] mt-[120px] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6]">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-2 gap-[80px] items-center">
            {/* Left side - Text content */}
            <div>
              <p className="font-semibold text-[24px] leading-[30px] text-[#3D74B6] mb-[20px]">
                Stay Organized
              </p>
              <h2 className="font-semibold text-[64px] leading-[77px] tracking-[-0.04em] text-black mb-[32px]">
                Your Schedule,<br />
                Simplified
              </h2>
              <p className="font-normal text-[26px] leading-[36px] text-[#282828] mb-[40px]">
                Plureto's intelligent calendar keeps you on track with smart scheduling, automatic reminders, and seamless integration with your daily routine. Never miss what matters most.
              </p>
              <div className="space-y-[20px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#3D74B6] flex items-center justify-center flex-shrink-0 mt-[4px]">
                    <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-normal text-[20px] leading-[28px] text-[#1E1E1E]">
                    Smart scheduling with AI-powered suggestions
                  </p>
                </div>
                <div className="flex items-start gap-[16px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#3D74B6] flex items-center justify-center flex-shrink-0 mt-[4px]">
                    <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-normal text-[20px] leading-[28px] text-[#1E1E1E]">
                    Automatic reminders for important events
                  </p>
                </div>
                <div className="flex items-start gap-[16px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#3D74B6] flex items-center justify-center flex-shrink-0 mt-[4px]">
                    <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-normal text-[20px] leading-[28px] text-[#1E1E1E]">
                    Seamless sync across all your devices
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Calendar image placeholder */}
            <div className="relative">
              <div className="relative w-full rounded-[32px] bg-white shadow-[0_25px_80px_rgba(61,116,182,0.25)] overflow-hidden border border-[#E5E7EB] p-[20px]">
                {/* Placeholder for calendar image */}
                <img
                  src="images/Screenshot 2025-11-02 at 11.45.42 AM.png"
                  alt="Plureto Calendar Interface"
                  className="w-full h-auto object-contain rounded-[6px]"
                  loading="lazy"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-[20px] -right-[20px] w-[120px] h-[120px] bg-gradient-to-br from-[#3D74B6] to-[#7C9CFF] rounded-full blur-[60px] opacity-40"></div>
              <div className="absolute -bottom-[20px] -left-[20px] w-[100px] h-[100px] bg-gradient-to-br from-[#4A6FD0] to-[#3D74B6] rounded-full blur-[50px] opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="relative px-[100px] py-[100px] text-center" id="insights">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-semibold text-[30px] leading-[36px] text-[#3D74B6] mb-[24px]">
            The insight you didn't know you needed.
          </p>
          <h2 className="font-medium text-[104px] leading-[124px] tracking-[-0.04em] text-black mb-[32px]">
            Plureto connects<br />
            the dots you didn't see.
          </h2>
          <p className="font-normal text-[26px] leading-[31px] text-[#282828] max-w-[885px] mx-auto mb-[48px]">
            Plureto learns your patterns, remembers what matters, and gives you honest, timely advice to help you grow whether in conversations, decisions, or daily life
          </p>
          <button className="inline-flex items-center justify-center px-[42px] py-[16px] rounded-[54px] font-semibold text-[24px] leading-[30px] text-[#ffffff] text-white border border-white/70 bg-gradient-to-r from-[#2F54A7] via-[#4A6FD0] to-[#7C9CFF] shadow-[0_22px_55px_rgba(63,103,185,0.32)] transition-all hover:shadow-[0_26px_65px_rgba(63,103,185,0.42)] hover:scale-[1.02]">
            Coming Soon
          </button>
        </div>
      </section>
<br></br>
      {/* Final Section */}
      <section id="final-section" className="relative px-[100px] py-[80px]">
        <div className="mx-auto flex max-w-[1280px] justify-between items-start">
          <h2 className="font-medium text-[72px] leading-[86px] tracking-[-0.04em] text-black max-w-[777px]">
            Your Personal Intelligence,<br />
            Ready Anytime.
          </h2>
          <div className="flex gap-[40px] pt-[40px]">
            <div className="w-[114px] h-[114px] rotate-[13deg] hover:rotate-0 transition-transform">
              <img
                src="images/chromeimg.jpg"
                alt="Floating Chrome icon"
                className="w-full h-full object-cover rounded-[24px] shadow-[0px_25px_60px_rgba(61,116,182,0.35)] border border-white/40 backdrop-blur-md"
                loading="lazy"
              />
            </div>
            <div className="w-[107px] h-[107px] rotate-[0.14deg] hover:rotate-0 transition-transform">
              <img
                src="images/027712250a632b2e6f63c5466b792494.jpg"
                alt="Floating Instagram icon"
                className="w-full h-full object-cover rounded-[24px] shadow-[0px_25px_60px_rgba(61,116,182,0.35)] border border-white/40 backdrop-blur-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="relative px-[100px] py-[60px] border-t border-gray-200/50 mt-[80px]">
        <div className="mx-auto flex max-w-[1280px] justify-between items-start mb-[60px]">
          <div className="flex items-center gap-[16px]">
            <svg width="42" height="42" viewBox="0 0 48 48" className="text-[#3D74B6]">
              <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.1"/>
              <path d="M24 12L14 18L24 24L34 18L24 12Z" fill="currentColor"/>
              <path d="M14 30L24 36L34 30" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <span className="font-semibold text-[38px] leading-[46px] tracking-[-0.04em] text-[#3D74B6]">
              Plureto
            </span>
          </div>

          <div className="flex gap-[100px]">
            <div>
              <h4 className="font-semibold text-[16px] leading-[18px] uppercase text-[#3D74B6] mb-[16px]">Legal</h4>
              <ul className="space-y-[8px]">
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Privacy Policy</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Terms of Service</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[16px] leading-[18px] uppercase text-[#3D74B6] mb-[16px]">Get Started</h4>
              <ul className="space-y-[8px]">
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Pricing</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Sales</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Manifesto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[16px] leading-[18px] uppercase text-[#3D74B6] mb-[16px]">Resources</h4>
              <ul className="space-y-[8px]">
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Pricing</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Sales</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Manifesto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[16px] leading-[18px] uppercase text-[#3D74B6] mb-[16px]">Help</h4>
              <ul className="space-y-[8px]">
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">FAQ</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Tutorials</a></li>
                <li><a href="#" className="font-medium text-[16px] leading-[24px] text-[#1E1E1E] hover:text-[#3D74B6]">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Navigation Arrows - Glass Design */}
      <div className="fixed right-[40px] top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[16px]">
        {/* Up Arrow */}
        <button
          type="button"
          onClick={() => scrollToSection(activeSectionIndex - 1)}
          disabled={activeSectionIndex === 0}
          className={`group flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(61,116,182,0.15)] transition-all duration-300 ${
            activeSectionIndex === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-white/30 hover:border-white/60 hover:shadow-[0_8px_40px_rgba(61,116,182,0.25)] hover:-translate-y-1 active:scale-95'
          }`}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#3D74B6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-y-0.5"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        {/* Section Indicator */}
        <div className="flex flex-col items-center justify-center h-[36px] px-[12px] rounded-[12px] bg-white/25 backdrop-blur-xl border border-white/40 shadow-[0_4px_16px_rgba(61,116,182,0.1)]">
          <span className="font-semibold text-[13px] text-[#3D74B6]">
            {activeSectionIndex + 1}/{sectionOrder.length}
          </span>
        </div>

        {/* Down Arrow */}
        <button
          type="button"
          onClick={() => scrollToSection(activeSectionIndex + 1)}
          disabled={activeSectionIndex === sectionOrder.length - 1}
          className={`group flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(61,116,182,0.15)] transition-all duration-300 ${
            activeSectionIndex === sectionOrder.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-white/30 hover:border-white/60 hover:shadow-[0_8px_40px_rgba(61,116,182,0.25)] hover:translate-y-1 active:scale-95'
          }`}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#3D74B6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-y-0.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default App
