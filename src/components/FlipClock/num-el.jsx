import React from 'react';

export default function NumEl({ type, num = 1 }) {
  const li = [];

  for (var i = 0; i < num; ++i) {
    li.push(
      <li key={i}>
        <span>
          <div className="up">
            <div className="shadow"></div>
            <div className="inn">{i}</div>
          </div>
          <div className="down">
            <div className="shadow"></div>
            <div className="inn">{i}</div>
          </div>
        </span>
      </li>
    );
  }

  return <ul className={type}>{li}</ul>;
}
