/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

export default function yearThumb({ id, x }) {
  const style = x === undefined ? null : { left: `${x}px` };
  return (
    <svg className="thumb" style={style} data-thumb={id}>
      <g fill="none" fillRule="evenodd">
        <rect width="2" height="40" x="3" fill="#EA6869" rx="1" />
        <path
          fill="#EA6869"
          d="M0.5,11.9907951 C0.5,10.0595723 2.06261621,8.5 4,8.5 C5.92986242,8.5 7.5,10.0666545 7.5,11.9907951 L7.5,28.0092049 C7.5,29.9404277 5.93738379,31.5 4,31.5 C2.07013758,31.5 0.5,29.9333455 0.5,28.0092049 L0.5,11.9907951 Z"
        />
        <path
          fill="#FFFFFF"
          d="M2,28.0092049 C2,29.1017876 2.8954305,30 4,30 C5.11227036,30 6,29.1086907 6,28.0092049 L6,11.9907951 C6,10.8982124 5.1045695,10 4,10 C2.88772964,10 2,10.8913093 2,11.9907951 L2,28.0092049 Z"
        />
        <path
          fill="#EA6869"
          d="M4,17 C4.55228475,17 5,16.5522847 5,16 C5,15.4477153 4.55228475,15 4,15 C3.44771525,15 3,15.4477153 3,16 C3,16.5522847 3.44771525,17 4,17 Z M4,21 C4.55228475,21 5,20.5522847 5,20 C5,19.4477153 4.55228475,19 4,19 C3.44771525,19 3,19.4477153 3,20 C3,20.5522847 3.44771525,21 4,21 Z M4,25 C4.55228475,25 5,24.5522847 5,24 C5,23.4477153 4.55228475,23 4,23 C3.44771525,23 3,23.4477153 3,24 C3,24.5522847 3.44771525,25 4,25 Z"
        />
      </g>
    </svg>
  );
}

yearThumb.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number
};
