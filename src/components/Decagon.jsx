import React, { useState, useCallback, useRef } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Decagon = () => {
  // Calculate points for a regular decagon
  const calculateRegularDecagonPoints = () => {
    const centerX = 250; // Center of the SVG (500/2)
    const centerY = 150; // Center of the SVG (300/2)
    const radius = 120; // Distance from center to vertices
    const points = [];
    
    // Calculate 10 points evenly spaced around a circle
    for (let i = 0; i < 10; i++) {
      const angle = (i * 2 * Math.PI) / 10 - Math.PI / 2; // Start from top (-90 degrees)
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }
    
    return points;
  };

  const initialPoints = calculateRegularDecagonPoints();

  const [points, setPoints] = useState(initialPoints);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const minDistance = 20;

  const resetDecagon = () => {
    setPoints(initialPoints);
  };

  const isValidPolygon = (newPoints, currentIndex) => {
    const n = newPoints.length;
    const prev = (currentIndex - 1 + n) % n;
    const next = (currentIndex + 1) % n;
    
    // Check distance from other points
    for (let i = 0; i < n; i++) {
      if (i !== currentIndex) {
        if (distance(newPoints[currentIndex], newPoints[i]) < minDistance) {
          return false;
        }
      }
    }

    // Check distance from sides
    for (let i = 0; i < n; i++) {
      if (i !== currentIndex && i !== prev) {
        if (distanceToLine(newPoints[currentIndex], newPoints[i], newPoints[(i + 1) % n]) < minDistance) {
          return false;
        }
      }
    }

    // Check for intersections
    for (let i = 0; i < n; i++) {
      if (i !== currentIndex && i !== prev && i !== next) {
        if (doIntersect(newPoints[currentIndex], newPoints[next], newPoints[i], newPoints[(i + 1) % n])) {
          return false;
        }
      }
    }
    return true;
  };

  const distance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const distanceToLine = (p, l1, l2) => {
    const A = p.x - l1.x;
    const B = p.y - l1.y;
    const C = l2.x - l1.x;
    const D = l2.y - l1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = l1.x;
      yy = l1.y;
    }
    else if (param > 1) {
      xx = l2.x;
      yy = l2.y;
    }
    else {
      xx = l1.x + param * C;
      yy = l1.y + param * D;
    }

    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const doIntersect = (p1, q1, p2, q2) => {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;

    return false;
  };

  const orientation = (p, q, r) => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;
    return (val > 0) ? 1 : 2;
  };

  const handleMouseDown = useCallback((index, e) => {
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    const point = points[index];
    
    // Calculate the offset between the touch/mouse position and the point's position
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const offsetX = (clientX - CTM.e) / CTM.a - point.x;
    const offsetY = (clientY - CTM.f) / CTM.d - point.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDragIndex(index);
  }, [points]);

  const handleMouseMove = useCallback((e) => {
    if (dragIndex !== null) {
      const svg = svgRef.current;
      const CTM = svg.getScreenCTM();
      
      // Get touch or mouse coordinates
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (!clientX || !clientY) return;
      
      // Calculate the new point position accounting for the offset
      const x = (clientX - CTM.e) / CTM.a - dragOffset.x;
      const y = (clientY - CTM.f) / CTM.d - dragOffset.y;
      
      // Constrain points to stay within the SVG viewport (500x300)
      const constrainedX = Math.max(0, Math.min(500, x));
      const constrainedY = Math.max(0, Math.min(300, y));
      
      const newPoints = [...points];
      newPoints[dragIndex] = { x: constrainedX, y: constrainedY };
      
      if (isValidPolygon(newPoints, dragIndex)) {
        setPoints(newPoints);
      }
    }
  }, [dragIndex, dragOffset, points]);

  const handleMouseUp = useCallback(() => {
    setDragIndex(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const renderDecagon = () => (
    <div className="flex gap-4">
      <div className="border border-gray-200 rounded-lg flex-1 min-w-[300px] min-h-[200px] w-full">
        <svg 
          ref={svgRef}
          viewBox="0 0 500 300" 
          width="100%" 
          height="100%"
          className="w-full h-full select-none"
          style={{ touchAction: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#0ea5e9"
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'move' }}
              onMouseDown={(e) => handleMouseDown(index, e)}
              onTouchStart={(e) => handleMouseDown(index, e)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
  return (
    <div className={`w-[500px] h-auto mx-auto mt-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden select-none`}>
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 select-none">Drag the points to reshape the decagon:</p>
          <div className="relative">
            {renderDecagon()}
          </div>
          <button 
            onClick={resetDecagon}
            className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded select-none"
          >
            <RotateCcw className="inline-block mr-2 h-4 w-4" /> Reset Decagon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Decagon;