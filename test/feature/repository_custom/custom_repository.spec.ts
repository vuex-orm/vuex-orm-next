import { createStore } from 'test/Helpers'
import { Model, Attr, Str, Repository } from '@/index'

describe('feature/repository_custom/custom_repository', () => {
  it('can define a custom repository', async () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string
    }

    class UserRepository extends Repository<User> {
      use = User

      custom(): number {
        return 1
      }
    }

    const store = createStore()

    const userRepo = store.$repo(UserRepository)

    expect(userRepo.custom()).toBe(1)
  })

  it('can define an abstract custom repository', async () => {
    class ARepository extends Repository {
      custom(): number {
        return 1
      }
    }

    const store = createStore()

    const userRepo = store.$repo(ARepository)

    expect(userRepo.custom()).toBe(1)
  })

  it('throws if the user tries to access the model in abstract custom repository', async () => {
    class ARepository extends Repository {
      custom(): any {
        this.getModel()
      }
    }

    const store = createStore()

    const userRepo = store.$repo(ARepository)

    expect(() => {
      userRepo.custom()
    }).toThrow()
  })
})
