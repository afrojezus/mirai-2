import React from 'react';
import PropTypes from 'prop-types';

function pad(string)
{
  return `0${string}`.slice(-2);
}

function format(seconds)
{
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh)
  {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export default function Duration({ className, seconds })
{
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
}

Duration.propTypes = {
  className: PropTypes.string,
  seconds: PropTypes.number,
};

Duration.defaultProps = {
  className: null,
  seconds: null,
};
