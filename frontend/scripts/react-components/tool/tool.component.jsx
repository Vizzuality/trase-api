import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import EventManager from 'utils/eventManager';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import MapContainer from 'react-components/tool/map/map.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import NodesTitlesContainer from 'react-components/tool/nodes-titles/nodes-titles.container';
import MapDimensionsContainer from 'react-components/tool/legacy-map-dimensions/map-dimensions.react';
import MapContextContainer from 'react-components/tool/map-context/map-context.container';
import Sankey from 'react-components/tool/sankey';
import DataView from 'react-components/tool/data-view';
import Tooltip from 'react-components/tool/help-tooltip/help-tooltip.container';
import SplittedView from 'react-components/tool/splitted-view';
import MapLayout from 'react-components/tool/map-layout';
import ErrorModal from 'react-components/tool/error-modal';
import MapSidebar from 'react-components/tool/map-sidebar-layout';
import ToolModal from 'react-components/tool/tool-modal';
import Timeline from 'react-components/tool/timeline';
import ToolBar from 'react-components/shared/tool-bar';

import UrlSerializer from 'react-components/shared/url-serializer';

import 'styles/components/shared/veil.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

const evManager = new EventManager();

const renderVainillaComponents = () => (
  <>
    <ModalContainer />
    <MapContainer />
    {!ENABLE_REDESIGN_PAGES && <NodesTitlesContainer />}
    {!ENABLE_REDESIGN_PAGES && <MapDimensionsContainer />}
    {!ENABLE_REDESIGN_PAGES && <MapContextContainer />}
    <Tooltip />
  </>
);

function renderSankeyView() {
  return (
    <>
      <ColumnsSelectorGroupContainer />
      <Sankey />
    </>
  );
}

function renderDataView() {
  return <DataView />;
}

const Tool = props => {
  const {
    section,
    toolYearProps,
    selectYears,
    resizeSankeyTool,
    urlProps,
    urlPropHandlers,
    mapSidebarOpen,
    noLinksFound,
    activeModal
  } = props;
  useEffect(() => {
    evManager.addEventListener(window, 'resize', resizeSankeyTool);
    const body = document.querySelector('body');
    body.classList.add('-overflow-hidden');
    const originalBackground = body.style.backgroundColor;
    body.style.backgroundColor = '#f2f2f2';
    return () => {
      evManager.clearEventListeners();
      body.classList.remove('-overflow-hidden');
      body.style.backgroundColor = originalBackground;
    };
  }, [resizeSankeyTool]);

  const render = useMemo(
    () => (
      <>
        <div className="l-tool">
          <div className="js-node-tooltip c-info-tooltip" />
          <div className="-hidden-on-mobile">
            <div className="veil js-veil" />
            <div className="c-modal js-modal" />
          </div>
          <ErrorModal noLinksFound={noLinksFound} />
          {!ENABLE_REDESIGN_PAGES && <MapSidebar />}
          <div className="main-content">
            <ToolBar />
            <SplittedView
              sidebarOpen={mapSidebarOpen}
              leftSlot={<MapLayout />}
              rightSlot={section === 'data-view' ? renderDataView() : renderSankeyView()}
            />
          </div>
          <Timeline
            {...toolYearProps}
            showBackground={section === 'data-view'}
            selectYears={selectYears}
          />
        </div>
        <ToolModal activeModal={activeModal} />
      </>
    ),
    [noLinksFound, mapSidebarOpen, section, toolYearProps, selectYears, activeModal]
  );

  return (
    <div>
      {render}
      {renderVainillaComponents()}
      <UrlSerializer urlProps={urlProps} urlPropHandlers={urlPropHandlers} />
    </div>
  );
};

Tool.propTypes = {
  resizeSankeyTool: PropTypes.func.isRequired,
  selectYears: PropTypes.func.isRequired,
  urlPropHandlers: PropTypes.object,
  urlProps: PropTypes.object,
  mapSidebarOpen: PropTypes.bool,
  noLinksFound: PropTypes.bool,
  activeModal: PropTypes.string,
  section: PropTypes.string,
  toolYearProps: PropTypes.shape({
    years: PropTypes.array,
    selectedYears: PropTypes.array
  })
};

export default Tool;
