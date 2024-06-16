import React, { forwardRef, useImperativeHandle } from 'react';
import { Tldraw } from 'tldraw';

const TldrawWrapper = forwardRef((props, ref) => {
  const innerRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    getCanvasElement: () => innerRef.current,
  }));

  return (
    <div ref={innerRef} style={{ width: '100%', height: '100%' }}>
      <Tldraw {...props} />
    </div>
  );
});

export default TldrawWrapper;
