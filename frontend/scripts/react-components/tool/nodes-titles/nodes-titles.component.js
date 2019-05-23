import formatValue from 'utils/formatValue';
import NodeTitleTemplate from 'templates/tool/nodeTitle.ejs';
import Tooltip from 'components/shared/info-tooltip.component';
import getNodeMeta from 'reducers/helpers/getNodeMeta';

import 'scripts/react-components/tool/tool-search/node-title-group/node-title-group.scss';
import 'styles/components/tool/nodes-clear.scss';

export default class {
  constructor() {
    this.el = document.querySelector('.js-nodes-titles');
    this.container = this.el.querySelector('.js-nodes-titles-container');
    this.clear = this.el.querySelector('.js-nodes-titles-clear');
    this.tooltip = new Tooltip('.js-node-tooltip');
    this.nodeTitleLinks = [];
    this.nodeTitleCloseButtons = [];

    this._onNodeTitleClickBound = this._onNodeTitleClick.bind(this);
    this._onNodeTitleCloseClickBound = this._onNodeTitleCloseClick.bind(this);
  }

  onCreated(props) {
    this.clear.addEventListener('click', this.callbacks.onClearClick);
    this.selectNodes(props);
    this.highlightNode(props);
  }

  onRemoved() {
    this.clear.removeEventListener('click', this.callbacks.onClearClick);
    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.removeEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.removeEventListener('click', this._onNodeTitleCloseClickBound);
    });
  }

  selectNodes(data) {
    const {
      selectedNodesData,
      columns,
      selectedMapDimensions,
      recolorGroups,
      currentQuant,
      selectedYears,
      selectedContextId
    } = data;
    this._update({
      isSelect: true,
      selectedMapDimensions,
      nodesData: selectedNodesData,
      columns,
      recolorGroups,
      currentQuant,
      selectedYears,
      selectedContextId
    });
  }

  highlightNode({
    columns,
    attributes,
    selectedMapDimensions,
    highlightedNodesData,
    recolorGroups,
    coordinates,
    currentQuant,
    selectedYears,
    selectedNodesData,
    selectedContextId,
    selectedResizeBy
  }) {
    this.tooltip.hide();
    if (highlightedNodesData === undefined || !highlightedNodesData.length) {
      return;
    }
    // if we have coordinates, request came from hover on map, so we have a tooltip and don't need to show pill
    // else show pill for sankey node
    if (coordinates !== undefined) {
      this._showTooltip({
        nodesData: highlightedNodesData,
        coordinates,
        currentQuant,
        attributes,
        selectedResizeBy,
        selectedMapDimensions
      });
    } else {
      this.el.classList.remove('is-hidden');
      const hasHighlighted = highlightedNodesData.length > 0;
      this._update({
        isSelect: !hasHighlighted,
        nodesData: hasHighlighted ? highlightedNodesData : selectedNodesData,
        columns,
        recolorGroups,
        currentQuant,
        selectedYears,
        selectedContextId
      });
    }
  }

  _update({
    isSelect,
    nodesData,
    columns,
    attributes,
    selectedResizeBy,
    selectedMapDimensions,
    recolorGroups = null,
    currentQuant,
    selectedYears,
    selectedContextId
  }) {
    this.clear.classList.toggle('is-hidden', !isSelect);

    this.nodeTitleLinks = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-title.-link'),
      0
    );

    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.removeEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-close'),
      0
    );

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.removeEventListener('click', this._onNodeTitleCloseClickBound);
    });

    const templateData = {
      contextId: selectedContextId,
      year: selectedYears ? selectedYears[0] : null,
      nodes: nodesData.map(node => {
        const column = columns[node.columnId];
        let renderedQuant;
        if (node.quant !== undefined) {
          renderedQuant = {
            value: formatValue(node.quant, currentQuant.name),
            unit: currentQuant.unit,
            name: currentQuant.name
          };
        }

        let renderedMetas;
        if (selectedMapDimensions.length > 0) {
          renderedMetas = selectedMapDimensions
            .map(dimension => {
              const meta = getNodeMeta(dimension, node, attributes, selectedResizeBy);
              if (!meta) {
                return null;
              }
              return {
                name: dimension.name,
                unit: dimension.unit,
                value: formatValue(meta.value, dimension.name)
              };
            })
            .filter(Boolean);
        }

        return Object.assign({}, node, {
          hasLink:
            node.isUnknown !== true &&
            node.isDomesticConsumption !== true &&
            column.profileType !== undefined &&
            column.profileType !== null,
          selectedMetas: renderedMetas,
          renderedQuant
        });
      }),
      isSelect: isSelect || nodesData.length > 1,
      recolorGroups
    };

    this.container.innerHTML = NodeTitleTemplate(templateData);

    this.nodeTitleLinks = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-title.-link'),
      0
    );

    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.addEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-close'),
      0
    );

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.addEventListener('click', this._onNodeTitleCloseClickBound);
    });
  }

  _onNodeTitleClick(e) {
    this.callbacks.onProfileLinkClicked(
      parseInt(e.currentTarget.dataset.nodeId, 10),
      parseInt(e.currentTarget.dataset.year, 10),
      parseInt(e.currentTarget.dataset.contextId, 10)
    );
  }

  _onNodeTitleCloseClick(e) {
    e.stopPropagation();
    this.callbacks.onCloseNodeClicked(parseInt(e.currentTarget.dataset.nodeId, 10));
  }

  _showTooltip({
    nodesData,
    coordinates,
    currentQuant,
    selectedMapDimensions,
    attributes,
    selectedResizeBy
  }) {
    const node = nodesData[0];

    if (!coordinates) {
      return;
    }

    let values = [];

    if (selectedMapDimensions.length > 0) {
      values = selectedMapDimensions
        .map(dimension => {
          const meta = getNodeMeta(dimension, node, attributes, selectedResizeBy);
          if (!meta) {
            return null;
          }
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(meta.value, dimension.name)
          };
        })
        .filter(Boolean)
        .concat(values);
    }

    // if node is visible in sankey, quant is available
    if (node.quant !== undefined) {
      values.push({
        title: currentQuant.name,
        unit: currentQuant.unit,
        value: formatValue(node.quant, currentQuant.name)
      });
    }
    this.tooltip.show(coordinates.pageX, coordinates.pageY, node.name, values);
  }
}
