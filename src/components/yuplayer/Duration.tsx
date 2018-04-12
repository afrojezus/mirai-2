import * as React from 'react';

function pad(p: string | number) {
  return `0${p}`.slice(-2);
}

function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

interface DurationProps {
  className: string;
  seconds: number;
}

export default function Duration({
  className = undefined,
  seconds = 0,
}: DurationProps) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
}
