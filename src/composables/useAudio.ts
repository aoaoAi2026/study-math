import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export type SoundType = 'correct' | 'wrong' | 'click' | 'success' | 'levelup' | 'coin'

const SOUND_URLS: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  levelup: '/sounds/levelup.mp3',
  coin: '/sounds/coin.mp3'
}

export function useAudio() {
  const settingsStore = useSettingsStore()
  const audioContext = ref<AudioContext | null>(null)
  const sounds = ref<Record<SoundType, HTMLAudioElement | null>>({
    correct: null,
    wrong: null,
    click: null,
    success: null,
    levelup: null,
    coin: null
  })
  const isInitialized = ref(false)

  function init() {
    if (isInitialized.value) return

    if (settingsStore.soundEnabled) {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        try {
          const audio = new Audio(url)
          audio.volume = settingsStore.soundVolume
          sounds.value[key as SoundType] = audio
        } catch (e) {
          console.warn(`Failed to load sound: ${key}`)
        }
      })
    }

    isInitialized.value = true
  }

  function play(soundType: SoundType) {
    if (!settingsStore.soundEnabled) return

    const audio = sounds.value[soundType]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } else {
      playBeep(soundType)
    }
  }

  function playBeep(type: SoundType) {
    if (!audioContext.value) {
      audioContext.value = new AudioContext()
    }

    const ctx = audioContext.value
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    const frequencies: Record<SoundType, number> = {
      correct: 523.25,
      wrong: 200,
      click: 800,
      success: 880,
      levelup: 1046.5,
      coin: 1200
    }

    const durations: Record<SoundType, number> = {
      correct: 0.1,
      wrong: 0.2,
      click: 0.05,
      success: 0.3,
      levelup: 0.4,
      coin: 0.1
    }

    oscillator.frequency.value = frequencies[type]
    oscillator.type = 'sine'
    gainNode.gain.value = settingsStore.soundVolume * 0.3

    oscillator.start()
    oscillator.stop(ctx.currentTime + durations[type])
  }

  function setVolume(volume: number) {
    settingsStore.soundVolume = Math.max(0, Math.min(1, volume))
    Object.values(sounds.value).forEach(audio => {
      if (audio) audio.volume = settingsStore.soundVolume
    })
  }

  function stopAll() {
    Object.values(sounds.value).forEach(audio => {
      if (audio) audio.pause()
    })
  }

  function speak(text: string, lang = 'zh-CN') {
    if (!('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    stopAll()
    if (audioContext.value) {
      audioContext.value.close()
    }
  })

  return {
    init,
    play,
    setVolume,
    stopAll,
    speak
  }
}
