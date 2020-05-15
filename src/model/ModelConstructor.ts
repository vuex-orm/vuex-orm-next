import { Model } from './Model'

export interface ModelConstructor<M extends Model> {
  new (...args: any[]): M
  newRawInstance(): M
}
