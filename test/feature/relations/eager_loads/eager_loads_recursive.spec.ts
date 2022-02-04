import { assertModel, createStore, fillState } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo, HasOne, Num, HasMany } from '@/index'

describe('feature/relations/eager_loads_recursive', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string

    @BelongsTo(() => User, 'userId')
    user!: User
  }

  class Node extends Model {
    static entity = 'nodes'

    @Attr() id!: number
    @Str('') name!: string

    @Num(null, { nullable: true }) parentId!: number | null
    @HasMany(() => Node, 'parentId') children!: Node[]
    @BelongsTo(() => Node, 'parentId') parent!: Node
  }

  it('eager loads all relations recursively', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })

    const user = store.$repo(User).withAllRecursive().first()!

    expect(user.phone.user).toBeInstanceOf(User)
    expect(user.phone.user.phone).toBeInstanceOf(Phone)
    expect(user.phone.user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user.phone.user, {
      id: 1,
      name: 'John Doe'
    })
  })

  it('eager loads all relations with a given recursion limit', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })

    const user = store.$repo(User).withAllRecursive(1).first()!

    expect(user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user, {
      id: 1,
      name: 'John Doe'
    })
  })

  it('eager loads all parents recursively', () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Root', parentId: null },
        2: { id: 2, name: 'Root Child 1', parentId: 1 },
        3: { id: 3, name: 'Root Child 2', parentId: 1 },
        4: { id: 4, name: 'Grandchild', parentId: 3 }
      }
    })

    const user = store.$repo(Node).withRecursive('parent').find(4)!

    expect(user.parent).toBeInstanceOf(Node)
    expect(user.parent.parent).toBeInstanceOf(Node)
    assertModel(user.parent.parent, {
      id: 1,
      name: 'Root',
      parentId: null,
      parent: null,
      children: undefined
    })
  })

  it('eager loads all parents recursively with limit', () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Root', parentId: null },
        2: { id: 2, name: 'Root Child 1', parentId: 1 },
        3: { id: 3, name: 'Root Child 2', parentId: 1 },
        4: { id: 4, name: 'Grandchild', parentId: 3 },
        5: { id: 5, name: 'Great Grandchild', parentId: 4 }
      }
    })

    const user = store.$repo(Node).withRecursive('parent', 1).find(5)!

    expect(user.parent).toBeInstanceOf(Node)
    expect(user.parent.parent).toBeInstanceOf(Node)
    expect(user.parent.parent.parent).toBeUndefined()
    assertModel(user.parent.parent, {
      id: 3,
      name: 'Root Child 2',
      parentId: 1,
      parent: undefined,
      children: undefined
    })
  })

  it('eager loads all children recursively', () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Root', parentId: null },
        2: { id: 2, name: 'Root Child 1', parentId: 1 },
        3: { id: 3, name: 'Root Child 2', parentId: 1 },
        4: { id: 4, name: 'Grandchild', parentId: 3 }
      }
    })

    const user = store.$repo(Node).withRecursive('children').find(1)!

    expect(user.children).toHaveLength(2)
    expect(user.children[1].children).toHaveLength(1)
    expect(user.children[1].children[0]).toBeInstanceOf(Node)
    assertModel(user.children[1].children[0], {
      id: 4,
      name: 'Grandchild',
      parentId: 3,
      parent: undefined,
      children: []
    })
  })

  it('eager loads all children recursively with limit', () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Root', parentId: null },
        2: { id: 2, name: 'Root Child 1', parentId: 1 },
        3: { id: 3, name: 'Root Child 2', parentId: 1 },
        4: { id: 4, name: 'Grandchild', parentId: 3 },
        5: { id: 5, name: 'Great Grandchild', parentId: 4 }
      }
    })

    const user = store.$repo(Node).withRecursive('children', 1).find(1)!

    expect(user.children).toHaveLength(2)
    expect(user.children[1].children).toHaveLength(1)
    expect(user.children[1].children[0]).toBeInstanceOf(Node)
    assertModel(user.children[1].children[0], {
      id: 4,
      name: 'Grandchild',
      parentId: 3,
      parent: undefined,
      children: undefined
    })
  })
})
