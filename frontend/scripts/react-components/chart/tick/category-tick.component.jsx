import React from 'react';
import PropTypes from 'prop-types';
import wrapSVGText from 'utils/wrapSVGText';
import 'react-components/chart/tick/tick-styles.scss';

const renderText = tickValue => (
  <>
    <text className="tick-text">{wrapSVGText(tickValue, 10, 10, 15, 1)}</text>
    {tickValue.length > 15 && <title>{tickValue}</title>}
  </>
);

function CategoryTick(props) {
  const { x, y, payload, nodeIds, info, config } = props;
  const {
    dashboardMeta: { context }
  } = config;
  const node = nodeIds[payload.index];
  let lastYear;
  let url;
  if (node && node.profile && !DISABLE_PROFILES) {
    lastYear = info.years.end_year || info.years.start_year;
    url = {
      type: 'profileNode',
      payload: { profileType: node.profile },
      query: { nodeId: node.id, year: lastYear, contextId: context.id }
    };
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {url ? (
        <a href={url} className="tick-text-link">
          {renderText(payload.value)}
        </a>
      ) : (
        renderText(payload.value)
      )}
    </g>
  );
}

CategoryTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  nodeIds: PropTypes.array,
  info: PropTypes.object,
  config: PropTypes.object
};

CategoryTick.defaultProps = {
  x: 0,
  y: 0,
  payload: {}
};

export default CategoryTick;
