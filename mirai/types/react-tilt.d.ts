import React from 'react';
export default class Tilt {
  context: any;
  props: React.Props<React.HTMLAttributes<HTMLDivElement>>;
  state: any;
  refs: any;
  constructor(props: any);
  componentDidMount(): void;
  componentWillUnmount(): void;
  forceUpdate(callback: any): void;
  getValues(e: any): any;
  onMouseEnter(...args: any[]): any;
  onMouseLeave(...args: any[]): any;
  onMouseMove(...args: any[]): any;
  render(): any;
  reset(): void;
  setState(partialState: any, callback: any): void;
  setTransition(): void;
  update(e: any): void;
  updateElementPosition(): void;
}
