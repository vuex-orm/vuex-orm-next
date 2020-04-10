import { Model } from '../model/Model'
import { Query } from './Query'

export type WhereSecondaryClosure<M extends Model, K extends keyof M> = (
  value: M[K]
) => boolean

export interface Where<M extends Model, T extends keyof M> {
  field: T
  value: WhereSecondaryClosure<M, T> | M[T] | M[T][]
  boolean: 'and' | 'or'
}

export interface WhereGroup<M extends Model, T extends keyof M> {
  and?: Where<M, T>[]
  or?: Where<M, T>[]
}

export interface Order {
  field: string
  direction: OrderDirection
}

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void
