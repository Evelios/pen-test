import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import array from 'new-array';
import stroke from 'penplot-stroke';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

export default function createPlot (context, dimensions) {
  // Dimensions
  const [ width, height ] = dimensions;
  const margin_percent    = 0.2;
  // Line Properties
  const min_width         = 0.01;
  const max_width         = 0.07;
  const width_step        = 0.01;
  const line_width        = max_width * 8;

  const test_sites = linspace(min_width, max_width, width_step);
  const spacing = (width - (width * 2*margin_percent)) / (test_sites.length - 1);

  const lines = test_sites.map((stroke_width, i) => {
    console.log(stroke_width);
    console.log(line_width);
    const x  = width * margin_percent + i * spacing;
    const y1 = height - (height * margin_percent);
    const y2 = height * margin_percent
    return stroke([ [x, y1], [x, y2] ], line_width, stroke_width);
  }).flat(1);

  return {
    draw,
    print,
    background: 'white',
    animate: false,
    clear: true
  };

  // ---- Main Functions -------------------------------------------------------

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      context.lineWidth = min_width;
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions,
      lineWidth : min_width
    });
  }

  // ---- Helper Functions ------------------------------------------------------

  function linspace(start, stop, spacing) {
    const n = Math.round((stop - start) / spacing);
    return array(n).map((_, i) => start + i*spacing );
  }
}
