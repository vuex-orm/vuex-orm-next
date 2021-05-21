import './polyfills/Polyfills'

import { install } from './store/Store'
import { use } from './plugin/Plugin'
import { mapRepos } from './helpers/Helpers'
import { Database } from './database/Database'
import { Schema } from './schema/Schema'
import { Model } from './model/Model'
import { Attr } from './model/decorators/attributes/types/Attr'
import { Str } from './model/decorators/attributes/types/Str'
import { Num } from './model/decorators/attributes/types/Num'
import { Bool } from './model/decorators/attributes/types/Bool'
import { Uid } from './model/decorators/attributes/types/Uid'
import { HasOne } from './model/decorators/attributes/relations/HasOne'
import { BelongsTo } from './model/decorators/attributes/relations/BelongsTo'
import { HasMany } from './model/decorators/attributes/relations/HasMany'
import { HasManyBy } from './model/decorators/attributes/relations/HasManyBy'
import { Attribute } from './model/attributes/Attribute'
import { Type } from './model/attributes/types/Type'
import { Attr as AttrAttr } from './model/attributes/types/Attr'
import { String as StringAttr } from './model/attributes/types/String'
import { Number as NumberAttr } from './model/attributes/types/Number'
import { Boolean as BooleanAttr } from './model/attributes/types/Boolean'
import { Uid as UidAttr } from './model/attributes/types/Uid'
import { Relation } from './model/attributes/relations/Relation'
import { HasOne as HasOneAttr } from './model/attributes/relations/HasOne'
import { HasMany as HasManyAttr } from './model/attributes/relations/HasMany'
import { HasManyBy as HasManyByAttr } from './model/attributes/relations/HasManyBy'
import { Repository } from './repository/Repository'
import { Interpreter } from './interpreter/Interpreter'
import { Query } from './query/Query'
import { Connection } from './connection/Connection'

export default {
  install,
  use,
  mapRepos,
  Database,
  Schema,
  Model,
  Attr,
  Str,
  Num,
  Bool,
  Uid,
  HasOne,
  BelongsTo,
  HasMany,
  HasManyBy,
  Attribute,
  Type,
  AttrAttr,
  StringAttr,
  NumberAttr,
  BooleanAttr,
  UidAttr,
  Relation,
  HasOneAttr,
  HasManyAttr,
  HasManyByAttr,
  Repository,
  Interpreter,
  Query,
  Connection
}
