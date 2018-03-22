import React from 'react';
import './frustum.css';

const Frustum = function Frustum() {
  return (
    <div className="frustum">
      <div className="frustum__side"></div>
      <div className="frustum__side"></div>
      <div className="frustum__side"></div>
      <div className="frustum__side"></div>
      <div className="base"></div>
      <div className="frustum__top"></div>
    </div>
  )
}

export default Frustum;