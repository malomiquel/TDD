import { storeSpy, expectRedux } from 'expect-redux';
import { configureStore } from '../../src/store';
import { fetchQuery } from 'relay-runtime';
import { getEnvironment } from '../../src/relayEnvironment';
import {
  itMaintainsExistingState,
  itSetsStatus
} from '../reducerGenerators';
import {
  query,
  queryCustomer,
  reducer
} from '../../src/sagas/queryCustomer';
jest.mock('relay-runtime');

describe('reducer', () => {
  // On teste bien que le reducer à les bons state par défaut 
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      appointments: [],
      status: undefined
    });
  });

  // On teste le status d'une actions  
  describe('QUERY_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'QUERY_CUSTOMER_SUBMITTING' };
    itSetsStatus(reducer, action, 'SUBMITTING');
    itMaintainsExistingState(reducer, action);
  });

  // On teste le status d'un action
  describe('QUERY_CUSTOMER_FAILED action', () => {
    const action = { type: 'QUERY_CUSTOMER_FAILED' };
    itSetsStatus(reducer, action, 'FAILED');
    itMaintainsExistingState(reducer, action);
  });

  describe('QUERY_CUSTOMER_SUCCESSFUL action', () => {
    const customer = { id: 123 };
    const appointments = [{ starts: 123 }];
    const action = {
      type: 'QUERY_CUSTOMER_SUCCESSFUL',
      customer,
      appointments
    };
    // On teste status de l'action
    itSetsStatus(reducer, action, 'SUCCESSFUL');
    itMaintainsExistingState(reducer, action);

    // On teste si l'on reçoit bient customer et appointment lors de l'action
    it('sets received customer and appointments', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer,
        appointments
      });
    });
  });
});

describe('queryCustomer', () => {
  const appointments = [{ startsAt: '123' }];
  const customer = { id: 123, appointments };

  let store;

  beforeEach(() => {
    store = configureStore([storeSpy]);
    fetchQuery.mockReturnValue({ customer });
  });

  const dispatchRequest = () =>
    store.dispatch({ type: 'QUERY_CUSTOMER_REQUEST', id: 123 });

  // On teste l'appel de fetchQuery lors du dispatch de le requête
  it('calls fetchQuery', async () => {
    dispatchRequest();
    expect(fetchQuery).toHaveBeenCalledWith(getEnvironment(), query, {
      id: 123
    });
  });

  // On teste le status lors du submit
  it('sets status to submitting', () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'QUERY_CUSTOMER_SUBMITTING' });
  });

  // On vérifie que nous envoyons une action à notre réducteur avec les bonnes données
  it('dispatches a SUCCESSFUL action when the call succeeds', async () => {
    const appointmentsWithConvertedTimestamps = [
      { startsAt: 123 }
    ];
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'QUERY_CUSTOMER_SUCCESSFUL',
        customer,
        appointments: appointmentsWithConvertedTimestamps
      });
  });

  // On teste si le fetchQuery renvoie bien l'action erreur
  it('dispatches a FAILED action when the call throws an error', () => {
    fetchQuery.mockReturnValue(Promise.reject(new Error()));

    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'QUERY_CUSTOMER_FAILED' });
  });
});
