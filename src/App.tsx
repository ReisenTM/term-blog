import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Settings, 
  Shield, 
  Cpu, 
  Activity, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  Maximize2, 
  Minimize2,
  Database,
  Globe,
  Clock,
  User,
  ExternalLink,
  Sun,
  Moon,
  Share2,
  Bookmark,
  MessageSquare,
  Command,
  ArrowUpRight,
  Mail,
  Github,
  MessageCircle
} from 'lucide-react';
import { BlogPost, ViewState } from './types';
import { MOCK_POSTS } from './constants';
import TagsView from './components/TagsView';

// --- Components ---

const LoadingScreen: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 bg-terminal-bg z-[200] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-transparent via-primary-container/5 to-transparent opacity-10 animate-scanline"></div>
      </div>

      {/* BACKGROUND GRID & TEXTURES */}
      <div className="fixed inset-0 grid-bg z-0"></div>
      
      {/* CORNER BRACKETS */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary-container/30"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary-container/30"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary-container/30"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary-container/30"></div>

      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 font-mono text-[10px] space-y-1">
          <p>&gt; INITIALIZING_STREAMS...</p>
          <p>&gt; LOADING_CRYPTO_CORE [OK]</p>
          <p>&gt; BUFFER_ALLOCATION: 0x88FF00A2</p>
          <p>&gt; SYNCING_NODES_VALENCIA_STATION</p>
          <p>&gt; UPTIME: 00:00:01:14</p>
          <p>&gt; PACKET_LOSS: 0.00%</p>
          <p>&gt; ENCRYPTING_SESSION_KEYS...</p>
        </div>
        <div className="absolute bottom-20 right-20 font-mono text-[10px] space-y-1 text-right">
          <p>REF_NO: K-ARCH-009212</p>
          <p>LOCATION: ORBITAL_PLATE_04</p>
          <p>TEMP: 14°C // STATUS: STABLE</p>
          <p>THROUGHPUT: 12.4 GB/S</p>
          <p>USER: OPERATOR_0x88FF</p>
        </div>
      </div>

      {/* MAIN INTERFACE */}
      <main className="relative z-20 flex flex-col items-center justify-center h-full w-full p-6">
        {/* HEADER IDENTIFIER */}
        <div className="absolute top-12 flex items-center gap-4 w-full px-12 justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 font-mono text-[10px] font-bold">LIVE_FEED</span>
            <span className="font-headline font-bold text-xl tracking-[0.2em] text-terminal-text uppercase">REISEN'S BLOG</span>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="font-mono text-[10px] text-terminal-dim uppercase tracking-widest">SYSTEM_VERSION_4.2.0</span>
            <span className="font-mono text-[10px] text-primary-container tracking-widest">ENCRYPTED_LINE_ACTIVE</span>
          </div>
        </div>

        {/* CENTRAL CONTENT */}
        <div className="flex flex-col items-center max-w-2xl w-full">
          {/* PERCENTAGE READOUT */}
          <div className="mb-2 flex flex-col items-center">
            <motion.span 
              key={Math.floor(progress)}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-headline text-[120px] md:text-[180px] font-bold text-primary-container leading-none tracking-tighter terminal-glow"
            >
              {progress.toFixed(1)}<span className="text-4xl md:text-6xl font-normal ml-2 opacity-80">%</span>
            </motion.span>
            <div className="flex gap-1 -mt-4">
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
              <span className="w-1.5 h-1.5 bg-primary-container opacity-50"></span>
            </div>
          </div>

          {/* TERMINAL MESSAGE */}
          <div className="w-full bg-surface-low border-l-2 border-primary-container p-6 mb-10 shadow-[0_0_20px_rgba(247,230,0,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1">
              <div className="w-1 h-1 bg-primary-container/30"></div>
            </div>
            <p className="font-mono text-base md:text-xl text-terminal-text tracking-wide leading-relaxed">
              &gt;&gt; System loading. Data is being prepared. Welcome to <span className="text-primary-container font-bold underline underline-offset-4 decoration-primary-container/50">Reisen</span>'s Blog.<span className="cursor-blink"></span>
            </p>
          </div>

          {/* LOADING BAR */}
          <div className="w-full max-w-lg space-y-3">
            <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-widest text-terminal-dim">
              <span>PROGRESS_STATUS</span>
              <span className="text-primary-container">BLOCK_{Math.floor(progress * 8.84)}_SYNCED</span>
            </div>
            <div className="h-4 w-full bg-surface-high relative overflow-hidden flex gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-grow h-full transition-colors duration-300 ${i < (progress / 5) ? 'bg-primary-container' : 'bg-terminal-text/5'}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between font-mono text-[9px] text-terminal-dim/40">
              <span>00.00%</span>
              <span>100.00%</span>
            </div>
          </div>
        </div>

        {/* FOOTER STATUS BARS */}
        <div className="absolute bottom-12 w-full px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center font-mono text-[10px] text-terminal-dim">
              <span>CORE_TEMP</span>
              <span>42°C</span>
            </div>
            <div className="h-[2px] w-full bg-surface-high">
              <div className="h-full bg-terminal-text w-[42%]"></div>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            <div className="flex justify-between items-center font-mono text-[10px] text-terminal-dim">
              <span>BANDWIDTH</span>
              <span>890_MBPS</span>
            </div>
            <div className="h-[2px] w-full bg-surface-high">
              <div className="h-full bg-terminal-text w-[85%]"></div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center font-mono text-[10px] text-terminal-dim">
              <span>MEMORY_USAGE</span>
              <span>12.4GB</span>
            </div>
            <div className="h-[2px] w-full bg-surface-high">
              <div className="h-full bg-primary-container w-[62%]"></div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 border-b border-terminal-border bg-terminal-bg/80 backdrop-blur-sm sticky top-0 z-50">
    <div className="flex items-center gap-6">
      <div className="flex flex-col">
        <span className="font-headline font-bold text-lg tracking-widest text-terminal-text">REISEN // BLOG</span>
        <span className="text-[8px] text-primary-container font-mono tracking-[0.3em] uppercase">Logistics_Network_OS</span>
      </div>
      <div className="hidden lg:flex gap-8 text-[10px] text-terminal-dim uppercase tracking-widest border-l border-terminal-border pl-8">
        <div className="flex flex-col">
          <span className="opacity-50">系统状态</span>
          <span className="text-terminal-text">OPTIMAL // 最佳</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-50">运行时间</span>
          <span className="text-terminal-text">452:12:08</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-50">定位节点</span>
          <span className="text-terminal-text">TALOS-II // 04</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-[10px] text-terminal-dim uppercase">Operator_ID</span>
        <span className="text-[10px] text-terminal-text font-bold">0x88FF_ADMIN</span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full border border-terminal-dim"></div>
        <div className="w-2 h-2 rounded-full border border-terminal-dim"></div>
        <div className="w-2 h-2 rounded-full bg-terminal-text"></div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ 
  view, 
  setView, 
  isDark, 
  toggleTheme 
}: { 
  view: ViewState; 
  setView: (v: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
}) => (
  <aside className="w-16 md:w-20 border-r border-terminal-border flex flex-col items-center py-8 gap-8 bg-surface-low/50">
    <div className="w-10 h-10 bg-primary-container flex items-center justify-center text-on-primary-container cursor-pointer" onClick={() => setView('list')}>
      <Terminal className="w-5 h-5" />
    </div>
    <nav className="flex flex-col gap-6">
      {[
        { icon: Globe, label: '网格', target: 'list' as ViewState },
        { icon: Database, label: '存档', target: 'archive' as ViewState },
        { icon: Command, label: '标签', target: 'tags' as ViewState },
      ].map((item, i) => (
        <button 
          key={i} 
          onClick={() => setView(item.target)}
          className="group relative flex flex-col items-center gap-1 cursor-pointer"
        >
          <item.icon className={`w-5 h-5 transition-colors ${view === item.target ? 'text-primary-container' : 'text-terminal-dim group-hover:text-terminal-text'}`} />
          <span className={`text-[8px] uppercase tracking-tighter transition-opacity ${view === item.target ? 'opacity-100 text-primary-container' : 'opacity-0 group-hover:opacity-100 text-terminal-dim'}`}>{item.label}</span>
          {view === item.target && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-container"></div>}
        </button>
      ))}
    </nav>
    <div className="mt-auto flex flex-col gap-4">
      <button 
        onClick={() => setView('profile')}
        title="个人主页"
        className={`transition-colors cursor-pointer flex flex-col items-center gap-1 ${view === 'profile' ? 'text-primary-container' : 'text-terminal-dim hover:text-terminal-text'}`}
      >
        <User className="w-5 h-5" />
        <span className={`text-[8px] uppercase tracking-tighter transition-opacity ${view === 'profile' ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>HOME</span>
      </button>
      <button 
        onClick={toggleTheme}
        title={isDark ? "切换至浅色模式" : "切换至深色模式"}
        className="text-terminal-dim hover:text-terminal-text transition-colors cursor-pointer flex flex-col items-center gap-1"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        <span className="text-[8px] uppercase tracking-tighter opacity-0 hover:opacity-100">THEME</span>
      </button>
    </div>
  </aside>
);

const ArchiveView: React.FC<{ posts: BlogPost[], onSelect: (p: BlogPost) => void }> = ({ posts, onSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-12"
  >
    <div className="terminal-output-block">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] bg-terminal-text text-terminal-bg px-2 py-0.5 font-bold">系统归档</span>
        <span className="text-terminal-dim text-[10px]">TOTAL_ENTRIES: {posts.length}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter text-terminal-text flex items-baseline gap-4">
        数据归档中心 // ARCHIVE_CENTER
        <span className="text-primary-container text-lg md:text-2xl font-mono opacity-80">[{posts.length}]</span>
      </h2>
      <p className="text-terminal-dim text-sm mt-2">
        所有已编目的系统日志和架构文档。按时间戳降序排列。
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {posts.map((post, idx) => (
        <div 
          key={post.id}
          onClick={() => onSelect(post)}
          className="group flex flex-col md:flex-row md:items-center justify-between p-6 border border-terminal-border hover:border-primary-container bg-surface-low/30 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-terminal-dim font-mono">{post.date}</span>
              <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest">[{post.id}]</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-terminal-text group-hover:text-primary-container transition-colors">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] text-terminal-dim uppercase">字数</span>
              <span className="text-xs font-bold text-terminal-text">{post.metrics.wordCount}</span>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] text-terminal-dim uppercase">阅读时间</span>
              <span className="text-xs font-bold text-terminal-text">{post.metrics.readingTime}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-terminal-dim group-hover:text-primary-container transition-colors" />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SystemPanel = () => {
  const tagCounts = MOCK_POSTS.reduce((acc: Record<string, number>, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Calculate last 30 days activity
  const activityData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}.${month}.${day}`;
      const count = MOCK_POSTS.filter(p => p.date === dateStr).length;
      data.push({ date: dateStr, count });
    }
    return data;
  }, []);

  return (
    <aside className="hidden xl:flex w-80 border-l border-terminal-border flex-col p-6 gap-8 bg-surface-low/30 overflow-y-auto terminal-scroll">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Tag Statistics // 标签统计</h3>
          <span className="w-2 h-2 bg-primary-container animate-pulse rounded-full"></span>
        </div>
        <div className="space-y-3">
          {sortedTags.map(([tag, count], i) => {
            const percentage = Math.round((count / MOCK_POSTS.length) * 100);
            return (
              <div key={tag} className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-terminal-dim">
                  <span>{tag}</span>
                  <span>{count} LOGS</span>
                </div>
                <div className="h-1 w-full bg-surface-high">
                  <div 
                    className={`h-full ${i === 0 ? 'bg-primary-container' : 'bg-terminal-text'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-terminal-dim">近期发布 // RECENT_POSTS</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {activityData.map((day, i) => {
            let bgColor = 'bg-surface-high/10';
            let borderColor = 'border-terminal-border/20';
            let dotColor = 'bg-terminal-dim/20';

            if (day.count > 0) {
              // Color depth based on count
              if (day.count >= 2) {
                bgColor = 'bg-primary-container/40';
                borderColor = 'border-primary-container/60';
                dotColor = 'bg-primary-container shadow-[0_0_5px_rgba(247,230,0,0.8)]';
              } else {
                bgColor = 'bg-primary-container/20';
                borderColor = 'border-primary-container/40';
                dotColor = 'bg-primary-container/80';
              }
            }

            return (
              <div 
                key={i} 
                title={`${day.date}: ${day.count} 篇文章`}
                className={`aspect-square border ${borderColor} flex items-center justify-center ${bgColor} transition-all duration-300 hover:border-primary-container group cursor-help`}
              >
                <div className={`w-1 h-1 ${dotColor} transition-transform group-hover:scale-150`}></div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-terminal-dim uppercase tracking-tighter font-mono">
          <span>{activityData[0].date}</span>
          <span>{activityData[29].date}</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-terminal-dim">Command History</h3>
        <div className="font-mono text-[9px] space-y-2 text-terminal-dim">
          <p className="text-terminal-text">&gt; GET_ARCHIVE --LATEST</p>
          <p>&gt; SYNCING_REMOTE_NODES [OK]</p>
          <p>&gt; DECRYPTING_V4_PROTOCOL...</p>
          <p className="text-primary-container">&gt; ACCESS_GRANTED_LEVEL_A</p>
          <p>&gt; FETCHING_METRICS_STATION_04</p>
        </div>
      </section>
    </aside>
  );
};

const Footer = ({ setView }: { setView: (v: ViewState) => void }) => (
  <footer className="p-4 border-t border-terminal-border text-[9px] text-terminal-dim flex flex-col md:flex-row justify-between items-center gap-2 bg-terminal-bg relative z-10">
    <div className="flex gap-6 uppercase tracking-widest">
      <span>REISEN // SYS_01</span>
      <span>用户: Operator_01</span>
      <span>权限: 甲级</span>
    </div>
    <div className="flex gap-8 uppercase tracking-widest">
      <button onClick={() => setView('archive')} className="hover:text-terminal-text transition-colors cursor-pointer">存档</button>
      <button onClick={() => setView('list')} className="hover:text-terminal-text transition-colors cursor-pointer">状态</button>
      <button onClick={() => setView('list')} className="hover:text-terminal-text transition-colors cursor-pointer">节点</button>
      <span>© 2026 REISEN_LOGISTICS</span>
    </div>
  </footer>
);

const DataStreamBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {/* Moving Grid */}
      <div className="absolute inset-0 grid-bg animate-grid-move"></div>
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%",
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 20
            }}
            className="absolute w-[1px] h-12 bg-gradient-to-t from-transparent via-primary-container to-transparent"
          />
        ))}
      </div>

      {/* Scanning Crosshair Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Horizontal Scanning Line */}
        <motion.div 
          animate={{ y: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-primary-container/30 shadow-[0_0_15px_rgba(247,230,0,0.4)] z-10"
        />
        {/* Vertical Scanning Line */}
        <motion.div 
          animate={{ x: ["-10%", "110%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-[1px] bg-primary-container/30 shadow-[0_0_15px_rgba(247,230,0,0.4)] z-10"
        />
        
        {/* Corner Crosshair Markers */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t border-l border-primary-container/40"></div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 border-t border-r border-primary-container/40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-b border-l border-primary-container/40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b border-r border-primary-container/40"></div>
      </div>

      {/* Radar Sweep */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(247,230,0,0.05)_0deg,transparent_60deg)] animate-radar-sweep origin-center scale-[2]"></div>
    </div>
  );
};

const ProfileView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="terminal-output-block">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] bg-terminal-text text-terminal-bg px-2 py-0.5 font-bold">个人主页 // PROFILE_DATA</span>
          <span className="text-terminal-dim text-[10px]">USER_ID: REISEN_0x88FF</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-primary-container/20 blur-xl group-hover:bg-primary-container/40 transition-all duration-500"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 border-2 border-primary-container p-2 bg-terminal-bg overflow-hidden">
              <img 
                src="https://picui.ogmua.cn/s1/2026/03/31/69cbd9fe22dbe.webp" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-primary-container/30 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-container"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-container"></div>
            </div>
            <div className="mt-4 flex justify-between items-center font-mono text-[10px] text-terminal-dim">
              <span>AVATAR_01.JPG</span>
              <span>256x256_PX</span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-grow space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-terminal-text">
                REISEN <span className="text-primary-container opacity-50">/ 铃仙</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-2 py-1 border border-terminal-dim/30 text-[10px] text-terminal-dim uppercase tracking-widest">Full-Stack Developer</span>
              </div>
            </div>

            <div className="terminal-output-block bg-surface-low/30 p-6 border-l-2 border-l-primary-container">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary-container mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> 自我介绍 // BIO_INIT
              </h3>
              <p className="text-terminal-text/80 leading-relaxed font-light">
                一只菜鸡，喜欢整点好玩的
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Mail, label: 'Email', value: 's3068272040@gmail.com', href: 'mailto:s3068272040@gmail.com' },
                { icon: MessageCircle, label: 'QQ', value: '3068272040', href: '#' },
                { icon: Github, label: 'GitHub', value: 'github.com/ReisenTM', href: 'https://github.com/ReisenTM?tab=repositories' },
              ].map((link, i) => (
                <a 
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-terminal-border bg-surface-low/20 hover:bg-primary-container/5 hover:border-primary-container/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <link.icon className="w-4 h-4 text-primary-container" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-terminal-dim group-hover:text-terminal-text transition-colors">{link.label}</span>
                  </div>
                  <div className="text-xs text-terminal-text truncate font-mono">{link.value}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Contributions', value: '1,240+', unit: 'COMMITS' },
          { label: 'Projects', value: '42', unit: 'ACTIVE' },
          { label: 'Experience', value: '5+', unit: 'YEARS' },
          { label: 'Status', value: 'ONLINE', unit: 'STABLE' },
        ].map((stat, i) => (
          <div key={i} className="terminal-output-block p-4 text-center space-y-1">
            <div className="text-[10px] text-terminal-dim uppercase tracking-widest">{stat.label}</div>
            <div className="text-2xl font-headline font-bold text-terminal-text">{stat.value}</div>
            <div className="text-[8px] text-primary-container font-mono">{stat.unit}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('loading');
  const [progress, setProgress] = useState(0);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [command, setCommand] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (view === 'loading') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setView('list'), 300);
            return 100;
          }
          return prev + Math.random() * 12;
        });
      }, 60);
      return () => clearInterval(timer);
    }
  }, [view]);

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post);
    setView('article');
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setView('list');
  };

  const filteredPosts = selectedTag 
    ? MOCK_POSTS.filter(post => post.tags.includes(selectedTag))
    : MOCK_POSTS;

  const onBack = () => {
    setView('list');
    setSelectedPost(null);
  };

  return (
    <div className="relative h-screen w-screen bg-terminal-bg overflow-hidden flex flex-col">
      <DataStreamBackground />
      <div className="contour-lines"></div>
      <div className="crt-overlay"></div>

      <AnimatePresence mode="wait">
        {view === 'loading' && (
          <LoadingScreen key="loading" progress={progress} />
        )}

        {view !== 'loading' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full relative z-10 max-w-[1920px] mx-auto w-full border-x border-terminal-border"
          >
            <Header />

            <div className="flex-grow flex overflow-hidden">
              <Sidebar view={view} setView={setView} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

              <main className="flex-grow flex flex-col overflow-hidden relative">
                <div className="flex-grow overflow-y-auto p-6 md:p-12 terminal-scroll space-y-12" ref={scrollRef}>
                  <AnimatePresence mode="wait">
                    {view === 'list' && (
                      <motion.div 
                        key="list-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                      >
                        {/* System Welcome */}
                        <div className="space-y-1 opacity-60">
                          <p className="text-xs">REISEN_OS [Version 10.0.19045.3803]</p>
                          <p className="text-xs">(c) REISEN LOGISTICS. ALL RIGHTS RESERVED.</p>
                          <p className="text-xs mt-4">正在建立安全连接至 ARCH_SERVER_01...</p>
                          <p className="text-xs">握手成功。欢迎回来, OPERATOR_01.</p>
                        </div>

                        <div className="terminal-output-block">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] bg-terminal-text text-terminal-bg px-2 py-0.5 font-bold">系统智脑</span>
                            <span className="text-terminal-dim text-[10px]">CURRENT_TIME: {new Date().toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xl md:text-3xl font-headline font-light leading-relaxed max-w-4xl text-terminal-text">
                            {selectedTag ? `正在显示标签为 #${selectedTag} 的文章` : '文章加载完成,最新文章如下'}
                          </p>
                          {selectedTag && (
                            <button 
                              onClick={() => setSelectedTag(null)}
                              className="mt-4 text-[10px] text-primary-container border border-primary-container px-3 py-1 hover:bg-primary-container hover:text-on-primary-container transition-all uppercase tracking-widest"
                            >
                              清除过滤器 [X]
                            </button>
                          )}
                        </div>

                        {/* Featured Post or List */}
                        {filteredPosts.map((post, idx) => (
                          <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`terminal-output-block group relative ${idx === 0 ? 'border-l-primary-container' : 'border-l-terminal-border'}`}
                          >
                            <div className="absolute -left-[1px] top-0 w-[1px] h-0 bg-primary-container group-hover:h-full transition-all duration-500"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                <span className={`${idx === 0 ? 'text-primary-container' : 'text-terminal-dim'} text-xs font-bold uppercase tracking-widest`}>
                                  查询结果 // 文章_0{idx + 1}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter text-terminal-text hover:text-primary-container transition-colors cursor-pointer" onClick={() => handlePostSelect(post)}>
                                  {post.title}.
                                </h2>
                              </div>
                              <span className="text-[10px] text-terminal-dim">REF_ID: {post.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                              <div className="col-span-2 text-sm leading-relaxed text-terminal-text/80 space-y-4">
                                <p>{post.excerpt}</p>
                                <div className="flex flex-wrap gap-2">
                                  {post.tags.map(tag => (
                                    <span 
                                      key={tag} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTagSelect(tag);
                                      }}
                                      className="text-[10px] border border-terminal-border px-2 py-0.5 text-terminal-dim hover:text-primary-container hover:border-primary-container cursor-pointer transition-colors"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="border border-terminal-border p-6 bg-terminal-border/20 group-hover:bg-primary-container/5 transition-colors">
                                <span className="text-[10px] text-terminal-dim uppercase block mb-4">Core Metrics</span>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-end">
                                    <span className="text-[10px] block opacity-50 uppercase">字数统计</span>
                                    <span className="text-2xl font-bold">{post.metrics.wordCount}</span>
                                  </div>
                                  <div className="flex justify-between items-end">
                                    <span className="text-[10px] block opacity-50 uppercase">阅读时间</span>
                                    <span className="text-2xl font-bold">{post.metrics.readingTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handlePostSelect(post)}
                              className="text-[10px] border border-terminal-text/20 px-4 py-2 hover:bg-terminal-text hover:text-terminal-bg transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                              阅读完整文档
                              <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                          </motion.div>
                        ))}

                        {/* Available Commands */}
                        <div className="terminal-output-block">
                          <span className="text-terminal-dim text-xs block mb-6">可用指令 // 导航日志</span>
                          <div className="space-y-2 max-w-2xl">
                            {['TYPESCRIPT', 'ARCHITECTURE', 'DEVOPS'].map(cat => (
                              <div key={cat} className="group flex items-center justify-between py-2 px-4 border border-terminal-border hover:border-white transition-colors cursor-pointer">
                                <span className="text-sm">日志列表 --类别:{cat}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {view === 'archive' && (
                      <ArchiveView key="archive-view" posts={MOCK_POSTS} onSelect={handlePostSelect} />
                    )}

                    {view === 'tags' && (
                      <TagsView key="tags-view" posts={MOCK_POSTS} onTagClick={handleTagSelect} />
                    )}

                    {view === 'article' && (
                      <motion.div 
                        key="article-view"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="max-w-4xl mx-auto space-y-12 pb-24"
                      >
                        <button 
                          onClick={onBack}
                          className="flex items-center gap-2 text-terminal-dim hover:text-terminal-text transition-colors text-xs uppercase tracking-widest group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          返回存档列表
                        </button>

                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 text-[10px] font-bold">LOG_ENTRY</span>
                            <span className="text-terminal-dim text-[10px] tracking-widest uppercase">{selectedPost?.date} // {selectedPost?.readTime}</span>
                          </div>
                          <h1 className="text-4xl md:text-7xl font-headline font-bold tracking-tighter text-terminal-text leading-[0.9]">
                            {selectedPost?.title}
                          </h1>
                          <div className="flex items-center gap-6 py-6 border-y border-terminal-border">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary-container" />
                              <span className="text-xs text-terminal-text">{selectedPost?.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-terminal-dim" />
                              <span className="text-xs text-terminal-dim">SOURCE: REISEN_CORE</span>
                            </div>
                          </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none prose-p:text-terminal-text/80 prose-p:leading-relaxed prose-headings:font-headline prose-headings:text-terminal-text">
                          <p className="text-xl font-light italic border-l-4 border-primary-container pl-6 py-2 mb-12">
                            {selectedPost?.excerpt}
                          </p>
                          
                          <div className="space-y-8 text-lg">
                            {selectedPost?.content.split('\n\n').map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>

                          <div className="my-12 bg-surface-low border border-terminal-border p-6 rounded-sm font-mono text-sm overflow-x-auto relative group">
                            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] uppercase">Terminal_Output</span>
                            </div>
                            <pre className="text-primary-container">
                              <code>{selectedPost?.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>

                          <div className="flex flex-wrap gap-2 mt-8">
                            {selectedPost?.tags.map(tag => (
                              <span 
                                key={tag} 
                                onClick={() => handleTagSelect(tag)}
                                className="text-[10px] border border-terminal-border px-2 py-0.5 text-terminal-dim hover:text-primary-container hover:border-primary-container cursor-pointer transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-terminal-border">
                          <div className="p-4 border border-terminal-border bg-surface-low">
                            <span className="text-[10px] text-terminal-dim block mb-2">LOAD_INDEX</span>
                            <span className="text-2xl font-bold text-terminal-text">{selectedPost?.metrics.load}</span>
                          </div>
                          <div className="p-4 border border-terminal-border bg-surface-low">
                            <span className="text-[10px] text-terminal-dim block mb-2">ERROR_RATE</span>
                            <span className="text-2xl font-bold text-terminal-text">0.002%</span>
                          </div>
                          <div className="p-4 border border-terminal-border bg-surface-low">
                            <span className="text-[10px] text-terminal-dim block mb-2">LATENCY</span>
                            <span className="text-2xl font-bold text-terminal-text">12ms</span>
                          </div>
                          <div className="p-4 border border-terminal-border bg-surface-low">
                            <span className="text-[10px] text-terminal-dim block mb-2">UPTIME</span>
                            <span className="text-2xl font-bold text-terminal-text">99.9%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {view === 'profile' && (
                      <ProfileView key="profile-view" />
                    )}
                  </AnimatePresence>
                </div>

                {/* Command Input Area */}
                <div className="py-4 px-6 md:py-6 md:px-12 border-t border-terminal-border bg-terminal-bg/95 relative z-20">
                  <div className="flex items-center gap-4 group">
                    <span className="text-primary-container font-bold">BLOG_&gt;</span>
                    <input 
                      autoFocus
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      className="flex-grow bg-transparent border-none focus:ring-0 text-xl md:text-2xl placeholder-terminal-dim text-terminal-text font-mono outline-none" 
                      placeholder="输入指令或提出问题..." 
                      type="text"
                    />
                    <div className="cursor-blink"></div>
                  </div>
                </div>
              </main>

              <SystemPanel />
            </div>

            <Footer setView={setView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
