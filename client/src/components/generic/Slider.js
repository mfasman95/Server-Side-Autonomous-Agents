import React from 'react';
import RCSlider from 'rc-slider';

/**
 * @class Slider
 * @extends {React.Component}
 * 
 * @prop name - The name of this slider
 * @prop min - The minimum value of the slider
 * @prop max - The maximum value for the slider
 * @prop step - The step increment for the slider
 * @prop value - The value that's being maintained in the parent component
 * @prop updateValue - The function that's called to update the value associated with this slider
 */
class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: this.props.value,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e);
    this.setState({ currentValue: e });
  }

  render() {
    return(
      <div>
        <h4>{this.props.name}: {this.state.currentValue}</h4>
        <RCSlider
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          defaultValue={this.props.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default (Slider);
