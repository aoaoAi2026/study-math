import { ref, onMounted } from 'vue'

export type Platform = 'web' | 'android' | 'ios' | 'desktop'

export interface PlatformInfo {
  platform: Platform
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isStandalone: boolean
  supportsPWA: boolean
  canInstall: boolean
  os: string
  browser: string
}

export function usePlatform() {
  const info = ref<PlatformInfo>({
    platform: 'web',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isStandalone: false,
    supportsPWA: false,
    canInstall: false,
    os: '',
    browser: ''
  })

  const deferredPrompt = ref<Event | null>(null)

  function detectPlatform(): PlatformInfo {
    const ua = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua)
    const isDesktop = !isMobile && !isTablet

    let platform: Platform = 'web'
    if (/Android/i.test(ua)) platform = 'android'
    else if (/iPhone|iPad|iPod/i.test(ua)) platform = 'ios'
    else if (isDesktop) platform = 'desktop'

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    const supportsPWA = 'serviceWorker' in navigator && 'PushManager' in window

    let os = 'unknown'
    if (/Windows/i.test(ua)) os = 'Windows'
    else if (/Mac/i.test(ua)) os = 'macOS'
    else if (/Linux/i.test(ua)) os = 'Linux'
    else if (/Android/i.test(ua)) os = 'Android'
    else if (/iOS/i.test(ua)) os = 'iOS'

    let browser = 'unknown'
    if (/Chrome/i.test(ua)) browser = 'Chrome'
    else if (/Safari/i.test(ua)) browser = 'Safari'
    else if (/Firefox/i.test(ua)) browser = 'Firefox'
    else if (/Edge/i.test(ua)) browser = 'Edge'

    return {
      platform,
      isMobile,
      isTablet,
      isDesktop,
      isStandalone,
      supportsPWA,
      canInstall: false,
      os,
      browser
    }
  }

  function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      info.value.canInstall = true
    })
  }

  async function installApp() {
    if (!deferredPrompt.value) return false

    const promptEvent = deferredPrompt.value as any
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice

    if (outcome === 'accepted') {
      deferredPrompt.value = null
      info.value.canInstall = false
      return true
    }
    return false
  }

  function share(data: { title?: string; text?: string; url?: string }) {
    if (navigator.share) {
      return navigator.share(data)
    }
    return Promise.reject(new Error('Share not supported'))
  }

  function copyToClipboard(text: string) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
    }
    return Promise.reject(new Error('Clipboard not supported'))
  }

  function vibrate(pattern: number | number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  function getSafeArea() {
    const computedStyle = getComputedStyle(document.documentElement)
    return {
      top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
      left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
      right: parseInt(computedStyle.getPropertyValue('--sar') || '0')
    }
  }

  onMounted(() => {
    info.value = detectPlatform()
    setupPWAInstall()
  })

  return {
    info,
    installApp,
    share,
    copyToClipboard,
    vibrate,
    getSafeArea
  }
}
