/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/static-content.scss';

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import StaticContent from 'react-components/static-content/static-content.container';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer.component';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <StrictMode>
      <Provider store={store}>
        <TopNav />
      </Provider>
    </StrictMode>,
    document.getElementById('nav')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <StaticContent />
      </Provider>
    </StrictMode>,
    document.getElementById('page-react-root')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <Footer />
      </Provider>
    </StrictMode>,
    document.getElementById('footer')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
};
