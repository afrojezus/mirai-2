import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import registerServiceWorker from './registerServiceWorker';
import Index from './pages/index';
import './index.css';

if ('scrollRestoration' in window.history)
{
  this.oldScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
}
else
{
  this.oldScrollRestoration = null;
}

const rootElement = document.querySelector('#root');
if (rootElement)
{
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Index />
      </ConnectedRouter>
    </Provider>,
    rootElement,
  );

  if (module.hot)
  {
    module.hot.accept('./pages/index', () =>
    {
      const NewLoad = require('./pages/index').default; // eslint-disable-line
      render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <NewLoad />
          </ConnectedRouter>
        </Provider>,
        rootElement,
      );
    });
  }
}
registerServiceWorker();
