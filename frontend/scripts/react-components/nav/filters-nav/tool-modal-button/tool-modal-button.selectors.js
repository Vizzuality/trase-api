import { createSelector } from 'reselect';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { getSelectedYears, getSelectedContext } from 'reducers/app.selectors';
import { getRecolorByOptions } from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

const getModalId = (state, { modalId }) => modalId;

export const getHasMoreThanOneItem = createSelector(
  [getModalId, getRecolorByOptions, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (modalId, recolorByItems, resizeByItems) => {
    if (!modalId) return null;
    const items = {
      indicator: recolorByItems,
      unit: resizeByItems
    }[modalId];
    return items.length > 1;
  }
);