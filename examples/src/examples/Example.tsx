import React from 'react';
import './Example.css';

type Props = {
  title: string,
  children: React.ReactNode | React.ReactNode[],
}

export default (props: Props) => {
  return (
    <div className="example">
      <div className="title">{props.title}</div>
      <div className="demo">{props.children}</div>
    </div>
  );
}
