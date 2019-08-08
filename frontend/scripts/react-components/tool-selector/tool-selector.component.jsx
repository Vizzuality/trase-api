import React, { useState } from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';
import TopCards from 'react-components/tool-selector/top-cards';
import WorldMap from 'react-components/shared/world-map/world-map.container';

import 'react-components/tool-selector/tool-selector.scss';

function ToolSelector({ items, step, setCommodity, setCountry, commodity, country, contexts }) {
  const [context, setContext] = useState(null);
  const findContext = countryId =>
    countryId
      ? contexts.find(c => c.countryId === countryId && c.commodityId === commodity.id)
      : null;
  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center" className="tool-selector-title">
        {step + 1}. Choose one {titleParts[step]}
      </Heading>
    );
  };
  const setItemFunction = step === 0 ? setCommodity : setCountry;
  const onHover = item => (step === 0 ? () => {} : setContext(findContext(item?.id)));
  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="grid-list">
          {step < 2 &&
            items.map(item => (
              <GridListItem
                item={item}
                enableItem={i => setItemFunction(i.id)}
                onHover={onHover}
                variant="white"
              />
            ))}
        </div>
      </div>
      <div className="row columns">
        <WorldMap toolSelector highlightedContext={context} />
      </div>
      <div className="row columns">
        <TopCards
          step={step}
          setCommodity={setCommodity}
          setCountry={setCountry}
          commodityName={commodity?.name}
          countryName={country?.name}
        />
      </div>
    </div>
  );
}

ToolSelector.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  commodity: PropTypes.object,
  country: PropTypes.object,
  contexts: PropTypes.array,
  setCommodity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  step: PropTypes.number
};

export default ToolSelector;
