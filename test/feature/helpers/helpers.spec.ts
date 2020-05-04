import Vue from 'vue'
import { createStore } from 'test/Helpers'
import { Model, Attr, Str, Repository, mapRepos } from '@/index'

describe('feature/helpers/helpers', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  class UserRepository extends Repository<User> {
    use = User
  }

  it('can map repositories from models in Vue components', async () => {
    const store = createStore()

    const vm = new Vue({
      store,
      computed: mapRepos({
        userRepo: User
      })
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })

  it('can map repositories from abstract repositories in Vue components', async () => {
    const store = createStore()

    const vm = new Vue({
      store,
      computed: mapRepos({
        userRepo: UserRepository
      })
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })

  it('can map repositories in Vue components using spread syntax', async () => {
    const store = createStore()

    const vm = new Vue({
      store,
      computed: {
        ...mapRepos({ userRepo: User })
      }
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })
})
