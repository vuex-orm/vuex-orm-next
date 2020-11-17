import {
  createStore,
  fillState,
  assertInstanceOf,
  assertModel
} from 'test/Helpers'
import { Model, Attr, Str, HasManyBy } from '@/index'

describe('feature/relations/has_many_by_retrieve', () => {
  class Node extends Model {
    static entity = 'nodes'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Cluster extends Model {
    static entity = 'clusters'

    @Attr() id!: number
    @Attr() nodeIds!: number[]
    @Str('') name!: string

    @HasManyBy(() => Node, 'nodeIds')
    nodes!: Node[]
  }

  it('can eager load has many by relation', async () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Node 01' },
        2: { id: 2, name: 'Node 02' }
      },
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' }
      }
    })

    const cluster = store.$repo(Cluster).with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertInstanceOf(cluster.nodes, Node)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' }
      ]
    })
  })

  it('can eager load missing relation as empty array', async () => {
    const store = createStore()

    fillState(store, {
      nodes: {},
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' }
      }
    })

    const cluster = store.$repo(Cluster).with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: []
    })
  })
})
