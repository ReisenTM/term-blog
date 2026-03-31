import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import * as d3 from 'd3';
import { BlogPost } from '../types';

interface TagsViewProps {
  posts: BlogPost[];
  onTagClick?: (tag: string) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  count: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const TagsView: React.FC<TagsViewProps> = ({ posts, onTagClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    const tagConnections: Record<string, Set<string>> = {};

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        if (!tagConnections[tag]) tagConnections[tag] = new Set();
        
        post.tags.forEach(otherTag => {
          if (tag !== otherTag) {
            tagConnections[tag].add(otherTag);
          }
        });
      });
    });

    const nodes: Node[] = Object.entries(tagCounts).map(([id, count]) => ({ id, count }));
    const links: Link[] = [];
    const processed = new Set<string>();

    Object.entries(tagConnections).forEach(([source, targets]) => {
      targets.forEach(target => {
        const pair = [source, target].sort().join('-');
        if (!processed.has(pair)) {
          links.push({ source, target });
          processed.add(pair);
        }
      });
    });

    return { nodes, links };
  }, [posts]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<Node>().radius(d => d.count * 5 + 40));

    const link = g.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("stroke-width", 1)
      .selectAll<SVGLineElement, Link>("line")
      .data(links)
      .join("line");

    const node = g.append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => (d as Node).count * 5 + 20)
      .attr("fill", "rgba(0, 255, 157, 0.05)")
      .attr("stroke", "rgba(0, 255, 157, 0.3)")
      .attr("stroke-width", 1)
      .attr("class", "cursor-pointer hover:fill-primary-container/20 transition-colors")
      .on("click", (event, d) => {
        if (onTagClick) onTagClick((d as Node).id);
      });

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .attr("font-size", d => Math.max(10, (d as Node).count * 2 + 10))
      .attr("font-family", "monospace")
      .attr("pointer-events", "none")
      .text(d => (d as Node).id);

    simulation.on("tick", () => {
      nodes.forEach(d => {
        const r = d.count * 5 + 20;
        d.x = Math.max(r, Math.min(width - r, d.x!));
        d.y = Math.max(r, Math.min(height - r, d.y!));
      });

      link
        .attr("x1", d => ((d as Link).source as Node).x!)
        .attr("y1", d => ((d as Link).source as Node).y!)
        .attr("x2", d => ((d as Link).target as Node).x!)
        .attr("y2", d => ((d as Link).target as Node).y!);

      node
        .attr("transform", d => `translate(${(d as Node).x},${(d as Node).y})`);
    });

    // Mouse interaction for animation
    svg.on("mousemove", (event) => {
      const [mx, my] = d3.pointer(event);
      simulation.force("mouse", d3.forceRadial(1, mx, my).strength(d => {
        const dx = (d as Node).x! - mx;
        const dy = (d as Node).y! - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 100 ? -0.05 : 0;
      }));
      simulation.alphaTarget(0.05).restart();
    });

    svg.on("mouseleave", () => {
      simulation.force("mouse", null);
      simulation.alphaTarget(0);
    });

    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      <div className="terminal-output-block mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] bg-white text-black px-2 py-0.5 font-bold">标签云图</span>
          <span className="text-terminal-dim text-[10px]">NODES_ACTIVE: {nodes.length}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-white">
          标签拓扑结构 // TAG_TOPOLOGY
        </h2>
        <p className="text-terminal-dim text-sm mt-2">
          基于日志关联性的动态标签映射。节点大小代表出现频率，连线代表共现关系。
        </p>
      </div>
      
      <div className="flex-grow border border-terminal-border bg-surface-low/20 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full cursor-move" />
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 font-mono text-[9px] text-terminal-dim space-y-1 bg-terminal-bg/80 p-3 border border-terminal-border">
          <p>&gt; 交互模式: 拖拽节点以重置布局</p>
          <p>&gt; 动态响应: 鼠标悬停产生排斥场</p>
          <p>&gt; 拓扑算法: D3_FORCE_DIRECTED_V4</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TagsView;
