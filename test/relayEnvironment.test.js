import 'whatwg-fetch';
import { fetchResponseOk, fetchResponseError } from './spyHelpers';
import { performFetch, getEnvironment } from '../src/relayEnvironment';
import {
  Environment,
  Network,
  Store,
  RecordSource
} from 'relay-runtime';
jest.mock('relay-runtime');

describe('performFetch', () => {
  let response = { data: { id: 123 } };
  const text = 'test';
  const variables = { a: 123 };

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(response));
  });

  // On test si l'on a bien les bonnes valeurs de retour a l'appel de fetch
  it('calls window fetch', () => {
    performFetch({ text }, variables);
    expect(window.fetch).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        variables
      })
    });
  });

  // On teste si l'on a bien les bonnes data en retour de la fonction
  it('returns the request data', async () => {
    const result = await performFetch({ text }, variables);
    expect(result).toEqual(response);
  });

  // On teste si l'on renvoie bien une erreur avec un code HTTP 
  it('rejects when the request fails', () => {
    window.fetch.mockReturnValue(fetchResponseError(500));
    return expect(performFetch({ text }, variables)).rejects.toEqual(
      new Error(500)
    );
  });
});

describe('getEnvironment', () => {
  const environment = { a: 123 };
  const network = { b: 234 };
  const store = { c: 345 };
  const recordSource = { d: 456 };

  beforeAll(() => {
    Environment.mockImplementation(() => environment);
    Network.create.mockReturnValue(network);
    Store.mockImplementation(() => store);
    RecordSource.mockImplementation(() => recordSource);

    getEnvironment();
  });

  // On teste si l'on retourne bien le bon environment
  it('returns environmennt', () => {
    expect(getEnvironment()).toEqual(environment);
  });

  // On teste si l'on appelle bien l'environement avec network et store
  it('calls Environment with network and store', () => {
    expect(Environment).toHaveBeenCalledWith({ network, store });
  });

  // On teste si le network et bien appeler avec performFetch
  it('calls Network.create with performFetch', () => {
    expect(Network.create).toHaveBeenCalledWith(performFetch);
  });

  // On teste si le store est bien appeler avec recordSource
  it('calls Store with RecordSource', () => {
    expect(Store).toHaveBeenCalledWith(recordSource);
  });

  // On teste si l'environement est bien créer qu'une seule fois
  it('constructs the object only once', () => {
    getEnvironment();
    expect(Environment.mock.calls.length).toEqual(1);
  });
});
