// we extract it into a new file to avoid cycles

export default {
  data: {
    columns: null,
    nodes: null,
    links: null,
    nodeHeights: null,
    nodeAttributes: null,
    nodesByColumnGeoId: null
  },
  currentQuant: null,
  detailedView: false,
  forcedOverview: false,
  highlightedNodeId: null,
  flowsLoading: false,
  selectedColumnsIds: null,
  expandedNodesIds: [],
  selectedNodesIds: [],
  selectedRecolorByName: null,
  selectedResizeByName: null,
  selectedBiomeFilterName: null,
  isSearchOpen: false,
  noLinksFound: false
};
