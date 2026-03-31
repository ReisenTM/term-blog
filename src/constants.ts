import { BlogPost } from "./types";

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "LOG_042",
    title: "绘制 RUST 生态蓝图",
    author: "OPERATOR_01",
    date: "2026.03.28",
    readTime: "12分 44秒",
    tags: ["SYSTEM", "RUST", "NEURAL"],
    excerpt: "针对 Talos-II 边缘地带局部网络网格的技术审计。主要架构采用了源自旧版 REISEN 协议的去中心化共识算法。",
    content: "针对 Talos-II 边缘地带局部网络网格的技术审计。主要架构采用了源自旧版 REISEN 协议的去中心化共识算法。观测到的行为表明，系统正在超越其原始参数，构建出模仿生物生长模式的复杂节点结构。\n\n在这次审计中，我们发现 RUST 编译器的生命周期检查机制在处理大规模并发节点同步时表现出极高的稳定性。通过引入异步流处理，我们能够实时捕获并纠正潜在的竞态条件。这不仅提高了系统的吞吐量，还为未来的神经链路扩展奠定了基础。",
    codeSnippet: `fn initialize_mesh(node_id: String) -> Result<(), Error> {
    // 检查局部信号干扰
    let entropy = EntropyScanner::new(node_id).scan()?;
    
    if entropy > 0.85 {
        return Err(Error::InterferenceDetected);
    }

    println!("系统: 正在连接至 RUST 网格...");
    Ok(())
}`,
    metrics: {
      nodes: "1.2k",
      throughput: "98.4%",
      load: 75,
      wordCount: 245,
      readingTime: "12分"
    }
  },
  {
    id: "LOG_039",
    title: "Web3 引擎中的垃圾回收优化",
    author: "OPERATOR_01",
    date: "2026.03.25",
    readTime: "08分 12秒",
    tags: ["KERNEL", "OPTIM", "WEB3"],
    excerpt: "在分布式账本技术中，内存管理是性能瓶颈的核心。我们通过引入分代回收机制，显著降低了节点同步时的停顿时间。",
    content: "在分布式账本技术中，内存管理是性能瓶颈的核心。我们通过引入分代回收机制，显著降低了节点同步时的停顿时间。该优化已在测试网段 ALPHA_01 成功部署。\n\n分代回收（Generational Collection）的核心思想是基于“大部分对象在年轻时就会死亡”的假设。通过将内存划分为新生代 and 老年代，我们可以更频繁地扫描新生代，从而减少全局停顿（Stop-the-World）的频率。在 Web3 节点的高并发环境下，这种策略被证明是极其有效的。",
    codeSnippet: `class MemoryManager {
  constructor(capacity: number) {
    this.heap = new Uint8Array(capacity);
    this.generation = 0;
  }

  collect() {
    console.log("Initiating GC cycle...");
    // Optimized sweep logic
  }
}`,
    metrics: {
      nodes: "0.8k",
      throughput: "92.1%",
      load: 45,
      wordCount: 210,
      readingTime: "8分"
    }
  },
  {
    id: "LOG_038",
    title: "资产流传输协议 V4：稳定性分析",
    author: "OPERATOR_01",
    date: "2026.03.20",
    readTime: "15分 30秒",
    tags: ["STREAMS", "PROTOCOL"],
    excerpt: "V4 协议引入了前向纠错（FEC）机制，在丢包率高达 15% 的极端环境下仍能维持稳定的数据流。",
    content: "V4 协议引入了前向纠错（FEC）机制，在丢包率高达 15% 的极端环境下仍能维持稳定的数据流。这对于深空通信节点的同步至关重要。\n\n前向纠错技术通过在数据包中添加冗余信息，允许接收端在丢失部分数据的情况下仍能恢复原始信息。在我们的测试中，V4 协议在模拟的高延迟、高丢包环境下表现出色，成功解决了之前版本在长距离传输中的抖动问题。",
    metrics: {
      nodes: "2.4k",
      throughput: "99.9%",
      load: 20,
      wordCount: 180,
      readingTime: "15分"
    }
  },
  {
    id: "LOG_037",
    title: "量子纠缠同步实验报告",
    author: "OPERATOR_01",
    date: "2026.03.20",
    readTime: "20分 00秒",
    tags: ["QUANTUM", "SYNC"],
    excerpt: "在实验室环境下成功实现了跨星系节点的量子纠缠同步，延迟降低至普朗克时间级别。",
    content: "在实验室环境下成功实现了跨星系节点的量子纠缠同步，延迟降低至普朗克时间级别。这一突破将彻底改变深空通信的现状。\n\n量子纠缠同步利用了量子力学的非定域性，使得两个相距遥远的粒子能够瞬间改变状态。通过这种方式，我们可以实现几乎零延迟的数据传输。虽然目前仍处于实验阶段，但其潜力是巨大的。",
    metrics: {
      nodes: "0.1k",
      throughput: "100%",
      load: 10,
      wordCount: 300,
      readingTime: "20分"
    }
  }
];
