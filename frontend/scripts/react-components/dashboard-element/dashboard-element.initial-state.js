export default {
  data: {
    countries: [],
    companies: [],
    sources: [],
    destinations: [],
    commodities: []
  },
  tabs: {},
  loading: false,
  loadingItems: false,
  editMode: false,
  activePanelId: null,
  pages: {
    countries: 1,
    sources: 1,
    destinations: 1,
    companies: 1,
    commodities: 1
  },
  searchResults: [],
  selectedNodesIds: [],
  charts: null,
  sourcesActiveTab: null,
  companiesActiveTab: null,
  selectedCountryId: null,
  selectedCommodityId: null,
  selectedYears: null,
  selectedResizeBy: null,
  selectedRecolorBy: null
};
