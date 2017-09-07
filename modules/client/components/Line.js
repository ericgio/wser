import cx from 'classnames';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React from 'react';

class Line extends React.Component {
  render() {
    const {className, curve, data, x, y, ...props} = this.props;

    const line = d3.line()
      .curve(curve)
      .x(x)
      .y(y);

    return (
      <path
        {...props}
        className={cx('line', className)}
        d={line(data)}
      />
    );
  }
}

Line.propTypes = {
  curve: PropTypes.oneOf([
    d3.curveLinear,
    d3.curveStepBefore,
    d3.curveStepAfter,
    d3.curveBasis,
    d3.curveBasisOpen,
    d3.curveBasisClosed,
    d3.curveBundle,
    d3.curveCardinal,
    d3.curveCardinalOpen,
    d3.curveCardinalClosed,
    d3.curveNatural,
  ]),
  data: PropTypes.array.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
};

Line.defaultProps = {
  curve: d3.curveLinear,
};

export default Line;
