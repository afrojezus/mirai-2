import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import registerServiceWorker from './registerServiceWorker';
import Index from './pages/index';
import './index.css';

const rootElement = document.querySelector('#root') as HTMLElement;
if (rootElement) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Index />
      </ConnectedRouter>
    </Provider>,
    rootElement
  );
}
registerServiceWorker();
