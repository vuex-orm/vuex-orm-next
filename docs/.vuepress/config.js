const sidebars = {
  guide: [
    {
      title: 'Prologue',
      collapsable: false,
      children: [
        ['/guide/prologue/what-is-vuex-orm', 'What is Vuex ORM?'],
        ['/guide/prologue/sponsors', 'Sponsors'],
        ['/guide/prologue/installation', 'Installation'],
        ['/guide/prologue/getting-started', 'Getting Started']
      ]
    },
    {
      title: 'Model',
      collapsable: false,
      children: [
        ['/guide/model/getting-started', 'Getting Started'],
        ['/guide/model/accessors', 'Accessors'],
        ['/guide/model/decorators', 'Decorators']
      ]
    },
    {
      title: 'Relationships',
      collapsable: false,
      children: [
        ['/guide/relationships/getting-started', 'Getting Started'],
        ['/guide/relationships/one-to-one', 'One To One'],
        ['/guide/relationships/one-to-many', 'One To Many'],
        ['/guide/relationships/one-to-one-poly', 'One To One (Polymorphic)']
      ]
    },
    {
      title: 'Repository',
      collapsable: false,
      children: [
        ['/guide/repository/getting-started', 'Getting Started'],
        ['/guide/repository/retrieving-data', 'Retrieving Data'],
        ['/guide/repository/inserting-data', 'Inserting Data'],
        ['/guide/repository/updating-data', 'Updating Data'],
        ['/guide/repository/deleting-data', 'Deleting Data']
      ]
    },
    {
      title: 'Digging Deeper',
      collapsable: false,
      children: [
        ['/guide/digging-deeper/plugins', 'Plugins']
      ]
    }
  ]
}

module.exports = {
  title: 'Vuex ORM Next',
  description: 'The Vuex plugin to enable Object-Relational Mapping (ORM) access to the Vuex Store.',

  base: '/',

  themeConfig: {
    repo: 'vuex-orm/vuex-orm-next',
    docsDir: 'docs',
    sidebarDepth: 2,

    nav: [
      {
        text: 'Guide',
        link: '/guide/prologue/what-is-vuex-orm'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/vuex-orm/vuex-orm-next/releases'
      }
    ],

    sidebar: {
      '/guide/': sidebars.guide,
      '/': sidebars.guide
    }
  }
}
