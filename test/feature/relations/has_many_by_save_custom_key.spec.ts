import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasManyBy } from '@/index'

describe('feature/relations/has_many_by_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many by" relation with custom primary key', () => {
    class Node extends Model {
      static entity = 'nodes'

      @Attr() id!: number
      @Str('') name!: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      static primaryKey = 'clusterId'

      @Attr() clusterId!: number
      @Attr() nodeIds!: number[]
      @Str('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
      nodes!: Node[]
    }

    const store = createStore()

    store.$repo(Cluster).save({
      clusterId: 1,
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' }
      ]
    })

    assertState(store, {
      nodes: {
        1: { id: 1, name: 'Node 01' },
        2: { id: 2, name: 'Node 02' }
      },
      clusters: {
        1: { clusterId: 1, nodeIds: [1, 2], name: 'Cluster 01' }
      }
    })
  })

  it('inserts "has many by" relation with custom owner key', () => {
    class Node extends Model {
      static entity = 'nodes'

      @Attr() id!: number
      @Attr() nodeId!: number
      @Str('') name!: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      @Attr() id!: number
      @Attr() nodeIds!: number[]
      @Str('') name!: string

      @HasManyBy(() => Node, 'nodeIds', 'nodeId')
      nodes!: Node[]
    }

    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
      name: 'Cluster 01',
      nodes: [
        { id: 1, nodeId: 1, name: 'Node 01' },
        { id: 2, nodeId: 2, name: 'Node 02' }
      ]
    })

    assertState(store, {
      nodes: {
        1: { id: 1, nodeId: 1, name: 'Node 01' },
        2: { id: 2, nodeId: 2, name: 'Node 02' }
      },
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' }
      }
    })
  })
})
