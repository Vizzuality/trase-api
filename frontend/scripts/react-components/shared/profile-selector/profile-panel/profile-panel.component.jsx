import React from 'react';
import PropTypes from 'prop-types';
import { PROFILE_STEPS } from 'constants';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import BlockSwitch from 'react-components/shared/block-switch/block-switch.component';
import Heading from 'react-components/shared/heading';
import ProfilePanelFooter from 'react-components/shared/profile-selector/profile-panel/profile-panel-footer.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';

function ProfilePanel(props) {
  const {
    step,
    setProfilesActiveItem,
    profileType,
    blocks,
    onBack,
    onContinue,
    setProfilesPage,
    commoditiesPanel,
    data,
    loading
  } = props;
  switch (step) {
    case PROFILE_STEPS.types:
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose the profile you want to see
          </Heading>
          <div className="row align-center">
            <BlockSwitch
              blocks={blocks}
              selectBlock={item => setProfilesActiveItem(item, 'types')}
              activeBlockId={profileType}
              className="profile-panel-switch"
            />
            <ProfilePanelFooter onBack={onBack} onContinue={onContinue} />
          </div>
        </div>
      );
    case PROFILE_STEPS.commodities:
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose one commodity
          </Heading>
          <div className="row align-center">
            <CommoditiesPanel
              page={commoditiesPanel.page}
              getMoreItems={setProfilesPage}
              loadingMoreItems={commoditiesPanel.loadingItems}
              loading={loading}
              commodities={data.commodities}
              onSelectCommodity={item => setProfilesActiveItem(item, 'commodities')}
              activeCommodity={commoditiesPanel.activeItems}
            />
            <ProfilePanelFooter onBack={onBack} onContinue={onContinue} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

ProfilePanel.propTypes = {
  step: PropTypes.number,
  setProfilesActiveItem: PropTypes.func.isRequired,
  profileType: PropTypes.string,
  blocks: PropTypes.array,
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  setProfilesPage: PropTypes.func.isRequired,
  commoditiesPanel: PropTypes.object,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfilePanel;
