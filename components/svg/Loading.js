import * as React from "react";

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "auto",
      background: "transparent",
      display: "block",
      shapeRendering: "auto",
    }}
    width={200}
    height={200}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path fill="#c592ff" d="M19 19h20v20H19z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M40 19h20v20H40z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.125s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M61 19h20v20H61z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.25s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M19 40h20v20H19z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.875s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M61 40h20v20H61z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.375s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M19 61h20v20H19z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.75s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M40 61h20v20H40z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.625s"
        calcMode="discrete"
      />
    </path>
    <path fill="#c592ff" d="M61 61h20v20H61z">
      <animate
        attributeName="fill"
        values="#b544b8;#c592ff;#c592ff"
        keyTimes="0;0.125;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.5s"
        calcMode="discrete"
      />
    </path>
  </svg>
);

export default SvgComponent;
