import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Lightbulb, Menu, X, ChevronDown, Map, 
Feather, Compass, ScrollText, Heart, MapPin } from 'lucide-react';

// --- 数据源 (Mock Data) ---

const familyData = [
  {
    generation: "第一代：创世与疯狂",
    members: [
      { name: "何塞·阿尔卡蒂奥·布恩迪亚", role: "家族始祖", desc: 
"马孔多的建立者。充满狂热的探索欲，晚年发疯被绑在栗树下，说着没有人懂的拉丁
语，直到死去。" },
      { name: "乌尔苏拉·伊瓜兰", role: "家族基石", desc: "务实、坚韧的母亲形
象。她活了一百多岁，像一只忙碌的蚂蚁维系着这个疯狂家族的最后一点理智。" }
    ]
  },
  {
    generation: "第二代：战争与孤独",
    members: [
      { name: "何塞·阿尔卡蒂奥", role: "长子", desc: "继承了父亲巨大的身躯和
冲动，像野兽一样强壮。早年随吉普赛人出走，归来后神秘死亡。" },
      { name: "奥雷里亚诺·布恩迪亚上校", role: "次子", desc: "家族最著名的战
争英雄。发动32场起义皆败，晚年大彻大悟，在制作小金鱼的循环劳作中度过余生。" 
},
      { name: "阿玛兰妲", role: "女儿", desc: "终身未嫁。她在仇恨与悔恨中度
过一生，白天织裹尸布，晚上拆掉，以此以此对抗孤独。" },
      { name: "雷贝卡", role: "养女", desc: "喜欢吃土和墙皮的孤儿。曾与阿玛
兰妲争夺爱情，后嫁给何塞·阿尔卡蒂奥，在封闭的房子里孤独终老。" }
    ]
  },
  {
    generation: "第三代：暴政与迷失",
    members: [
      { name: "阿尔卡蒂奥", role: "独裁者", desc: 
"在马孔多建立暴政，最终被判处死刑。他是家族中最为残暴的一员。" },
      { name: "奥雷里亚诺·何塞", role: "迷乱者", desc: 
"上校的儿子，迷恋自己的姑姑阿玛兰妲，最终死于乱枪之下。" },
      { name: "17个奥雷里亚诺", role: "私生子群", desc: 
"上校在战争期间留下的血脉，额头带有灰烬印记，在一夜之间被政治追杀殆尽。" }
    ]
  },
  {
    generation: "第四代：美与虚无",
    members: [
      { name: "美人儿雷梅黛丝", role: "飞升者", desc: 
"美得不属于人间，智力如孩童般纯真。她最终抓着洁白的床单，随风升天而去。" },
      { name: "奥雷里亚诺第二", role: "享乐者", desc: "与双胞胎兄弟性格互换
，沉迷于宴会和彩票，家中牲畜疯狂繁殖，带来了短暂的物质繁荣。" },
      { name: "何塞·阿尔卡蒂奥第二", role: "幸存者", desc: 
"目睹了香蕉公司大屠杀的唯一幸存者，晚年将自己关在房间里研究羊皮卷。" }
    ]
  },
  {
    generation: "第五/六/七代：毁灭与终结",
    members: [
      { name: "梅梅 (雷纳塔·雷梅黛丝)", role: "悲剧恋人", desc: 
"爱上技工巴比伦，被母亲强行拆散送入修道院，终身沉默。" },
      { name: "阿玛兰妲·乌尔苏拉", role: "回光返照", desc: 
"充满活力试图复兴家族，却与自己的侄子陷入乱伦之爱。" },
      { name: "奥雷里亚诺 (巴比伦)", role: "译码人", desc: 
"家族最后的智者，破译了梅尔基亚德斯的羊皮卷，见证了马孔多的消失。" },
      { name: "长猪尾巴的男婴", role: "终结者", desc: 
"家族乱伦的产物，刚出生便被蚂蚁吃掉，应验了羊皮卷的预言。" }
    ]
  }
];

const timelineEvents = [
  { year: "创世纪", title: "建立马孔多", desc: "为了逃避杀人的罪恶感，何塞·
阿尔卡蒂奥·布恩迪亚带领众人翻山越岭，在沼泽中建立了与世隔绝的村庄。", icon: 
"🌱" },
  { year: "接触", title: "吉普赛人的魔法", desc: "梅尔基亚德斯带来磁铁、放大
镜和炼金术。老布恩迪亚对着冰块惊叹“这是这个时代伟大的发明”。", icon: "🧊" },
  { year: "瘟疫", title: "失眠症流行", desc: "全村人失去了睡眠和记忆。人们给
牛羊贴上“这是牛，每天要挤奶”的标签，以对抗遗忘。", icon: "🧠" },
  { year: "战争", title: "自由派起义", desc: "由于不满保守派统治，奥雷里亚诺
愤而从军，成为上校，拉开了长达二十年内战的序幕。", icon: "⚔️" },
  { year: "繁荣", title: "香蕉狂热", desc: "美国人修通了铁路，建立了香蕉公司
。马孔多迅速现代化，变成了喧闹繁华但也藏污纳垢的城镇。", icon: "🚂" },
  { year: "转折", title: "广场大屠杀", desc: "罢工工人在车站聚集，遭到机枪扫
射，尸体被装上火车运走扔进大海。官方随后宣称什么都没发生。", icon: "🌧️" },
  { year: "衰败", title: "四年大雨", desc: "屠杀之后，马孔多下了一场持续四年
十一个月零两天的雨。雨停后，城镇破败，家族成员在孤独中凋零。", icon: "🥀" },
  { year: "终局", title: "羊皮卷揭秘", desc: "飓风刮起，奥雷里亚诺读懂了羊皮
卷的最后一句，整个马孔多被从地面上一扫而光。", icon: "🌪️" }
];

const plotHighlights = [
  {
    title: "开篇：发现冰块",
    quote: "“多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他
去见识冰块的那个遥远的下午。”",
    narrative: "这是文学史上最著名的开篇之一。在马孔多还是个只有二十户人家的
小村庄时，吉普赛人带来了世界的奇迹。对于生活在热带沼泽的布恩迪亚家族来说，冰
块这种冷冰冰、烫手的东西简直是神迹。这一幕象征着原始文明与现代文明的初次碰撞
，也奠定了全书在“回忆”与“循环”中展开的基调。",
    tag: "童年与启蒙"
  },
  {
    title: "失眠症与记忆机器",
    quote: "“只要能在上帝忘记我们之前把这架机器做出来就行。”",
    narrative: "丽贝卡带来了失眠症，全村人都不再睡觉，随之而来的是记忆的丧失
。何塞·阿尔卡蒂奥·布恩迪亚开始给家里的每一样东西贴标签：“这是桌子”、“这是牛”
。甚至在村口挂上牌子：“这里是马孔多”，“上帝是存在的”。这一情节极具魔幻色彩，
深刻隐喻了拉美历史中文化的断层与集体记忆的脆弱。",
    tag: "魔幻现实"
  },
  {
    title: "上校的小金鱼",
    quote: "“他发动了三十二场武装起义，无一成功。”",
    narrative: "奥雷里亚诺上校是书中的权力顶峰。他拥有绝对的权威，甚至画个圈
就不让人靠近。但在经历无数杀戮和背叛后，他看透了战争的虚无。晚年的他回到作坊
，每天制作小金鱼，做好了二十五条就熔化重做。这不再是艺术创作，而是逃避回忆、
维持孤独的一种方式。在这个循环中，权力的虚妄暴露无遗。",
    tag: "权力与虚无"
  },
  {
    title: "美人儿雷梅黛丝升天",
    quote: "“她永远地留在了那个不受人类时间限制的纯真空间里。”",
    narrative: "美人儿雷梅黛丝是家族中唯一的“异类”，她美得惊人，却智力低下，
或者说过于纯粹，不通世俗。在一次晒床单时，她抓着床单，在一阵光芒中连人带床单
飞升上了天空。这不仅是魔幻现实主义的巅峰描写，也象征着在这个充满罪恶与孤独的
家族中，纯粹的美是无法在尘世存活的。",
    tag: "神性与超脱"
  },
  {
    title: "香蕉大屠杀",
    quote: 
"“这儿没死人……自从您的叔叔上校那个时代以来，马孔多没发生过什么事。”",
    narrative: "这是全书最黑暗的转折点。三千多名罢工工人被诱骗到车站，随后遭
到机枪屠杀，尸体被连夜运往海里。然而次日，官方和居民都否认发生过任何事情。唯
一的幸存者何塞·阿尔卡蒂奥第二终生被当作疯子，因为只有他记得真相。这一情节控
诉了官方历史对真相的抹杀，是拉美苦难历史的缩影。",
    tag: "历史与遗忘"
  },
  {
    title: "最后的羊皮卷",
    quote: "“家族的第一个人被树绑在树上，最后一个人正在被蚂蚁吃掉。”",
    narrative: "当家族最后一名成员奥雷里亚诺破译梅尔基亚德斯的预言时，他发现
这羊皮卷记载的正是家族百年的历史，而且是同步发生的。当他读到最后一行，现实与
预言重合，飓风扫荡了马孔多。这不仅是家族的终结，也是文本的终结，象征着注定孤
独的命运无法逃脱。",
    tag: "宿命与终结"
  }
];

const themes = [
  { title: "绝对的孤独", content: "孤独是布恩迪亚家族的通病。上校在权力的顶
峰感到寒冷；阿玛兰妲用拒绝爱情来以此自卫；乌尔苏拉在瞎了眼之后才看清子孙们的
孤独。这种孤独源于不懂得爱，是拉美民族性格的一种深层隐喻。", color: 
"bg-amber-100" },
  { title: "循环的时间", content: "书中人物不断重复着祖先的名字、性格和命运
。时间不是线性的，而是在原地转圈。历史的悲剧一遍遍重演，无论是家族乱伦的诅咒
，还是政治斗争的虚无，都陷入了无法打破的怪圈。", color: "bg-stone-200" },
  { title: "文明的入侵", content: "马孔多经历了从原始伊甸园到现代城镇，再到
废墟的过程。吉普赛人代表古老智慧，美国香蕉公司代表掠夺性资本。外来文明带来了
繁荣，但也带来了异化、剥削和最终的毁灭。", color: "bg-green-50" },
  { title: "爱与乱伦", content: "家族始于表兄妹通婚的恐惧（生出猪尾巴），终
于姨侄通婚的悲剧。家族成员在没有爱情的婚姻和没有婚姻的爱情中挣扎。唯有最后的
阿玛兰妲·乌尔苏拉拥有真爱，却导致了家族的灭亡。", color: "bg-red-50" }
];

// --- Components ---

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-12 text-center animate-fadeIn">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-amber-800 rounded-full text-amber-50">
        <Icon size={32} />
      </div>
    </div>
    <h2 className="text-4xl font-serif font-bold text-amber-900 
mb-2">{title}</h2>
    <p className="text-amber-700 italic text-lg max-w-2xl 
mx-auto">{subtitle}</p>
    <div className="w-24 h-1 bg-amber-800 mx-auto mt-6"></div>
  </div>
);

const NavItem = ({ section, activeSection, scrollTo, label, icon: Icon }) =>
 (
  <button
    onClick={() => scrollTo(section)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
transition-all duration-300 ${
      activeSection === section 
      ? 'bg-amber-800 text-amber-50 shadow-lg' 
      : 'text-amber-900 hover:bg-amber-100'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium hidden md:inline">{label}</span>
  </button>
);

const PlotCard = ({ data, index }) => (
  <div className="flex flex-col md:flex-row gap-6 mb-12 bg-white rounded-xl 
shadow-sm border border-stone-200 overflow-hidden hover:shadow-md 
transition-shadow">
    <div className="md:w-1/3 bg-amber-900/5 p-6 flex flex-col justify-center
 border-r border-stone-100">
      <div className="text-amber-600 font-bold tracking-widest text-sm mb-2 
uppercase">关键情节 {index + 1}</div>
      <h3 className="text-2xl font-serif font-bold text-amber-900 
mb-4">{data.title}</h3>
      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 
text-xs rounded-full w-max font-medium">
        #{data.tag}
      </span>
    </div>
    <div className="md:w-2/3 p-6 flex flex-col justify-center">
      <blockquote className="border-l-4 border-amber-400 pl-4 italic 
text-stone-600 mb-4 font-serif text-lg">
        {data.quote}
      </blockquote>
      <p className="text-stone-700 leading-relaxed text-sm md:text-base">
        {data.narrative}
      </p>
    </div>
  </div>
);

// --- Main App ---

export default function OneHundredYearsOfSolitude() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedGen, setExpandedGen] = useState("第一代：创世与疯狂");

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'background', 'family', 'timeline', 'plots',
 'themes'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && 
(element.offsetTop + element.offsetHeight > scrollPosition)) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans 
selection:bg-amber-200">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-[#FDFBF7]/95 backdrop-blur-md 
z-50 border-b border-amber-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" 
onClick={() => scrollTo('home')}>
              <Feather className="text-amber-800 mr-2" />
              <span className="font-serif text-xl font-bold text-amber-950 
tracking-wide">百年孤独</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1">
              <NavItem section="background" activeSection={activeSection} 
scrollTo={scrollTo} label="背景" icon={Map} />
              <NavItem section="family" activeSection={activeSection} 
scrollTo={scrollTo} label="家族" icon={Users} />
              <NavItem section="timeline" activeSection={activeSection} 
scrollTo={scrollTo} label="时间线" icon={Clock} />
              <NavItem section="plots" activeSection={activeSection} 
scrollTo={scrollTo} label="关键情节" icon={ScrollText} />
              <NavItem section="themes" activeSection={activeSection} 
scrollTo={scrollTo} label="主题" icon={Lightbulb} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} 
className="text-amber-900 p-2 hover:bg-amber-50 rounded">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-amber-200 
shadow-lg absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <button onClick={() => scrollTo('background')} className="p-3 
text-left font-medium text-amber-900 hover:bg-amber-50 border-b 
border-amber-100">背景导读</button>
              <button onClick={() => scrollTo('family')} className="p-3 
text-left font-medium text-amber-900 hover:bg-amber-50 border-b 
border-amber-100">家族谱系</button>
              <button onClick={() => scrollTo('timeline')} className="p-3 
text-left font-medium text-amber-900 hover:bg-amber-50 border-b 
border-amber-100">时间线</button>
              <button onClick={() => scrollTo('plots')} className="p-3 
text-left font-medium text-amber-900 hover:bg-amber-50 border-b 
border-amber-100">关键情节</button>
              <button onClick={() => scrollTo('themes')} className="p-3 
text-left font-medium text-amber-900 hover:bg-amber-50">主题解析</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center 
justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
           {/* Abstract Background Pattern */}
           <div className="w-full h-full 
bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
from-amber-900 via-transparent to-transparent opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center 
animate-fadeIn">
          <div className="inline-block mb-4 px-4 py-1 border 
border-amber-800/30 rounded-full text-amber-800 text-sm font-serif 
tracking-widest uppercase bg-amber-50">
            Gabriel García Márquez
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-black 
text-amber-950 mb-6 leading-tight drop-shadow-sm">
            百年孤独
            <span className="block text-xl md:text-3xl mt-4 font-normal 
text-amber-800 font-sans tracking-wide opacity-80">One Hundred Years of 
Solitude</span>
          </h1>
          <p className="text-lg md:text-2xl font-serif text-amber-900/80 
mb-10 italic leading-relaxed max-w-2xl mx-auto border-t border-b 
border-amber-200 py-6">
            “这一家人的命运早已注定，因为注定经受百年孤独的家族不会有第二次
机会在大地上出现。”
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => scrollTo('plots')} 
className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-4 rounded-full
 font-medium transition shadow-lg hover:shadow-xl flex items-center 
justify-center group">
               <BookOpen className="mr-2 group-hover:scale-110 
transition-transform" size={20}/> 开始阅读导读
             </button>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section id="background" className="py-24 bg-amber-50 border-t 
border-amber-100">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader 
            title="历史与文化背景" 
            subtitle="在踏入马孔多之前，我们需要先了解这片土地的底色。"
            icon={Compass}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 
border-amber-600">
              <div className="flex items-center mb-4 text-amber-800">
                <MapPin className="mr-2" />
                <h3 className="text-xl font-bold">拉美的地理孤绝</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4 text-sm 
md:text-base">
                马孔多是被沼泽和山脉包围的孤岛。这反映了拉丁美洲早期的地理隔
绝状态，这种封闭性是孕育“孤独”主题的温床，也让外来文明（如吉普赛人、美国公司
）的闯入显得尤为剧烈。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 
border-purple-600">
              <div className="flex items-center mb-4 text-purple-800">
                <Feather className="mr-2" />
                <h3 className="text-xl font-bold">魔幻现实主义</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4 text-sm 
md:text-base">
                在拉美文化中，神话、传说与现实生活密不可分。所谓的“魔幻”并非
虚构，而是拉美人民眼中的“日常”。死人对话、升天、长生不老，都是这片神奇大陆上
对残酷现实的一种文学折射。
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 
border-red-800">
            <h3 className="text-2xl font-serif font-bold text-amber-900 
mb-4">核心历史映射：千日战争与香蕉狂热</h3>
            <p className="text-stone-700 leading-relaxed mb-4">
              《百年孤独》不仅是家族史，更是哥伦比亚的历史缩影。
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-sm">
               <li className="flex items-start">
                 <span className="bg-red-100 text-red-800 px-2 py-1 rounded 
mr-2 font-bold shrink-0">千日战争</span>
                 <span className="text-stone-600">1899-1902年自由党与保守党
的内战。书中的奥雷里亚诺上校即以此为原型，反映了无休止政治暴力的虚无。</span
>
               </li>
               <li className="flex items-start">
                 <span className="bg-yellow-100 text-yellow-800 px-2 py-1 
rounded mr-2 font-bold shrink-0">香蕉大屠杀</span>
                 <span 
className="text-stone-600">1928年联合果品公司镇压罢工工人。书中对这一事件的
描写（尸体装火车、官方否认）是对历史遗忘的强烈控诉。</span>
               </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Family Tree Section */}
      <section id="family" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader 
            title="布恩迪亚家族谱系" 
            
subtitle="七代人，同一个名字，同一种孤独。点击左侧世代查看详情。"
            icon={Users}
          />

          <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/3 space-y-2">
               {familyData.map((gen) => (
                 <button
                   key={gen.generation}
                   onClick={() => setExpandedGen(gen.generation)}
                   className={`w-full text-left px-6 py-4 rounded-lg 
font-serif transition-all duration-200 flex justify-between items-center 
border ${
                     expandedGen === gen.generation 
                     ? 'bg-amber-900 border-amber-900 text-white shadow-md 
transform scale-105' 
                     : 'bg-white border-stone-200 text-stone-600 
hover:bg-amber-50'
                   }`}
                 >
                   <span 
className="font-bold">{gen.generation.split("：")[0]}</span>
                   <span className="text-xs opacity-80 hidden 
sm:inline">{gen.generation.split("：")[1]}</span>
                   {expandedGen === gen.generation && <ChevronDown size={16}
 />}
                 </button>
               ))}
               
               <div className="mt-8 bg-stone-50 p-6 rounded-xl border 
border-stone-200">
                  <h4 className="font-bold text-amber-900 mb-2 flex 
items-center"><Users size={16} className="mr-2"/> 命名宿命论</h4>
                  <p className="text-xs text-stone-600 
mb-2">家族的名字决定了性格与命运：</p>
                  <ul className="text-xs space-y-2 text-stone-600">
                    <li className="flex gap-2">
                      <span className="font-bold 
text-stone-800">奥雷里亚诺:</span> 
                      性格内向、头脑清晰、富有预见力，但注定孤独。
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold 
text-stone-800">何塞·阿尔卡蒂奥:</span> 
                      身体强壮、冲动、意志薄弱，往往死于非命。
                    </li>
                  </ul>
               </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-2/3">
               {familyData.map((gen) => (
                 expandedGen === gen.generation && (
                   <div key={gen.generation} className="grid gap-6 
animate-fadeIn">
                      {gen.members.map((member, idx) => (
                        <div key={idx} className="bg-[#FDFBF7] border 
border-stone-200 rounded-xl p-6 hover:border-amber-400 transition 
duration-300 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 
bg-amber-100 rounded-full -mr-12 -mt-12 transition-transform 
group-hover:scale-150"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start
 mb-2">
                               <h4 className="text-xl font-bold 
text-amber-950">{member.name}</h4>
                               <span className="px-2 py-1 bg-white/80 
backdrop-blur text-stone-500 text-xs font-bold rounded border 
border-stone-100 shadow-sm">{member.role}</span>
                            </div>
                            <p className="text-stone-600 text-sm 
leading-relaxed border-t border-stone-100 pt-3 mt-1">{member.desc}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                 )
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 bg-stone-900 text-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader 
            title="马孔多百年史" 
            subtitle="从创世纪到启示录，一个注定消失的镜花水月。"
            icon={Clock}
          />
          
          <div className="relative border-l border-stone-700 ml-4 md:ml-1/2 
space-y-12 mt-16">
            {timelineEvents.map((event, index) => (
              <div key={index} className={`relative pl-8 md:pl-0 flex 
flex-col md:flex-row items-center group ${index % 2 === 0 ? 
'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 
md:ml-[-5px] w-3 h-3 rounded-full bg-amber-500 
shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 group-hover:scale-150 
transition-transform"></div>
                
                {/* Content */}
                <div className={`w-full md:w-[45%] mb-4 md:mb-0 ${index % 2 
=== 0 ? 'md:pl-16 md:text-left' : 'md:pr-16 md:text-right'}`}>
                  <div className="group-hover:-translate-y-1 
transition-transform duration-300">
                    <div className={`flex items-center mb-1 gap-2 ${index % 
2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                       <span className="text-amber-500 font-serif text-sm 
tracking-widest uppercase">{event.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-stone-100 
mb-3">{event.title}</h3>
                    <p className="text-stone-400 text-sm 
leading-relaxed">{event.desc}</p>
                  </div>
                </div>
                
                {/* Spacer */}
                <div className="hidden md:block w-[45%]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Plots Section (NEW) */}
      <section id="plots" className="py-24 bg-[#F5F2EA]">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeader 
            title="关键情节深度解析" 
            subtitle="透过这六个瞬间，看透布恩迪亚家族的兴衰与孤独。"
            icon={ScrollText}
          />
          
          <div className="space-y-8">
            {plotHighlights.map((plot, index) => (
              <PlotCard key={index} data={plot} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader 
            title="主题与思想" 
            
subtitle="《百年孤独》不仅是一个家族的故事，更是关于人类命运的寓言。"
            icon={Lightbulb}
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            {themes.map((theme, index) => (
              <div key={index} className={`${theme.color} rounded-2xl p-8 
transition hover:shadow-xl hover:scale-[1.01] duration-300 flex flex-col`}>
                <div className="flex items-center mb-4">
                  <Heart className="text-amber-900/40 mr-3" size={24} />
                  <h3 className="text-xl font-serif font-bold 
text-stone-900">{theme.title}</h3>
                </div>
                <p className="text-stone-800 text-sm leading-7 opacity-90">
                  {theme.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-stone-500 italic font-serif">
              “过去都是假的，回忆没有归路，春天总是一去不返，最疯狂执着的爱
情也终究是过眼云烟。”
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200/60 py-16 border-t 
border-amber-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Feather className="mx-auto mb-6 opacity-50" />
          <p className="font-serif italic mb-8 text-lg text-amber-100/80">
            One Hundred Years of Solitude
          </p>
          <div className="w-12 h-px bg-amber-800 mx-auto mb-8"></div>
          <p className="text-xs tracking-widest uppercase opacity-60">
            Designed for Immersive Reading
          </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
