import React, { useState, useMemo } from 'react';
import { GitCommit, ArrowRight, TrendingDown, CheckCircle2, Filter, Layers, Users } from 'lucide-react';

/**
 * Interactive SVG Sankey Diagram for Funnel Conversion & Drop-off Paths
 * Models visitor flow stages, retention branches, and drop-off leakage paths
 * with cubic Bezier curves, flow volume stroke weights, and channel segmentation.
 */

const DEFAULT_STAGES = [
  { id: 'stg_visitors', name: '1. Landing Page Visitors', volume: 125000, color: '#3b82f6' },
  { id: 'stg_signup', name: '2. Product Sign-Ups', volume: 42500, dropOff: 82500, color: '#6366f1' },
  { id: 'stg_trial', name: '3. Active Onboarding Trial', volume: 18400, dropOff: 24100, color: '#8b5cf6' },
  { id: 'stg_checkout', name: '4. Checkout Initiated', volume: 7200, dropOff: 11200, color: '#ec4899' },
  { id: 'stg_paid', name: '5. Paid Customer Conversion', volume: 4850, dropOff: 2350, color: '#10b981' }
];

export default function SankeyFlowChart({ stages = DEFAULT_STAGES }) {
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const channelMultipliers = {
    ALL: 1.0,
    PAID_SEARCH: 0.38,
    ORGANIC_SEO: 0.28,
    EMAIL_CAMPAIGN: 0.18,
    DIRECT_REFERRAL: 0.16
  };

  const mult = channelMultipliers[selectedChannel] || 1.0;

  // Compute scaled flow stages based on channel filter
  const scaledStages = useMemo(() => {
    return stages.map(s => ({
      ...s,
      volume: Math.round(s.volume * mult),
      dropOff: s.dropOff ? Math.round(s.dropOff * mult) : 0
    }));
  }, [stages, mult]);

  const svgWidth = 840;
  const svgHeight = 360;
  const colWidth = 140;
  const colSpacing = (svgWidth - colWidth * scaledStages.length) / (scaledStages.length - 1 || 1);

  // Calculate layout coordinates for nodes
  const layout = useMemo(() => {
    const maxVol = scaledStages[0]?.volume || 100000;
    const maxNodeHeight = 160;

    const nodes = [];
    const links = [];

    scaledStages.forEach((stage, idx) => {
      const x = idx * (colWidth + colSpacing);
      const height = Math.max(28, (stage.volume / maxVol) * maxNodeHeight);
      const y = (svgHeight - 100) / 2 - height / 2 + 30;

      const nodeObj = {
        ...stage,
        index: idx,
        x,
        y,
        width: colWidth,
        height,
        conversionRatePct: idx === 0 ? 100.0 : Number(((stage.volume / scaledStages[0].volume) * 100).toFixed(2)),
        stepConversionPct: idx === 0 ? 100.0 : Number(((stage.volume / scaledStages[idx - 1].volume) * 100).toFixed(2))
      };
      nodes.push(nodeObj);

      // Connect forward link to next stage
      if (idx < scaledStages.length - 1) {
        const nextStage = scaledStages[idx + 1];
        const nextX = (idx + 1) * (colWidth + colSpacing);
        const nextHeight = Math.max(28, (nextStage.volume / maxVol) * maxNodeHeight);
        const nextY = (svgHeight - 100) / 2 - nextHeight / 2 + 30;

        // Flow link (Progression)
        links.push({
          id: `link_${stage.id}_to_${nextStage.id}`,
          type: 'PROGRESSION',
          from: stage.name,
          to: nextStage.name,
          sourceX: x + colWidth,
          sourceY: y + height / 2,
          targetX: nextX,
          targetY: nextY + nextHeight / 2,
          strokeWidth: Math.max(4, (nextStage.volume / maxVol) * 60),
          volume: nextStage.volume,
          color: nextStage.color
        });

        // Drop-off link (Branch downward into red drop)
        if (stage.dropOff > 0) {
          links.push({
            id: `drop_${stage.id}`,
            type: 'DROP_OFF',
            from: stage.name,
            to: 'Dropped Out / Churned',
            sourceX: x + colWidth * 0.8,
            sourceY: y + height,
            targetX: x + colWidth + 40,
            targetY: svgHeight - 35,
            strokeWidth: Math.max(3, (stage.dropOff / maxVol) * 45),
            volume: stage.dropOff,
            color: '#f43f5e'
          });
        }
      }
    });

    return { nodes, links };
  }, [scaledStages, colSpacing]);

  // Cubic Bezier curve generator
  const createBezierPath = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const cx1 = x1 + dx * 0.5;
    const cy1 = y1;
    const cx2 = x2 - dx * 0.5;
    const cy2 = y2;
    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Full Funnel Sankey Drop-off & Conversion Flow</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing volume paths, retention transfer efficiency, and leak points across customer journey steps.
          </p>
        </div>

        {/* Channel segmentation filter */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-slate-400">Channel:</span>
          <select
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="ALL">All Marketing Channels (100%)</option>
            <option value="PAID_SEARCH">Paid Search (Google/Bing Ads)</option>
            <option value="ORGANIC_SEO">Organic SEO Search</option>
            <option value="EMAIL_CAMPAIGN">Lifecycle Email Campaigns</option>
            <option value="DIRECT_REFERRAL">Direct & Word-of-Mouth</option>
          </select>
        </div>
      </div>

      {/* Sankey Flow SVG Visualization */}
      <div className="relative bg-slate-950 border border-slate-800/80 rounded-xl p-3 overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[760px] h-auto">
          {/* Flow Links (Bezier Curves) */}
          {layout.links.map(link => {
            const isHovered = hoveredLink?.id === link.id;
            const opacity = hoveredLink ? (isHovered ? 0.85 : 0.15) : (link.type === 'DROP_OFF' ? 0.35 : 0.45);

            return (
              <g key={link.id} onMouseEnter={() => setHoveredLink(link)} onMouseLeave={() => setHoveredLink(null)}>
                <path
                  d={createBezierPath(link.sourceX, link.sourceY, link.targetX, link.targetY)}
                  fill="none"
                  stroke={link.color}
                  strokeWidth={link.strokeWidth}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                />
              </g>
            );
          })}

          {/* Stage Nodes */}
          {layout.nodes.map(node => {
            const isSelected = hoveredNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Node Box */}
                <rect
                  width={node.width}
                  height={node.height}
                  rx="6"
                  fill="#0f172a"
                  stroke={node.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Node Header Label */}
                <text x="10" y="16" fill="#f8fafc" fontSize="10.5" fontWeight="bold">
                  {node.name.split('. ')[1] || node.name}
                </text>

                {/* Volume Badge */}
                <text x="10" y="32" fill={node.color} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {node.volume.toLocaleString()} <tspan fill="#64748b" fontSize="9">users</tspan>
                </text>

                {/* Step Conversion % */}
                {node.index > 0 && (
                  <text x="10" y="47" fill="#10b981" fontSize="9.5" fontFamily="monospace">
                    {node.stepConversionPct}% step conv.
                  </text>
                )}

                {/* Drop-off Badge */}
                {node.dropOff > 0 && (
                  <text x="10" y={node.height - 8} fill="#f43f5e" fontSize="9" fontFamily="monospace">
                    -{node.dropOff.toLocaleString()} dropped
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip / Inspection Bar */}
        <div className="mt-3 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            {hoveredLink ? (
              <>
                <span className={hoveredLink.type === 'DROP_OFF' ? 'text-rose-400' : 'text-indigo-400'}>
                  {hoveredLink.from} → {hoveredLink.to}
                </span>
                <span className="text-white font-bold">({hoveredLink.volume.toLocaleString()} users)</span>
              </>
            ) : hoveredNode ? (
              <>
                <span className="text-white font-bold">{hoveredNode.name}</span>
                <span className="text-slate-400">
                  | {hoveredNode.volume.toLocaleString()} users ({hoveredNode.conversionRatePct}% of total top-funnel)
                </span>
              </>
            ) : (
              <span className="text-slate-400">Hover over any node or flow path to inspect conversion and drop-off metrics</span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Progression Paths</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Drop-Off Leakage</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
