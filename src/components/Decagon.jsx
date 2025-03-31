import React, { useState, useCallback } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Decagon = () => {
  const initialPoints = [
    {x: 200, y: 20}, {x: 317.4, y: 69}, {x: 380.4, y: 180},
    {x: 380.4, y: 260}, {x: 317.4, y: 371}, {x: 200, y: 420},
    {x: 82.6, y: 371}, {x: 19.6, y: 260}, {x: 19.6, y: 180},
    {x: 82.6, y: 69}
  ];

  const [points, setPoints] = useState(initialPoints);
  const [dragIndex, setDragIndex] = useState(null);

  const minDistance = 20; // Minimum distance between points and from points to sides

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

  const handleMouseDown = useCallback((index) => {
    setDragIndex(index);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (dragIndex !== null) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      
      setPoints(prevPoints => {
        const newPoints = [...prevPoints];
        newPoints[dragIndex] = { x, y };
        
        if (isValidPolygon(newPoints, dragIndex)) {
          return newPoints;
        }
        return prevPoints;
      });
    }
  }, [dragIndex]);

  const handleMouseUp = useCallback(() => {
    setDragIndex(null);
  }, []);

  const renderDecagon = () => (
    <svg 
      viewBox="0 0 400 440" 
      width="400" 
      height="440"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
          onMouseDown={() => handleMouseDown(index)}
        />
      ))}
    </svg>
  );

  const DecagonIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <polygon
        points="20,2 31.8,6.9 38.0,18 38.0,26 31.8,37.1 20,42 8.2,37.1 2,26 2,18 8.2,6.9"
        fill="#0ea5e9"
        stroke="#0ea5e9"
        strokeWidth="1"
      />
    </svg>
  );

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto shadow-md bg-white">
        <CardHeader className="bg-sky-100 text-sky-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Interactive Decagon Explorer</CardTitle>
            <DecagonIcon />
          </div>
          <CardDescription className="text-sky-700 text-lg">Discover and Manipulate a Decagon!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-blue-50 border-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-700">What is a Decagon?</AlertTitle>
            <AlertDescription className="text-blue-600">
              A decagon is a polygon with 10 sides and 10 angles. Its name comes from the Greek words 'deka' meaning ten and 'gonia' meaning angle. Try dragging the blue dots to reshape the decagon! The shape will maintain its integrity as a polygon, and points will stay a minimum distance apart.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              {renderDecagon()}
              <Button onClick={resetDecagon} className="bg-sky-500 hover:bg-sky-600">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Decagon
              </Button>
            </div>
            <div className="flex-1 p-4 bg-amber-50 rounded">
              <p className="font-semibold text-amber-700 mb-2">Decagon Properties:</p>
              <ul className="text-amber-600 space-y-2 list-disc list-inside">
                <li>10 sides</li>
                <li>10 vertices (corners)</li>
                <li>10 interior angles</li>
                <li>Sum of interior angles: 1440°</li>
                <li>Each interior angle measures 144° (in a regular decagon)</li>
                <li>Sum of exterior angles: 360°</li>
                <li>Each exterior angle measures 36° (in a regular decagon)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Decagon;