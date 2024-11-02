import { Play, Pause } from './Icons'
import { usePlayerStore } from '../store/playStore'

export const PlayButton = ({id, size = "small"}) => {
  const { currentMusic, setCurrentMusic, isPlaying, setIsPlaying } = usePlayerStore(state => state)

  const cleanId = id.split('_')[0];
  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === cleanId

  const handlePLay = () => {

    if (isPlayingPlaylist) {
      setIsPlaying(false)
      return
    }

    fetch(`/api/get-info-playlist.json?id=${cleanId}`)
      .then(res => res.json())
      .then(data => {
        const { songs, playlist } = data

        setIsPlaying(true)
        setCurrentMusic({ songs, playlist, song: songs[0] })
      })
  }

  const iconClassName = size === 'small' ? 'w-4 h-4' : 'w-6 h-6'

  return (
    <button className='card-play-button rounded-full bg-orange-600 p-4 shadow-xl hover:scale-105 transition-all duration-200' onClick={handlePLay}> 
        {isPlayingPlaylist ? <Pause className={iconClassName} /> : <Play className={iconClassName} />}
    </button>
  )
}
