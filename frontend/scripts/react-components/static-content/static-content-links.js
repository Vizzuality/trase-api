
export default {
  about: [
    {
      name: 'About Trase',
      page: 'about'
    },
    {
      name: 'Terms of Use',
      page: 'termsOfUse'
    },
    {
      name: 'Data and Methods',
      page: 'dataMethods'
    },
    {
      name: 'FAQ',
      page: 'faq'
    },
    {
      name: 'Team',
      page: {
        type: 'about',
        payload: { section: 'team' }
      }
    },
    {
      name: 'Partners',
      page: {
        type: 'about',
        payload: { section: 'partners' }
      }
    },
    {
      name: 'Funders',
      page: {
        type: 'about',
        payload: { section: 'funders' }
      }
    }
  ]
}
