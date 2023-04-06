import React from 'react';
import NumEl from './num-el';

export default class Hours extends React.Component {
  render() {
    const { showSeconds } = this.props;
    return (
      <div>
        {/* <div className="title">小时</div> */}
        <NumEl type="hours-pre" num="3" />
        <NumEl type="hours-last" num="10" />
        <div className={['semicolon', !showSeconds && 'blink'].join(' ')}>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
}
