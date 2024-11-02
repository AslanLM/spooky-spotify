import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '../store/playStore'
import { Slider } from './Slider'
import { Play, Pause, Volume, VolumeSilence } from './Icons'

const CurrentSong = ({ image, title, artists }) => {
  return (
    <div
      className={`
        flex items-center gap-5 relative
        overflow-hidden
      `}
    >
      <picture className="w-12 h-12 rounded-md shadow-lg overflow-hidden">
        <img src={image} alt={title} />
      </picture>

      <div className="flex flex-col">
        <h3 className="font-semibold text-sm block">{title}</h3>
        <span className="text-xs opacity-80">{artists?.join(', ')}</span>
      </div>
    </div>
  )
}

const SongControl = ({ audio }) => {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    audio.current.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audio.current.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  const handleTimeUpdate = () => {
    setCurrentTime(audio.current.currentTime)
  }

  const formatTime = time => {
    if (time == null) return `0:00`

    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60)

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const duration = audio?.current?.duration ?? 0
  return (
    <div className="flex gap-x-3 text-xs pt-2">
      <span className="opacity-50 w-12 text-right">{formatTime(currentTime)}</span>

      <Slider
        value={[currentTime]}
        max={audio?.current?.duration ?? 0}
        min={0}
        className="w-[400px]"
        onValueChange={(value) => {
          const [newCurrentTime] = value
          audio.current.currentTime = newCurrentTime
        }}
      />

      <span className='opacity-50 w-12'>{duration ? formatTime(duration) : '0:00'}</span>
    </div>
  )
}

const VolumenControl = () => {
  const volume = usePlayerStore((state) => state.volume)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const previousVolumeRef = useRef(volume)

  const isVolumeSilenced = volume < 0.1

  const handleVolumen = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current)
    } else {
      previousVolumeRef.current = volume
      setVolume(0)
    }
  }

  return (
    <div className="flex justify-center gap-x-2 text-white">
      <button
        className="opacity-70 hover:opacity-100 transition"
        onClick={handleVolumen}
      >
        {isVolumeSilenced ? <VolumeSilence /> : <Volume />}
      </button>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className="w-[95px]"
        onValueChange={(value) => {
          const [newVolume] = value
          const volumeValue = newVolume / 100
          setVolume(volumeValue)
        }}
      />
    </div>
  )
}

export const Player = () => {
  const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore(
    (state) => state,
  )
  const audioRef = useRef()

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const { song, playlist, songs } = currentMusic
    if (song) {
      const src = `/music/${playlist?.id}/0${song.id}.mp3`
      audioRef.current.src = src
      audioRef.current.volume = volume
      audioRef.current.play()
    }
  }, [currentMusic])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative flex justify-between items-center h-full w-full px-4 z-20">
      <div>
        <CurrentSong {...currentMusic.song} />
      </div>

      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center flex-col items-center">
          <button className="bg-white rounded-full p-2 mt-1 hover:scale-105 transition-all duration-200" onClick={handlePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <SongControl audio={audioRef}/>
          <audio ref={audioRef} />
        </div>
      </div>

      <div className="grid place-contentcenter">
        <VolumenControl />
      </div>
    </div>
  )
}
