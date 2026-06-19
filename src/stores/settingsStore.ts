import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'space' | 'ocean' | 'magic' | 'martial' | 'eye-care'
export type FontSize = 'small' | 'medium' | 'large'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<Theme>('light')
  const fontSize = ref<FontSize>('medium')
  const soundEnabled = ref(true)
  const musicEnabled = ref(true)
  const musicVolume = ref(0.5)
  const soundVolume = ref(0.7)
  const vibrationEnabled = ref(true)
  const autoPlayVideo = ref(true)
  const showAnswerHint = ref(true)
  const dailyReminder = ref(true)
  const reminderTime = ref('20:00')

  function applyTheme() {
    document.documentElement.dataset.theme = theme.value
    localStorage.setItem('theme', theme.value)
  }

  function init() {
    const saved = localStorage.getItem('settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(
        { theme, fontSize, soundEnabled, musicEnabled, musicVolume, soundVolume, vibrationEnabled, autoPlayVideo, showAnswerHint, dailyReminder, reminderTime },
        parsed
      )
    }
    applyTheme()
  }

  function save() {
    localStorage.setItem('settings', JSON.stringify({
      theme: theme.value,
      fontSize: fontSize.value,
      soundEnabled: soundEnabled.value,
      musicEnabled: musicEnabled.value,
      musicVolume: musicVolume.value,
      soundVolume: soundVolume.value,
      vibrationEnabled: vibrationEnabled.value,
      autoPlayVideo: autoPlayVideo.value,
      showAnswerHint: showAnswerHint.value,
      dailyReminder: dailyReminder.value,
      reminderTime: reminderTime.value
    }))
  }

  function setTheme(t: Theme) {
    theme.value = t
    applyTheme()
    save()
  }

  function setFontSize(s: FontSize) {
    fontSize.value = s
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[s]
    save()
  }

  return {
    theme,
    fontSize,
    soundEnabled,
    musicEnabled,
    musicVolume,
    soundVolume,
    vibrationEnabled,
    autoPlayVideo,
    showAnswerHint,
    dailyReminder,
    reminderTime,
    init,
    save,
    setTheme,
    setFontSize
  }
})
