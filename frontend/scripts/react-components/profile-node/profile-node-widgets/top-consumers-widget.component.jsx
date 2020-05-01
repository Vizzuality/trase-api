import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import MiniSankey from 'react-components/profiles/mini-sankey/mini-sankey.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import {
  GET_NODE_SUMMARY_URL,
  GET_PLACE_TOP_CONSUMER_ACTORS,
  GET_PLACE_TOP_CONSUMER_COUNTRIES
} from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profiles/profile-title.component';

const TranslatedMiniSankey = withTranslation(MiniSankey);

class TopConsumersWidget extends React.PureComponent {
  handleLinkClick = (linkTarget, { profileType, query }) => {
    this.props.onLinkClick(profileType, query);
  };

  render() {
    const { year, nodeId, contextId, type, onLinkClick, testId, title, commodityName } = this.props;
    const params = { node_id: nodeId, context_id: contextId, year };
    const mainQuery =
      type === 'actor' ? GET_PLACE_TOP_CONSUMER_ACTORS : GET_PLACE_TOP_CONSUMER_COUNTRIES;
    const isImportingCountries = type === 'place';
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'place' }]}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="section-placeholder" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading top consumer data for profile page', error);
            return (
              <div className="section-placeholder" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            return null;
          }

          if (
            data[mainQuery] &&
            data[mainQuery].targetNodes &&
            data[mainQuery].targetNodes.length === 0
          ) {
            return null;
          }

          const summary = data[GET_NODE_SUMMARY_URL];
          return (
            <section className="mini-sankey-container page-break-inside-avoid" data-test={testId}>
              <div className="row">
                <div className="small-12 columns">
                  <Heading
                    variant="mono"
                    weight="bold"
                    as="h3"
                    size="md"
                    data-test={`${testId}-title`}
                  >
                    <ProfileTitle
                      template={title}
                      summary={summary}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <TranslatedMiniSankey
                    year={year}
                    data={data[mainQuery]}
                    contextId={contextId}
                    testId={`${testId}-mini-sankey`}
                    onLinkClick={isImportingCountries ? null : this.handleLinkClick}
                    targetLink={isImportingCountries ? null : onLinkClick && 'profileNode'}
                    targetPayload={
                      isImportingCountries ? null : onLinkClick && { profileType: type }
                    }
                  />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TopConsumersWidget.propTypes = {
  testId: PropTypes.string,
  onLinkClick: PropTypes.func,
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  commodityName: PropTypes.string.isRequired
};

export default TopConsumersWidget;