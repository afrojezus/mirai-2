import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store, { history } from './store';

// To avoid further messes of type fuckery that TS loves, we tell it to shut the fuck up on about webpacks module in order to perform hot-reloading.
declare const module: any;
// HTMLElement the ReactDOM will load in. (memory usage at critical levels, hell yeah.)
const rootEl: HTMLElement | null = document.getElementById('root');

// Main entry point of the application
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
// Load service-worker into the browser.
registerServiceWorker();

// Hot-reload the entry point on every change (avoids massive reloads.)
if (module.hot) {
  module.hot.accept('./App', () => {
    // Some redundant shit everyone does.
    const NextApp = require('./App').default;
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <NextApp />
        </ConnectedRouter>
      </Provider>,
      rootEl
    );
  });
}
