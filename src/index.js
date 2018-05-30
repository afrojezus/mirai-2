import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

import Index from './pages/index';

ReactDOM.render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.querySelector('#root')
);

if (module.hot) {
  module.hot.accept(() => {
    const NextApp = require('./pages/index').default;
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.querySelector('#root')
    );
  });
}
