import { createSelector } from 'reselect';
import getChoropleth from 'reducers/helpers/getChoropleth';
import { getMapDimensionsWarnings as getMapDimensionsWarningsUtil } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import { getHighlightedNodesData } from 'react-components/tool/tool.selectors';

const getMapDimensions = state => state.toolLayers.data.mapDimensions;
const getSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;
const getSelectedYears = state => state.app.selectedYears;
const getToolNodeAttributes = state => state.toolLinks.data.nodeAttributes;

export const getChoroplethOptions = createSelector(
  [getMapDimensions, getToolNodes, getToolNodeAttributes, getToolColumns, getSelectedMapDimensions],
  (mapDimensions, nodes, attributes, columns, selectedMapDimensions) =>
    getChoropleth(selectedMapDimensions, nodes, attributes, columns, mapDimensions)
);

export const getMapDimensionsWarnings = createSelector(
  [getMapDimensions, getSelectedMapDimensions, getSelectedYears],
  (mapDimensions, selectedMapDimensions, selectedYears) => {
    if (selectedYears.length === 0) {
      return null;
    }
    return getMapDimensionsWarningsUtil(mapDimensions, selectedMapDimensions, selectedYears);
  }
);

export const getCurrentHighlightedChoroplethBucket = createSelector(
  [getHighlightedNodesData, getChoroplethOptions],
  (highlightedNodesData, choroplethOptions) => {
    const { choropleth } = choroplethOptions;
    if (
      highlightedNodesData.length === 1 &&
      highlightedNodesData[0].geoId !== null &&
      typeof choropleth !== 'undefined'
    ) {
      return choropleth[highlightedNodesData[0].geoId] || 'ch-default';
    }

    return undefined;
  }
);

export const getSelectedMapContextualLayersData = createSelector(
  [getSelectedMapContextualLayers, getMapContextualLayers],
  (selectedMapContextualLayers, mapContextualLayers) => {
    if (!selectedMapContextualLayers) {
      return [];
    }
    return selectedMapContextualLayers.map(layer => mapContextualLayers[layer]);
  }
);
