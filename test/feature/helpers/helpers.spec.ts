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

  it('maps repositories to vue component from models', async () => {
    const store = createStore([User])

    const vm = new Vue({
      store,
      computed: mapRepos({
        userRepo: User
      })
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })

  it('maps repositories to vue component from repositories', async () => {
    const store = createStore([User])

    const vm = new Vue({
      store,
      computed: mapRepos({
        uRepo: User,
        userRepo: UserRepository
      })
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })
})
