import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent, screen, render, act } from '@testing-library/react';
import Layout from '../index';
import { layoutData, fullLayoutStore } from '../Layout.fixtures';
import { initMockStore } from '../../../common/testHelpers';
import { reducers } from '../index';



import '@testing-library/jest-dom';
const mockStore = configureMockStore(reducers);
const store = mockStore({ ...initMockStore, ...fullLayoutStore });

jest.useFakeTimers();
describe('Layout', () => {
  it('Layout', async () => {
    const container = document.createElement('div');
    container.id = 'root';

    render(
      <Provider store={store}>
        <Router>
          <Layout data={layoutData} />
        </Router>
      </Provider>,
      { container: document.body.appendChild(container) }
    );
    expect(screen.getAllByText('Monitor')).toHaveLength(1);
    expect(screen.getAllByText('Hosts')).toHaveLength(1);
    await act(async () => {
      await fireEvent.mouseEnter(screen.getByText('Monitor'));  
      await jest.runAllTimers();
      await jest.runOnlyPendingTimers();
    });
    jest.runAllTimers();
    expect(screen.queryAllByText('Facts')).toHaveLength(1);
    expect(screen.queryAllByText('Config Management')).toHaveLength(1);
    expect(screen.queryAllByText('All Hosts')).toHaveLength(0);
  });
});
