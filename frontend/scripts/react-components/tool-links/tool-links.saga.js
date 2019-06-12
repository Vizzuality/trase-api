import { select, all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { SET_CONTEXT } from 'actions/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import {
  loadNodes,
  loadMapVectorData,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_BIOME_FILTER,
  COLLAPSE_NODE_SELECTION,
  EXPAND_NODE_SELECTION,
  SELECT_COLUMN,
  SELECT_YEARS
} from 'react-components/tool/tool.actions';
import {
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__GET_COLUMNS,
  setToolFlowsLoading
} from './tool-links.actions';
import {
  getToolColumnsData,
  getToolLinksData,
  getToolNodesByLink,
  getToolGeoColumnNodes,
  getMoreToolNodesByLink
} from './tool-links.fetch.saga';

function* fetchToolColumns() {
  function* performFetch() {
    const state = yield select();
    const {
      app: { selectedContext }
    } = state;
    yield put(setToolFlowsLoading(true));
    yield fork(getToolColumnsData, selectedContext);
    yield call(getToolLinksData);
    yield call(getToolNodesByLink, selectedContext);
    yield call(getToolGeoColumnNodes, selectedContext);

    // TODO: remove this call, just here to split the refactor in stages
    yield put(loadMapVectorData());
    yield put(loadNodes());

    yield fork(setLoadingSpinner, 150, setToolFlowsLoading(false));
  }
  yield takeLatest([TOOL_LINKS__GET_COLUMNS, SET_CONTEXT], performFetch);
}

function* fetchLinks() {
  function* performFetch(action) {
    const { selectedContext } = yield select(state => state.app);
    const fetchAllNodes = action.type === TOOL_LINKS__SELECT_VIEW && action.payload.detailedView;
    yield put(setToolFlowsLoading(true));
    yield call(getToolLinksData);
    yield call(getMoreToolNodesByLink, selectedContext, fetchAllNodes);
    yield put(setToolFlowsLoading(false));
  }
  yield takeLatest(
    [
      SELECT_YEARS,
      SELECT_COLUMN,
      TOOL_LINKS__SELECT_VIEW,
      SELECT_RECOLOR_BY,
      SELECT_RESIZE_BY,
      SELECT_BIOME_FILTER,
      COLLAPSE_NODE_SELECTION,
      EXPAND_NODE_SELECTION
    ],
    performFetch
  );
}

export default function* toolLinksSaga() {
  const sagas = [fetchToolColumns, fetchLinks];
  yield all(sagas.map(saga => fork(saga)));
}
