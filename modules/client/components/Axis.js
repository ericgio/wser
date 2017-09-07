import cx from 'classnames';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

// import './css/d3-axis.css';

class Axis extends React.Component {
  componentDidMount() {
    this._renderAxis();
  }

  componentDidUpdate() {
    this._renderAxis();
  }

  render() {
    const {children, className, transform} = this.props;
    return (
      <g
        className={cx('axis', className)}
        transform={transform}>
        {children}
      </g>
    );
  }

  _renderAxis = () => {
    const {orient, scale, ticks, tickFormat, tickSize} = this.props;

    let axis;
    switch (orient) {
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      case 'left':
        axis = d3.axisLeft(scale);
        break;
      case 'right':
        axis = d3.axisRight(scale);
        break;
      case 'top':
        axis = d3.axisTop(scale);
        break;
    }

    axis
      .ticks(ticks)
      .tickFormat(tickFormat)
      .tickSize(tickSize);

    d3.select(findDOMNode(this)).call(axis);
  };
}

Axis.propTypes = {
  orient: PropTypes.oneOf(['bottom', 'left', 'right', 'top']).isRequired,
  scale: PropTypes.func.isRequired,
  ticks: PropTypes.number,
  tickFormat: PropTypes.func,
  tickSize: PropTypes.number,
};

Axis.defaultProps = {
  tickSize: 6,
};

export default Axis;
