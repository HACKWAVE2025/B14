// NEW FILE: src/svg-types.d.ts

// Augment the global JSX namespace to include common SVG elements and their props.
declare namespace JSX {
  interface IntrinsicElements {
    svg: React.SVGProps<SVGSVGElement>;
    path: React.SVGProps<SVGPathElement>;
    circle: React.SVGProps<SVGCircleElement>;
    rect: React.SVGProps<SVGRectElement>;
    polyline: React.SVGProps<SVGPolylineElement>;
  }
}
