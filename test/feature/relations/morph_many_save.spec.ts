import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Num, Str, MorphMany } from '@/index'

describe('feature/relations/morph_many_save', () => {
  class Comment extends Model {
    static entity = 'comments'

    @Num(0) id!: number
    @Str('') body!: string
    @Attr(null) commentableId!: number | null
    @Attr(null) commentableType!: string | null
  }

  class Video extends Model {
    static entity = 'videos'

    @Num(0) id!: number
    @Str('') link!: string

    @MorphMany(() => Comment, 'commentableId', 'commentableType')
    comments!: Comment[]
  }

  it('saves a model to the store with "morph many" relation', () => {
    const store = createStore()

    fillState(store, {
      videos: {},
      comments: {
        1: {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Some Comment'
        }
      }
    })

    store.$repo(Video).save({
      id: 1,
      link: '/video.mp4',
      comments: [
        {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video!'
        },
        {
          id: 2,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video Again!'
        }
      ]
    })

    assertState(store, {
      videos: {
        1: { id: 1, link: '/video.mp4' }
      },
      comments: {
        1: {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video!'
        },
        2: {
          id: 2,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video Again!'
        }
      }
    })
  })

  it('generates missing relational key', async () => {
    const store = createStore()

    store.$repo(Video).save({
      id: 1,
      link: '/video.mp4',
      comments: [
        { id: 1, body: 'Cool Video!' },
        { id: 2, body: 'Cool Video Again!' }
      ]
    })

    assertState(store, {
      videos: {
        1: { id: 1, link: '/video.mp4' }
      },
      comments: {
        1: {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video!'
        },
        2: {
          id: 2,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video Again!'
        }
      }
    })
  })

  it('can insert a record with missing related data', async () => {
    const store = createStore()

    store.$repo(Video).save({
      id: 1,
      link: '/video.mp4'
    })

    assertState(store, {
      videos: {
        1: { id: 1, link: '/video.mp4' }
      },
      comments: {}
    })
  })
})
