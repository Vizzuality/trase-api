import { GET_NODES_WITH_SEARCH_URL, getURLFromParams } from 'utils/getURLFromParams';
import { DEFAULT_PROFILE_PAGE_YEAR, DEFAULT_PROFILE_PAGE_CONTEXT_ID } from 'constants';
import isEmpty from 'lodash/isEmpty';

export const SET_PROFILE_SEARCH_TERM = 'SET_PROFILE_SEARCH_TERM';
export const LOAD_PROFILE_SEARCH_RESULTS = 'LOAD_PROFILE_SEARCH_RESULTS';
export const SET_PROFILE_ROOT_ERROR_MESSAGE = 'SET_PROFILE_ROOT_ERROR_MESSAGE';

export const goToNodeProfilePage = node => dispatch =>
  dispatch({
    type: 'profileNode',
    payload: {
      query: {
        nodeId: node.id,
        contextId: node.contextId,
        year: DEFAULT_PROFILE_PAGE_YEAR
      },
      profileType: node.profile
    }
  });

export function resetProfileSearchResults() {
  return {
    type: SET_PROFILE_SEARCH_TERM,
    payload: { term: '', results: [] }
  };
}

export const searchNodeWithTerm = searchTerm => dispatch => {
  const nodeResultsURL = getURLFromParams(GET_NODES_WITH_SEARCH_URL, {
    query: searchTerm,
    context_id: DEFAULT_PROFILE_PAGE_CONTEXT_ID,
    profile_only: true
  });

  if (isEmpty(searchTerm)) {
    dispatch(resetProfileSearchResults());
    return;
  }

  dispatch({
    type: SET_PROFILE_SEARCH_TERM,
    payload: { term: searchTerm, isLoading: true }
  });

  fetch(nodeResultsURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(new Error(response.statusText));
    })
    .then(results => {
      if (!results) return;

      dispatch({
        type: LOAD_PROFILE_SEARCH_RESULTS,
        payload: results.data
      });
    })
    .catch(reason => {
      console.error('Error loading profile search nodes', reason);
      dispatch({
        type: SET_PROFILE_ROOT_ERROR_MESSAGE,
        payload: { errorMessage: reason.message }
      });
    });
};
