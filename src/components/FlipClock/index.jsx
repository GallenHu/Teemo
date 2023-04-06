// https://github.com/xiaxiangfeng/react-flip-clock

import React from 'react';
import Seconds from './seconds';
import Minutes from './minutes';
import Hours from './hours';
import './index.scss';

const now = new Date();

const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');

export default class FlipClock extends React.Component {
  $$(str) {
    return document.querySelectorAll(str);
  }

  componentDidMount() {
    this.init();
    this.flip();
  }

  flip() {
    setInterval(() => {
      this.secondsLastMove();
    }, 1000);
  }

  init() {
    const time = `${hours}${minutes}${seconds}`;
    ['.hours-pre', '.hours-last', '.minutes-pre', '.minutes-last', '.seconds-pre', '.seconds-last'].forEach(
      (className, i) => {
        this.$$(`${className} > li`)[Number(time[i])].className = 'flip-clock-active';
      }
    );
  }

  hoursPredMove = (() => {
    return this.move('.hours-pre', null, hours[0]);
  })();

  hoursLastMove = (() => {
    return this.move('.hours-last', this.hoursPredMove, hours[1]);
  })();

  minutesPredMove = (() => {
    return this.move('.minutes-pre', this.hoursLastMove, minutes[0]);
  })();

  minutesLastMove = (() => {
    return this.move('.minutes-last', this.minutesPredMove, minutes[1]);
  })();

  secondsPredMove = (() => {
    return this.move('.seconds-pre', this.minutesLastMove, seconds[0]);
  })();

  secondsLastMove = (() => {
    return this.move('.seconds-last', this.secondsPredMove, seconds[1]);
  })();

  move(className, fn, init = 0) {
    let num = Number(init);
    let ele = null;
    return () => {
      const element = ele || (ele = this.$$(`${className} > li`));

      this.clearFlipClock(className);
      element[num].className = 'flip-clock-before';

      if (num === element.length - 1) {
        element[0].className = 'flip-clock-active';
        num = 0;
        fn && fn();
        return;
      }

      element[num + 1].className = 'flip-clock-active';
      num = num + 1;
    };
  }

  clearFlipClock(str) {
    this.$$(`${str} li`).forEach(item => {
      item.className = '';
    });
  }

  render() {
    return (
      <div className="flip-clock-wrapper">
        <Hours />
        <Minutes />
        <Seconds />
      </div>
    );
  }
}
