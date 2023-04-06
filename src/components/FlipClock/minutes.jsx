import React from 'react';
import NumEl from './num-el';

export default class Minutes extends React.Component {
  render() {
    const { showSeconds } = this.props;
    return (
      <div>
        {/* <div className="title">分钟</div> */}
        <NumEl type="minutes-pre" num="6" />
        <NumEl type="minutes-last" num="10" />
        {showSeconds && (
          <div className="semicolon">
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    );
  }
}
