import { createStore, assertState } from 'test/Helpers'
import { Model, Str, Num, BelongsTo, HasMany } from '@/index'

// A model with more than 2 related models related to the same model was
// causing a normalization error. It was due to the Schema class was caching
// the first created schema with its key.
//
// For example, the first relation creates a schema and say its name is
// `proposal_settings`. Now the parent of this model is `proposal_templates`,
// because it's defined first in Opportunity model.
//
// Next, if the `proposals` model also depends on `proposal_settings`, but
// because the schema for `proposal_settings` is already created by
// `proposal_templates`, it uses the same `proposal_settings` schema. Now we
// have problem because the parent model this time should be `proposals` but
// it's using the previous `proposal_templates`.
//
// We've fixed this by caching the schema with `model` AND `parent` entity
// name. So only when the model and the parent name match, we use the cache.
describe('regression/normalizing_nested_relations_multiple_same_parent_model', () => {
  class Opportunity extends Model {
    static entity = 'opportunities'

    @Num(null, { nullable: true }) id!: number | null

    @HasMany(() => ProposalTemplate, 'opportunityId')
    proposalTemplates!: ProposalTemplate[]

    @HasMany(() => Proposal, 'opportunityId')
    proposals!: Proposal[]
  }

  class ProposalTemplate extends Model {
    static entity = 'proposal_templates'

    static primaryKey = ['opportunityId', 'proposalId']

    @Num(null, { nullable: true }) opportunityId!: number | null
    @Num(null, { nullable: true }) proposalId!: number | null

    @BelongsTo(() => ProposalSetting, 'proposalId')
    proposal!: ProposalSetting
  }

  class Proposal extends Model {
    static entity = 'proposals'

    @Num(null, { nullable: true }) id!: number | null
    @Num(null, { nullable: true }) opportunityId!: number | null
    @Num(null, { nullable: true }) templateId!: number | null

    @BelongsTo(() => ProposalSetting, 'templateId')
    template!: ProposalSetting | null
  }

  class ProposalSetting extends Model {
    static entity = 'proposal_settings'

    @Num(null, { nullable: true }) id!: number | null
    @Str('') name!: string
  }

  it('should normalize nested relationships with multiple same parent model', () => {
    const store = createStore()

    const dealRepo = store.$repo(Opportunity)

    dealRepo.save({
      id: 1,
      proposalTemplates: [
        {
          opportunityId: 2,
          proposalId: 1,
          proposal: { id: 1 }
        },
        {
          opportunityId: 2,
          proposalId: 2,
          proposal: { id: 2 }
        }
      ],
      proposals: [
        {
          id: 1,
          opportunityId: 1,
          templateId: 1,
          template: { id: 1, name: 'Hello, world!' }
        }
      ]
    })

    assertState(store, {
      opportunities: {
        1: { id: 1 }
      },
      proposals: {
        1: { id: 1, opportunityId: 1, templateId: 1 }
      },
      proposal_settings: {
        1: { id: 1, name: 'Hello, world!' },
        2: { id: 2, name: '' }
      },
      proposal_templates: {
        '[1,1]': { opportunityId: 1, proposalId: 1 },
        '[1,2]': { opportunityId: 1, proposalId: 2 }
      }
    })
  })
})
