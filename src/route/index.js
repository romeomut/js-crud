const e = require('express')
const express = require('express')
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, autor, image) {
    this.id = Math.floor(1000 + Math.random() * 1000)
    this.name = name
    this.autor = autor
    this.image = image
  }

  static create = (name, autor, image) => {
    const newTrack = new Track(name, autor, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return Track.#list.find((e) => e.id === id) || null
  }
}

// ================================================================

Track.create(
  'Інь Ян',
  'MONATIK i ROXOLANA',
  'https://picsum.photos/100/100',
)

Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez i Rauw Alejandro',
  'https://picsum.photos/100/101',
)

Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/101/100',
)

Track.create(
  'DAKITI',
  'BAD BUNNY i JHAY',
  'https://picsum.photos/99/100',
)

Track.create(
  '11 PM',
  'MALUMA',
  'https://picsum.photos/100/99',
)

Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/101/101',
)

class PlayList {
  static #list = []

  constructor(name, image) {
    ++this.count
    this.id = Math.floor(1000 + Math.random() * 1000)
    this.name = name
    this.tracks = []
    this.image = image
  }

  static create = (name) => {
    const image =
      'https://picsum.photos/345/' +
      (340 + this.#list.length) //щоб були різні картинки - так гарніше
    const newPlayList = new PlayList(name, image)
    this.#list.push(newPlayList)
    return newPlayList
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static makeMix = (playlist) => {
    const allTrack = Track.getList()
    let RandomTrack = allTrack
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...RandomTrack)
  }

  static getById = (id) => {
    return PlayList.#list.find((e) => e.id === id) || null
  }

  deleteTrackById = (trackId) => {
    this.tracks = this.tracks.filter(
      (e) => e.id !== trackId,
    )
  }

  addTrackById = (trackId) => {
    const track = Track.getById(trackId)
    if (!track) {
      return false
    } else {
      this.tracks.push(track)
      return true
    }
  }

  static findListByValue = (value) => {
    return this.#list.filter((e) =>
      e.name.toLowerCase().includes(value.toLowerCase()),
    )
  }
}

// ================================================================

router.get('/', function (req, res) {
  const list = PlayList.getList()

  res.render('spotify-library', {
    style: 'spotify-library',
    data: {
      isEmpty: !list.length,
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = PlayList.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = PlayList.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: { isMix },
  })
})

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = PlayList.create(name)

  if (isMix) {
    PlayList.makeMix(playlist)
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = PlayList.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено!',
        link: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  let i = PlayList.getList()

  const playlist = PlayList.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено!',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-listtracks', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = PlayList.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено!',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  res.render('spotify-listtracks', {
    style: 'spotify-listtracks',
    data: {
      playListId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = PlayList.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено!',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const result = playlist.addTrackById(trackId)

  if (!result) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Трек до плейлиста не додано!',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

module.exports = router
