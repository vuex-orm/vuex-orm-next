import { Model } from '@/index'

jest.mock('uuid', () => ({
  v1: jest.fn()
}))

beforeEach(() => {
  Model.clearBootedModels()
})
