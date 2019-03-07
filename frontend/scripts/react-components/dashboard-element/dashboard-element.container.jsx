import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getActiveIndicatorsData,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { openIndicatorsStep as openIndicatorsStepFn } from 'react-components/dashboard-element/dashboard-element.actions';

const mapStateToProps = state => ({
  indicators: state.dashboardElement.data.indicators,
  activeIndicators: getActiveIndicatorsData(state),
  dynamicSentenceParts: getDynamicSentence(state),
  dirtyBlocks: getDirtyBlocks(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openIndicatorsStep: openIndicatorsStepFn,
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    activeIndicators: PropTypes.array,
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array,
    openIndicatorsStep: PropTypes.func.isRequired
  };

  hasVisitedBefore = {
    key: 'TRASE__HAS_VISITED_DASHBOARDS_BEFORE',
    get() {
      return !ALWAYS_DISPLAY_DASHBOARD_INFO && localStorage.getItem(this.key);
    },
    set(key) {
      return localStorage.setItem(this.key, key);
    }
  };

  state = {
    modalOpen: true,
    editMode: false,
    step: this.hasVisitedBefore.get()
      ? DashboardElement.steps.PANEL
      : DashboardElement.steps.WELCOME
  };

  componentDidMount() {
    if (!this.hasVisitedBefore.get()) {
      this.hasVisitedBefore.set(Date.now());
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  reopenPanel = (step, editMode) => this.setState({ step, editMode, modalOpen: true });

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen, editMode } = this.state;
    const {
      goToRoot,
      activeIndicators,
      dynamicSentenceParts,
      dirtyBlocks,
      openIndicatorsStep
    } = this.props;
    return (
      <DashboardElement
        step={step}
        editMode={editMode}
        goToRoot={goToRoot}
        modalOpen={modalOpen}
        dirtyBlocks={dirtyBlocks}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        reopenPanel={this.reopenPanel}
        activeIndicators={activeIndicators}
        openIndicatorsStep={openIndicatorsStep}
        dynamicSentenceParts={dynamicSentenceParts}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
