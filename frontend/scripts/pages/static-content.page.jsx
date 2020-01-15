/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import StaticContent from 'react-components/static-content/static-content.container';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer/footer.component';
import CookieBanner from 'react-components/shared/cookie-banner';
import Feedback from 'react-components/shared/feedback';

export const mount = (root, store, options) => {
  root.innerHTML = BaseMarkup();

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <StaticContent component={options.component} />
    </Provider>,
    document.getElementById('page-react-root')
  );

  render(
    <Provider store={store}>
      <Footer />
      <Feedback />
    </Provider>,
    document.getElementById('footer')
  );

  render(
    <Provider store={store}>
      <CookieBanner />
    </Provider>,
    document.getElementById('cookie-banner')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
  unmountComponentAtNode(document.getElementById('cookie-banner'));
};