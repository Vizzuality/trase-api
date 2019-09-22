import {
  getSelectedRecolorBy,
  getSelectedResizeBy
} from 'react-components/tool-links/tool-links.selectors';
import {
  getSankeyMaxHeight,
  getHasExpandedNodesIds,
  getIsReExpand,
  getSankeyColumns,
  getSankeyLinks,
  getGapBetweenColumns
} from 'react-components/tool/sankey/sankey.selectors';
import { connect } from 'react-redux';
import Sankey from 'react-components/tool/sankey/sankey.component';
import {
  clearSankey,
  collapseSankey,
  expandSankey,
  highlightNode,
  selectNodes
} from 'react-components/tool-links/tool-links.actions';
import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';

const mapStateToProps = state => ({
  links: getSankeyLinks(state),
  columns: getSankeyColumns(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  maxHeight: getSankeyMaxHeight(state),
  nodeHeights: state.toolLinks.data.nodeHeights,
  nodeAttributes: state.toolLinks.data.nodeAttributes,
  sankeyColumnsWidth: state.toolLinks.sankeyColumnsWidth,
  selectedResizeBy: getSelectedResizeBy(state),
  detailedView: state.toolLinks.detailedView,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: getSelectedRecolorBy(state),
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  gapBetweenColumns: getGapBetweenColumns(state),
  flowsLoading: state.toolLinks.flowsLoading,
  highlightedNodeId: state.toolLinks.highlightedNodeId,
  selectedMapDimensions: getSelectedMapDimensionsData(state)
});

const mapDispatchToProps = {
  onNodeClicked: selectNodes,
  onNodeHighlighted: highlightNode,
  onExpandClick: expandSankey,
  onCollapseClick: collapseSankey,
  onClearClick: clearSankey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sankey);
