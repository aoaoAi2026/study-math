import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface TimerOptions {
  duration: number
  onTick?: (remaining: number) => void
  onComplete?: () => void
  autoStart?: boolean
}

export function useTimer(options: TimerOptions) {
  const duration = ref(options.duration)
  const remaining = ref(options.duration)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const isComplete = ref(false)

  let intervalId: number | null = null
  let startTime = 0
  let pausedTime = 0

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return ((duration.value - remaining.value) / duration.value) * 100
  })

  const minutes = computed(() => Math.floor(remaining.value / 60))
  const seconds = computed(() => remaining.value % 60)
  const formattedTime = computed(() => {
    const m = String(minutes.value).padStart(2, '0')
    const s = String(seconds.value).padStart(2, '0')
    return `${m}:${s}`
  })

  function start() {
    if (isRunning.value && !isPaused.value) return

    if (isPaused.value) {
      isPaused.value = false
      const pauseDuration = Date.now() - pausedTime
      startTime += pauseDuration
    } else {
      startTime = Date.now()
      remaining.value = duration.value
    }

    isRunning.value = true
    isComplete.value = false

    intervalId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      remaining.value = Math.max(0, duration.value - elapsed)

      options.onTick?.(remaining.value)

      if (remaining.value <= 0) {
        complete()
      }
    }, 1000)
  }

  function pause() {
    if (!isRunning.value || isPaused.value) return

    isPaused.value = true
    pausedTime = Date.now()
    isRunning.value = false

    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function stop() {
    isRunning.value = false
    isPaused.value = false
    remaining.value = duration.value

    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    isComplete.value = false
  }

  function complete() {
    isRunning.value = false
    isPaused.value = false
    isComplete.value = true
    remaining.value = 0

    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }

    options.onComplete?.()
  }

  function addTime(seconds: number) {
    duration.value += seconds
    remaining.value += seconds
  }

  function setDuration(newDuration: number) {
    duration.value = newDuration
    remaining.value = newDuration
  }

  if (options.autoStart) {
    start()
  }

  onUnmounted(() => {
    stop()
  })

  return {
    duration,
    remaining,
    isRunning,
    isPaused,
    isComplete,
    progress,
    minutes,
    seconds,
    formattedTime,
    start,
    pause,
    stop,
    reset,
    addTime,
    setDuration
  }
}

export function usePomodoro() {
  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60
  const LONG_BREAK_TIME = 15 * 60

  const mode = ref<'work' | 'break' | 'longBreak'>('work')
  const sessions = ref(0)
  const timer = useTimer({
    duration: WORK_TIME,
    onComplete: () => {
      sessions.value++
      if (sessions.value % 4 === 0) {
        mode.value = 'longBreak'
        timer.setDuration(LONG_BREAK_TIME)
      } else {
        mode.value = 'break'
        timer.setDuration(BREAK_TIME)
      }
      timer.start()
    }
  })

  function startWork() {
    mode.value = 'work'
    timer.setDuration(WORK_TIME)
    timer.start()
  }

  function skip() {
    timer.stop()
    if (mode.value === 'work') {
      sessions.value++
      mode.value = 'break'
      timer.setDuration(BREAK_TIME)
    } else {
      mode.value = 'work'
      timer.setDuration(WORK_TIME)
    }
    timer.start()
  }

  return {
    mode,
    sessions,
    timer,
    startWork,
    skip
  }
}
