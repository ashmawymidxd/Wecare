// src/components/Dashboard/SourcesActivityChart.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import config from "../../config"
// Color mapping for different source types
const SOURCE_COLORS = {
  "Tasheel": "#94BF45",
  "Typing Center": "#E5A93D",
  "PRO": "#808080",
  "Social Media": "#5D3FD3",
  "Referral": "#46B8B0",
  "Inactive": "#FF6B6B"
};

// Logo mapping for different source types
const SOURCE_LOGOS = {
  "Tasheel": "/icons/tasheel.png",
  "Typing Center": "/icons/typing-center.png",
  "PRO": "/icons/pros.png",
  "Social Media": "/icons/social-media.png",
  "Referral": "/icons/referral.png",
  "Inactive": "/icons/inactive.png"
};

const getChartColors = (data) => {
  return data.reduce((colors, item) => {
    colors[item.id] = SOURCE_COLORS[item.id] || "#999999";
    return colors;
  }, {});
};

// Custom logo layer
const LogosLayer = ({ centerX, centerY, innerRadius, data }) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <g>
      {data.map((datum) => {
        const angle = (datum.startAngle + datum.endAngle) / 2;
        const radius = innerRadius + (datum.outerRadius - innerRadius) * 0.5;
        const x = centerX + Math.cos(angle) * radius - 15;
        const y = centerY + Math.sin(angle) * radius - 15;

        return (
          <foreignObject
            key={`logo-${datum.id}`}
            x={x}
            y={y}
            width={30}
            height={30}
            style={{ overflow: "visible" }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={SOURCE_LOGOS[datum.id] || "/icons/default.png"}
                alt={datum.id}
                className="w-5 h-5 object-contain"
              />
            </div>
          </foreignObject>
        );
      })}
    </g>
  );
};

const SourcesActivityChart = ({ className = "" }) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [screenSize, setScreenSize] = useState("");
  const [sourceData, setSourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.apiBaseUrl}api/dashboardCharts`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch source data');
        }

        const data = await response.json();
        setSourceData(data.source_counts.source_type_stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceData();
  }, []);

  const chartData = useMemo(() => {
    if (!sourceData) return [];
    return sourceData.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
      color: SOURCE_COLORS[item.id] || "#999999",
      logo: SOURCE_LOGOS[item.id] || "/icons/default.png",
    }));
  }, [sourceData]);

  const colors = useMemo(() => getChartColors(chartData), [chartData]);

  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;
    let size = "";

    if (width < 375) size = "xs";
    else if (width < 640) size = "sm";
    else if (width < 768) size = "md";
    else if (width < 1024) size = "lg";
    else size = "xl";

    setScreenSize(size);

    const container = document.querySelector(".sources-activity-chart-container");
    if (container) {
      const w = container.clientWidth;
      const aspectRatio = w < 480 ? 1 : w < 768 ? 1.2 : 1.5;
      const h = Math.max(250, Math.min(500, w / aspectRatio));
      setContainerHeight(h);
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const calculatePercentage = (value, total) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const valueFormat = (value) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return calculatePercentage(value, total);
  };

  const margin = useMemo(() => {
    if (screenSize === "xs") return { top: 10, right: 60, bottom: 40, left: 60 };
    if (screenSize === "sm") return { top: 20, right: 80, bottom: 50, left: 80 };
    return { top: 30, right: 110, bottom: 60, left: 110 };
  }, [screenSize]);

  const theme = {
    fontSize: screenSize === "xs" ? 11 : screenSize === "sm" ? 12 : 14,
    tooltip: {
      container: {
        backgroundColor: "white",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        padding: "8px 12px",
      },
    },
  };

  const innerRadius = screenSize === "xs" ? 0.55 : screenSize === "sm" ? 0.6 : 0.65;
  const activeOuterRadiusOffset = screenSize === "xs" ? 6 : 8;

  const customLayers = [
    "arcs",
    "arcLabels",
    "arcLinkLabels",
    LogosLayer,
  ];

  if (loading) {
    return (
      <div className={`flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200 ${className}`}>
        <h2 className="text-base sm:text-lg md:text-[20px] font-medium text-gray-800 mb-2 sm:mb-4">
          Sources Activity
        </h2>
        <div className="flex-1 w-full relative sources-activity-chart-container">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200 ${className}`}>
        <h2 className="text-base sm:text-lg md:text-[20px] font-medium text-gray-800 mb-2 sm:mb-4">
          Sources Activity
        </h2>
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!sourceData || sourceData.length === 0) {
    return (
      <div className={`flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200 ${className}`}>
        <h2 className="text-base sm:text-lg md:text-[20px] font-medium text-gray-800 mb-2 sm:mb-4">
          Sources Activity
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <p>No source data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200 ${className}`}
    >
      <h2 className="text-base sm:text-lg md:text-[20px] font-medium text-gray-800 mb-2 sm:mb-4">
        Sources Activity
      </h2>
      <div
        className="flex-1 w-full relative sources-activity-chart-container"
        style={{
          height: containerHeight > 0 ? `${containerHeight}px` : "100%",
          minHeight: screenSize === "xs" ? "250px" : "280px",
        }}
      >
        <ResponsivePie
          data={chartData}
          margin={margin}
          innerRadius={innerRadius}
          padAngle={0}
          cornerRadius={0}
          activeOuterRadiusOffset={activeOuterRadiusOffset}
          colors={({ id }) => colors[id] || "#999999"}
          borderWidth={0}
          valueFormat={valueFormat}
          enableArcLabels={false}
          enableArcLinkLabels={true}
          arcLinkLabel={(d) => `${d.id}\n${calculatePercentage(d.value, chartData.reduce((sum, item) => sum + item.value, 0))}`}
          arcLinkLabelsSkipAngle={screenSize === "xs" ? 12 : 10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={1.5}
          arcLinkLabelsColor={{ from: "color" }}
          arcLinkLabelsDiagonalLength={
            screenSize === "xs" ? 14 : screenSize === "sm" ? 18 : 24
          }
          arcLinkLabelsStraightLength={
            screenSize === "xs" ? 18 : screenSize === "sm" ? 24 : 30
          }
          arcLinkLabelsTextOffset={6}
          theme={theme}
          layers={customLayers}
          animate={true}
        />
      </div>
    </div>
  );
};

export default SourcesActivityChart;