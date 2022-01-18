import React from 'react';
import 'whatwg-fetch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import * as AppointmentsDayViewExports from '../src/AppointmentsDayView';

describe('AppointmentsDayViewLoader', () => {
  let renderAndWait, container;
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(9, 0, 0, 0) },
    { startsAt: today.setHours(10, 0, 0, 0) }
  ];
  beforeEach(() => {
    ({ renderAndWait, container } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(appointments));
    jest
      .spyOn(AppointmentsDayViewExports, 'AppointmentsDayView')
      .mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentsDayViewExports.AppointmentsDayView.mockRestore();
  });

  it('fetches appointments happening today when component is mounted', async () => {
    const from = today.setHours(0, 0, 0, 0);
    const to = today.setHours(23, 59, 59, 999);

    await renderAndWait(<AppointmentsDayViewLoader today={today} />);

    expect(window.fetch).toHaveBeenCalledWith(
      `/appointments/${from}-${to}/`,
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });
});