import React from 'react';
import './frustum.css';

const Frustum = function Frustum() {
  const onFrustumClick = () => {
    console.log('clicked frustum')
  }
  return (
    <div className="frustum" onClick={onFrustumClick}>
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