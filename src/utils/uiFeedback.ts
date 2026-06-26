let buttonAudio: HTMLAudioElement | null = null
let mysteryAudio: HTMLAudioElement | null = null

function getButtonAudio() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!buttonAudio) {
    buttonAudio = new Audio(`${import.meta.env.BASE_URL}sounds/button-click.mp3`)
    buttonAudio.preload = 'auto'
    buttonAudio.volume = 0.35
  }

  return buttonAudio
}

export function playButtonClickSound() {
  const source = getButtonAudio()

  if (!source) {
    return
  }

  try {
    const sound = source.cloneNode() as HTMLAudioElement
    sound.volume = source.volume
    sound.currentTime = 0
    void sound.play()
  } catch {
    // Ignore playback failures caused by browser autoplay restrictions.
  }
}

function getMysteryAudio() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!mysteryAudio) {
    mysteryAudio = new Audio(`${import.meta.env.BASE_URL}sounds/mystery-action.mp3`)
    mysteryAudio.preload = 'auto'
    mysteryAudio.volume = 0.42
  }

  return mysteryAudio
}

export function playMysteryActionSound() {
  const source = getMysteryAudio()

  if (!source) {
    return
  }

  try {
    const sound = source.cloneNode() as HTMLAudioElement
    sound.volume = source.volume
    sound.currentTime = 0
    void sound.play()
  } catch {
    // Ignore playback failures caused by browser autoplay restrictions.
  }
}
