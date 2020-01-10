/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { editPanels } from 'react-components/nodes-panel/nodes-panel.actions';
import { setActiveModal } from 'react-components/tool/tool.actions';
import ToolBar from './tool-bar.component';
import { getToolBar } from './tool-bar.selectors';

const mapStateToProps = state => {
  const { left, right } = getToolBar(state);
  return {
    leftSlot: left,
    rightSlot: right
  };
};

const mapDispatchToProps = dispatch => ({
  context_onClick: () => {
    dispatch(editPanels());
    dispatch(setActiveModal('context'));
  },
  viewMode_onClick: id => dispatch(setActiveModal(id)),
  version_onClick: id => dispatch(setActiveModal(id)),
  unit_onClick: id => dispatch(setActiveModal(id)),
  indicator_onClick: id => dispatch(setActiveModal(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolBar);