import React from 'react'
import Frustum from './frustum';
import Rematrix from 'rematrix';

const NUM_SIDE = 45;
const RING_STROKE = 10;
const RING_RADIUS = 256 / 2;

class LightingControls extends React.Component {
  componentWillMount() {
    const ringProps = this.getRingProps(RING_RADIUS, NUM_SIDE);
    const rotCircle = null;
    const polarCircle = null;
    this.ringSides = {
      rotational: {
        outer: this.makeRing({ target: rotCircle, ringProps }),
        inner: this.makeRing({ target: rotCircle, ringProps, offset: (-RING_STROKE - 0.5), flip: true }),
      },
      polar: {
        outer: this.makeRing({ target: polarCircle, ringProps, offset: -0.5 }),
        inner: this.makeRing({ target: polarCircle, ringProps, offset: -RING_STROKE, flip: true }),
      }
    }
  }
  componentDidMount() {
    console.log(this.rotSideContainer)
  }
  getRingProps(radius, numSegments) {
    const angle = 360 / numSegments;
    let rot = -90;
    const range = (from, to) => {
      const res = [];
      for (let i = from; i < to; ++i) {
        res.push(i);
      }
      return res;
    };

    return range(0, numSegments).map((index) => {
      rot = rot + angle
      return {
        rotateY: rot,
        translateX: radius,
        translateY: 0,
        translateZ: radius + RING_STROKE,
      };
    });
  }
  makeRing({ target, ringProps, offset = 0, flip = false }) {
    return ringProps.map((segmentData) => {
      const flipRotation = flip ? 'rotateX(180deg)' : '';
      const transform = `rotateY(${segmentData.rotateY}deg) rotateZ(90deg) rotateX(90deg) translate3d(${segmentData.translateX}px, ${segmentData.translateY}px, ${segmentData.translateZ + offset}px) ${flipRotation}`;
      return <div className="side" style={{ transform }}/>
    });
  }
  render() {
    return (
      <div className="widget-wrapper">
        <div className="container">
          <div className="rot disc debug">
            <div className="pole disc debug">
              <div className="pole-side-container side-container">
                {/* <div className="cube">
                  <div className="face front"></div>
                  <div className="face back"></div>
                  <div className="face left"></div>
                  <div className="face right"></div>
                  <div className="face top"></div>
                  <div className="face bottom"></div>
                </div> */}
                <Frustum />
              </div>
            </div>
            <div className="rot-side-container side-container">
              {this.ringSides.rotational.outer}
              {this.ringSides.rotational.inner}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LightingControls;