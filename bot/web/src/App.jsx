import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl, Howler } from 'howler';
import DialogueManager from './components/DialogueManager';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './App.css';

/* =================== AUDIO ENGINE =================== */

const bgMusic = new Howl({
  src: ['/assets/audio/ambient.mp3'],
  loop: true,
  volume: 0.3,
  preload: true,
  html5: true
});

const clickSfx = new Howl({
  src: ['/assets/audio/click.mp3'],
  volume: 0.5,
  preload: true,
  html5: true
});

/* =================== STORY SCRIPT =================== */

const storyScript = {
  deer: {
    /* === Уровень 1: Приветствие — туман и тишина === */
    start: {
      text: "Ты открываешь глаза. Вокруг — древний лес, окутанный серебристым туманом. Воздух звенит тишиной, какой ты никогда не слышал. Из тумана медленно выступает Олень — его рога мерцают мягким изумрудным светом, как маяки в ночном море.\n\n«Я вижу, шум в твоей голове оглушает тебя, странник. Скажи, что ты слышишь сейчас?»",
      choices: [
        { text: "Я слышу только страх...", next: "deer_fear" },
        { text: "Я слышу тишину. И она пугает.", next: "deer_silence" }
      ]
    },
    /* === Уровень 2: Ветвления === */
    deer_fear: {
      text: "Олень склоняет голову, и рога его отбрасывают изумрудные тени на мох. «Страх — это не враг, странник. Это голос, который пытается тебя защитить. Но иногда он кричит слишком громко и заглушает всё остальное».\n\nТуман вокруг пульсирует, словно дыхание. «Позволь мне научить тебя слушать не сам страх, а то, что между ним. В паузах — истина».",
      choices: [
        { text: "Научи меня слышать паузы", next: "deer_pauses" }
      ]
    },
    deer_silence: {
      text: "Олень слегка улыбается — или тебе это кажется. «Тишина пугает, потому что в ней ты наконец слышишь самого себя. Но это не пустота. Это пространство, где живёт настоящий ты».\n\nИзумрудный свет его рогов разливается шире, и ты чувствуешь, как что-то внутри начинает оттаивать.\n\n«Я — твой храм. Здесь нет оценок. Мы будем учиться слышать паузы между твоими мыслями».",
      choices: [
        { text: "Расскажи мне больше", next: "deer_pauses" }
      ]
    },
    /* === Уровень 3: Учение === */
    deer_pauses: {
      text: "Олень закрывает глаза. На мгновение весь лес замирает — даже ветер перестаёт шевелить листву. Ты слышишь собственное сердцебиение, ровное и спокойное.\n\n«Видишь? Между одной мыслью и другой — целая вселенная. Именно там живёт покой. Не в мыслях, а в промежутках между ними».\n\nОн открывает глаза, и ты видишь в них целые миры. «Мы будем приходить сюда снова и снова, пока ты не научишься находить этот храм внутри себя. Ты готов начать путь?»",
      choices: [
        { text: "Я готов. Веди меня.", next: "finish" }
      ]
    }
  },
  fox: {
    /* === Уровень 1: Зеркальное приветствие === */
    start: {
      text: "Мир вокруг тебя рассыпается на тысячи осколков и складывается заново. Ты стоишь в бесконечной библиотеке — но вместо книг здесь парящие зеркала. В каждом отражении ты видишь другую версию себя.\n\nИз-за ближайшего зеркала выглядывает Лиса. Её глаза — словно два огонька свечей в тёмном храме знаний.\n\n«О, новый гость! Добро пожаловать в Зал Бесконечных Отражений. Твой мозг — это самая сложная нейронная сеть во вселенной. Хочешь узнать, как она работает?»",
      choices: [
        { text: "Покажи мне логику этого мира", next: "fox_logic" },
        { text: "Я хочу понять это сердцем", next: "fox_intuition" }
      ]
    },
    /* === Уровень 2: Ветвления === */
    fox_logic: {
      text: "Лиса щёлкает лапой, и зеркала выстраиваются в идеально ровный ряд. В каждом — схема, формула, паттерн.\n\n«Логика — это язык, на котором твой мозг разговаривает сам с собой. Но не всё в нём подчиняется формулам. Иногда самая мощная формула — это признать: я не знаю».\n\nОна подмигивает и взмахивает хвостом. Зеркала начинают кружиться, показывая тысячи твоих отражений одновременно.\n\n«Мы разберём каждый сбой в твоей системе. Я покажу, где логика стала ловушкой — и как найти из неё выход. Довольно теории: хочешь увидеть это своими глазами?»",
      choices: [
        { text: "Покажи мне", next: "fox_rewrite" }
      ]
    },
    fox_intuition: {
      text: "Лиса мягко смеётся, и звук её смеха эхом разносится между зеркалами. «Сердце... Какое интересное решение! Но знаешь ли ты, что интуиция — это не магия? Это просто твой мозг, который обрабатывает информацию быстрее, чем ты успеваешь осознать».\n\nЗеркала начинают мерцать, показывая не образы, а ощущения — тёплые, холодные, знакомые, новые.\n\n«Ты интуитивно чувствуешь связи, которые логика ещё не нашла. Я помогу тебе вытащить это на поверхность, превратить смутное чувство в ясное знание. Хочешь увидеть то, что скрыто за каждым отражением?»",
      choices: [
        { text: "Покажи мне", next: "fox_rewrite" }
      ]
    },
    /* === Уровень 3: Откровение === */
    fox_rewrite: {
      text: "Лиса встаёт во главу зеркального коридора. «Запомни: каждая мысль — это нейронный путь. Каждый повтор укрепляет его. Ты можешь выбрать, какие дороги в своём мозгу усиливать, а какие — оставить зарастать».\n\nЗеркала вокруг тебя гаснут одно за другим. Остаётся только одно — и в нём ты видишь себя, но яснее, чем когда-либо прежде.\n\n«Ты не заложник своих паттернов. Ты их архитектор. Готов построить новый?»",
      choices: [
        { text: "Я готов. Начнём.", next: "finish" }
      ]
    }
  },
  golem: {
    /* === Уровень 1: Громовое приветствие === */
    start: {
      text: "Земля сотрясается под ногами. Ты стоишь на вершине ледяной горы, и ветер бьёт в лицо, словно хочет столкнуть вниз. Облака вращаются вокруг вершины, как стая волков.\n\nИз скалы отделяется колоссальная фигура — каменный страж, покрытый рунами. Его глаза-руны вспыхивают алым светом, и ты чувствуешь, как его голос резонирует прямо в костях.\n\n«СТРАННИК. ТЫ ПРИШЁЛ СЮДА, ПОТОМУ ЧТО МИР ВНУТРИ ТЕБЯ РУШИТСЯ. СКАЖИ МНЕ — ты хочешь спрятаться за стеной или сам стать стеной?»",
      choices: [
        { text: "Я хочу стать стеной. Научи стоять.", next: "golem_wall" },
        { text: "Я хочу сразиться со своими страхами.", next: "golem_battle" }
      ]
    },
    /* === Уровень 2: Ветвления === */
    golem_wall: {
      text: "Голем медленно кивает, и от его кивка с горных уступов сыплется снег.\n\n«СТОЯТЬ — труднее, чем бежать. Бежать может каждый. А вот устоять, когда весь мир кричит и разрушается — это высшая дисциплина».\n\nОн опускается на одно колено, и его рунные глаза оказываются на одном уровне с тобой. Вблизи руны пульсируют, будто живые — каждая хранит память о тысячелетних бурях, которые он пережил.\n\n«Я дам тебе опору. Мы начнём с фундамента — того, что не разрушит ни один кризис. Но сначала — прими: уязвимость это не слабость. Это то место, где начинается настоящая сила».",
      choices: [
        { text: "Я принимаю. Покажи мне путь", next: "golem_foundation" }
      ]
    },
    golem_battle: {
      text: "Голем издаёт звук, похожий на смех грозы. Камни вокруг вибрируют от его голоса.\n\n«ХРАБРОСТЬ! Но настоящая битва — не там снаружи. Она внутри. И оружие тебе понадобится не меч, а воля».\n\nОн ударяет кулаком о землю, и ледяная гора на мгновение покрывается золотыми рунами — каждая из них слово: СТОЙКОСТЬ, МУЖЕСТВО, ПРИНЯТИЕ, СИЛА.\n\n«Ты хочешь бить — я учу стоять. Потому что удары проходят, а стойкость остаётся. Готов ли ты стать камнем, о который разобьётся любой шторм?»",
      choices: [
        { text: "Готов. Я буду стоять.", next: "golem_foundation" }
      ]
    },
    /* === Уровень 3: Фундамент === */
    golem_foundation: {
      text: "Голем встаёт во весь рост, и его тень накрывает тебя, как щит. Руны на его теле загораются ярче — одна за другой, словно цепь маяков.\n\n«Слушай внимательно. Фундамент строится не за день. Камень за камнем. Дыхание за дыханием. Когда мир штормит, ты не бежишь. Ты делаешь вдох. Ты чувствуешь землю под ногами. Ты говоришь себе: Я ЗДЕСЬ. И ЭТОГО ДОСТАТОЧНО».\n\nВетер стихает. Облака расступаются. Горная вершина озарена мягким золотым светом.\n\n«Я буду рядом, когда тебе нужно будет устоять. А теперь — скажи вслух. Я буду стоять».",
      choices: [
        { text: "Я буду стоять.", next: "finish" }
      ]
    }
  }
};

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [screen, setScreen] = useState('welcome');
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [glowColor, setGlowColor] = useState('#7E998A');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isStoryActive, setIsStoryActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const swiperRef = useRef(null);

  const toggleMute = () => {
    Howler.mute(!isMuted);
    setIsMuted(!isMuted);
  };

  const playClick = () => clickSfx.play();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
      tg.setHeaderColor('#0A0510');
    }

    const saved = localStorage.getItem('chosenGuide');
    if (saved) {
      setSelected(JSON.parse(saved));
      setScreen('selected');
    }

    /* === PRELOAD ASSETS === */
    preloadAssets();
  }, []);

  const preloadAssets = () => {
    const imagesToLoad = [
      '/deer.png',
      '/fox.png',
      '/golem.png'
    ];

    let loaded = 0;
    const total = imagesToLoad.length;

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) {
          setIsAppReady(true);
        }
      };
      img.src = src;
    });

    // Fallback: force ready after 3s even if images hang
    setTimeout(() => setIsAppReady(true), 3000);
  };

  const characters = [
    {
      id: 'deer',
      name: 'Дух Спокойствия',
      emoji: '🍃',
      image: '/deer.png',
      qualities: ['Мудрость', 'Покой', 'Гармония'],
      color: '#7E998A',
      stats: [
        { label: 'Мудрость', value: 90 },
        { label: 'Гармония', value: 85 },
        { label: 'Загадочность', value: 70 }
      ]
    },
    {
      id: 'fox',
      name: 'Дух Разума',
      emoji: '🦊',
      image: '/fox.png',
      qualities: ['Хитрость', 'Интеллект', 'Интуиция'],
      color: '#C87A4A',
      stats: [
        { label: 'Хитрость', value: 95 },
        { label: 'Интеллект', value: 90 },
        { label: 'Скорость', value: 80 }
      ]
    },
    {
      id: 'golem',
      name: 'Дух Силы',
      emoji: '🏔',
      image: '/golem.png',
      qualities: ['Стойкость', 'Защита', 'Сила воли'],
      color: '#5B6B7A',
      stats: [
        { label: 'Стойкость', value: 100 },
        { label: 'Защита', value: 90 },
        { label: 'Сила', value: 85 }
      ]
    }
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 30 + Math.random() * 60,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    drift: -20 + Math.random() * 40,
  }));

  const handleSlideChange = (swiper) => {
    const idx = swiper.activeIndex % characters.length;
    setActiveIndex(idx);
    setGlowColor(characters[idx].color);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSelect = (char) => {
    setSelected(char);
    setIsStoryActive(true);
    localStorage.setItem('chosenGuide', JSON.stringify(char));
  };

  /* ====================================================== */
  /*  SCREEN RENDERER                                      */
  /* ====================================================== */

  const profileChar = selected || characters[activeIndex];
  const pc = profileChar;

  const renderCurrentScreen = () => {
    /* --- LOADING SCREEN --- */
    if (!isAppReady) {
      return (
        <div className="loading-screen">
          <motion.div
            className="loading-logo"
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="loading-icon">🍃</span>
            <span className="loading-text">Загрузка...</span>
          </motion.div>
        </div>
      );
    }

    /* --- DIALOGUE --- */
    if (isStoryActive && selected) {
      const charStory = storyScript[selected.id];
      return (
        <AnimatePresence mode="wait">
          <DialogueManager
            key={selected.id}
            story={charStory}
            character={selected}
            clickSfx={clickSfx}
            onOpenProfile={() => { playClick(); setShowProfile(true); }}
            onFinish={() => {
              setScreen('main_game');
              setIsStoryActive(false);
            }}
          />
        </AnimatePresence>
      );
    }

    /* --- WELCOME --- */
    if (screen === 'welcome') {
      return (
        <div className="animate-fade-in welcome-screen">
          <div className="particles-container">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  bottom: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  y: -200 - p.y * 3,
                  x: p.drift,
                  opacity: [0, 0.7, 0.2, 0],
                  scale: [0, 1, 1, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="welcome-bg-glow" />

          <header className="welcome-header">
            <motion.div
              className="welcome-title-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <h1 className="welcome-title">ПУТЬ К СЕБЕ</h1>
              <div className="title-ornament" />
            </motion.div>
            <motion.p
              className="welcome-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Твоё безопасное пространство для тех, кто готов заглянуть внутрь
            </motion.p>
          </header>

          <motion.div
            className="welcome-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="welcome-text">
              Это путешествие — не терапия и не тест. Это честный разговор с собой,
              в котором ты сам выбираешь своего проводника.
            </p>
            <p className="welcome-text" style={{ marginTop: '16px' }}>
              Каждый проводник — хранитель определённой части тебя.
              Тот, кого ты выберешь, покажет, что тебе сейчас нужно.
            </p>
          </motion.div>

          <motion.button
            className="btn-journey btn-start"
            onClick={() => { playClick(); bgMusic.play(); setScreen('selection'); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Начать путешествие
          </motion.button>

          <footer className="welcome-footer">
            С любовью и заботой о твоём ментальном здоровье
          </footer>
        </div>
      );
    }

    /* --- SELECTION --- */
    if (screen === 'selection') {
      return (
        <div className="animate-fade-in selection-screen">
          <motion.div
            className="selection-glow"
            animate={{ backgroundColor: glowColor }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Mute Button */}
          <button className="btn-mute" onClick={() => { playClick(); toggleMute(); }} aria-label="Toggle mute">
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            )}
          </button>

          <header className="selection-header">
            <button className="btn-profile-toggle" onClick={() => { playClick(); setShowProfile(true); }} aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="btn-back" onClick={() => { playClick(); setScreen('welcome'); }}>
              ← Назад
            </button>
            <h2 className="section-title">Выбери проводника</h2>
            <p>Тот, кого ты выберешь, — это то, что ты сейчас ищешь</p>
          </header>

          {/* Navigation arrows */}
          <button
            className="swiper-nav-btn swiper-nav-prev"
            aria-label="Previous"
            onClick={() => { playClick(); swiperRef.current?.slidePrev(); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="swiper-nav-btn swiper-nav-next"
            aria-label="Next"
            onClick={() => { playClick(); swiperRef.current?.slideNext(); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.2}
            initialSlide={activeIndex}
            loop={true}
            coverflowEffect={{
              rotate: 40,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false
            }}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="char-carousel"
          >
            {characters.map((char) => (
              <SwiperSlide key={char.id}>
                {({ isActive }) => (
                  <motion.div
                    className={`char-card ${isActive ? 'card-active' : ''}`}
                    style={{ '--card-accent': char.color }}
                    onMouseMove={isActive ? handleCardMouseMove : undefined}
                    onMouseLeave={isActive ? handleCardMouseLeave : undefined}
                    animate={
                      isActive
                        ? {
                          rotateY: tilt.x * 3,
                          rotateX: tilt.y * -3,
                          transition: { duration: 0.3, ease: 'easeOut' }
                        }
                        : { rotateY: 0, rotateX: 0, transition: { duration: 0.4 } }
                    }
                  >
                    <motion.div
                      className="char-halo"
                      style={{ '--halo-color': char.color }}
                      animate={isActive ? { scale: [0.95, 1.05, 0.95] } : { scale: 0.7 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="char-image-wrap">
                      <motion.img
                        src={char.image}
                        alt={char.name}
                        className="char-image"
                        style={{ filter: `drop-shadow(0 6px 24px ${char.color}40)` }}
                        animate={
                          isActive
                            ? { y: [0, -8, 0], transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }
                            : { y: 0, scale: 0.9 }
                        }
                        initial={false}
                      />
                    </div>

                    <div className="char-info">
                      <span className="char-emoji" style={{ color: char.color }}>{char.emoji}</span>
                      <h3 className="char-name text-glow-soft" style={{ color: char.color }}>{char.name}</h3>
                      <div className="char-qualities">
                        {char.qualities.map((q, i) => (
                          <span key={i} className="char-quality">{q}</span>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            className="char-stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {char.stats.map((stat, i) => (
                              <div key={i} className="stat-row">
                                <div className="stat-header">
                                  <span className="stat-label">{stat.label}</span>
                                  <span className="stat-value" style={{ color: char.color }}>{stat.value}</span>
                                </div>
                                <div className="stat-bar-bg">
                                  {Array.from({ length: 10 }, (_, seg) => {
                                    const segMax = (seg + 1) * 10;
                                    const filled = segMax <= stat.value;
                                    return (
                                      <motion.div
                                        key={seg}
                                        className={`stat-segment ${filled ? 'stat-filled' : ''}`}
                                        style={{ '--seg-color': char.color }}
                                        initial={filled ? { opacity: 0, scaleX: 0 } : { opacity: 0.15 }}
                                        animate={filled ? {
                                          opacity: 1,
                                          scaleX: [0, 1],
                                          transition: { delay: i * 0.15 + seg * 0.03, duration: 0.2, ease: 'easeOut' }
                                        } : {}}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      className="btn-journey btn-select-journey"
                      onClick={() => { playClick(); handleSelect(char); }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ opacity: { duration: 0.3 } }}
                      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                    >
                      Выбрать
                    </motion.button>
                  </motion.div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Indicators */}
          <div className="carousel-indicators">
            {characters.map((char, i) => (
              <motion.div
                key={char.id}
                className={`indicator-dot ${i === activeIndex ? 'indicator-active' : ''}`}
                animate={{
                  backgroundColor: i === activeIndex ? char.color : 'rgba(255,255,255,0.1)',
                  scale: i === activeIndex ? 1.4 : 1,
                  boxShadow: i === activeIndex ? `0 0 8px ${char.color}` : 'none',
                }}
                transition={{ duration: 0.3 }}
                onClick={() => { playClick(); swiperRef.current?.slideTo(i); }}
              />
            ))}
          </div>
        </div>
      );
    }

    /* --- SELECTED --- */
    if (screen === 'selected' && selected) {
      const c = selected;
      return (
        <div className="animate-fade-in selected-screen">
          <div className="selected-container">
            <motion.div
              className="selected-checkmark-wrap"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="selected-checkmark" style={{ backgroundColor: c.color }}>✓</div>
            </motion.div>

            <motion.div
              className="selected-card"
              style={{ '--sel-color': c.color }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="selected-hero-wrap">
                <motion.img
                  src={c.image}
                  alt={c.name}
                  className="selected-hero-img"
                  style={{ filter: `drop-shadow(0 10px 30px ${c.color}40)` }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <h2 className="text-glow-soft" style={{ color: c.color }}>{c.emoji} {c.name}</h2>
              <p className="selected-quote">
                Ты выбрал своего проводника.
                Наше путешествие начинается...
              </p>
              <div className="selected-qualities">
                {c.qualities.map((q, i) => (
                  <span
                    key={i}
                    className="quality-pill"
                    style={{ backgroundColor: `${c.color}15`, color: c.color }}
                  >{q}</span>
                ))}
              </div>
            </motion.div>

            <motion.button
              className="btn-secondary btn-journey-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => { playClick(); setSelected(null); setScreen('selection'); localStorage.removeItem('chosenGuide'); }}
            >
              Выбрать другого проводника
            </motion.button>
          </div>
        </div>
      );
    }

    /* --- MAIN GAME (after intro dialogue) --- */
    if (screen === 'main_game' && selected) {
      const c = selected;
      return (
        <div className="animate-fade-in main-game-screen">
          {/* Pulsing background glow */}
          <motion.div
            className="main-game-glow"
            style={{ '--game-glow': c.color }}
            animate={{ opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Resource bar */}
          <div className="main-game-resources-bar">
            <div className="main-game-resource-pill">
              <span className="mg-resource-icon">💎</span>
              <span className="mg-resource-value">100</span>
            </div>
            <div className="main-game-resource-pill gold-res">
              <span className="mg-resource-icon">🪙</span>
              <span className="mg-resource-value">500</span>
            </div>
          </div>

          {/* Mute button visible on main game */}
          <button className="btn-mute" onClick={() => { playClick(); toggleMute(); }} aria-label="Toggle mute">
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            )}
          </button>

          <div className="main-game-container">
            <motion.div
              className="main-game-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src={c.image}
                alt={c.name}
                className="main-game-char-img"
                style={{ filter: `drop-shadow(0 0 40px ${c.color}44)` }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <h1 className="main-game-title" style={{ color: c.color }}>
                {c.emoji} {c.name}
              </h1>
              <p className="main-game-subtitle">
                Твой проводник рядом. Выбор сделан — путь начинается.
              </p>

              <div className="main-game-options">
                <motion.button
                  className="btn-journey btn-chapter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => { playClick(); }}
                >
                  ГЛАВА 1: НАЧАЛО ПУТИ
                </motion.button>

                <motion.button
                  className="btn-switch-guide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => { playClick(); setScreen('selection'); }}
                >
                  ← К выбору проводника
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return null;
  }; // end of renderCurrentScreen

  return (
    <>
      {/* Profile Overlay */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="profile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Close button */}
              <button
                className="profile-close-btn"
                onClick={() => { playClick(); setShowProfile(false); }}
                aria-label="Close profile"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Title */}
              <h2 className="profile-title">ПРОФИЛЬ</h2>

              {/* Resources */}
              <div className="profile-resources">
                <div className="profile-resource-pill crystals">
                  <span className="resource-icon">💎</span>
                  <span className="resource-value">100</span>
                </div>
                <div className="profile-resource-pill gold">
                  <span className="resource-icon">🪙</span>
                  <span className="resource-value">500</span>
                </div>
              </div>

              {/* Character avatar section */}
              <div
                className="profile-avatar-section"
                style={{ '--avatar-glow': pc?.color || '#FFD700' }}
              >
                <motion.div
                  className="profile-avatar-halo"
                  animate={{ scale: [0.92, 1.08, 0.92] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="profile-avatar-ring" />
                {pc?.image && (
                  <img
                    src={pc.image}
                    alt={pc.name}
                    className="profile-avatar-img"
                    style={{ filter: `drop-shadow(0 0 30px ${pc.color}88)` }}
                  />
                )}
                {pc?.emoji && !pc?.image && (
                  <div className="profile-avatar-img profile-avatar-placeholder">{pc.emoji}</div>
                )}
                <div className="profile-avatar-name" style={{ color: pc?.color }}>
                  {pc?.name || 'Странник'}
                </div>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                {[
                  { label: 'ПОКОЙ', icon: '🌙', value: 42 },
                  { label: 'ЭНЕРГИЯ', icon: '⚡', value: 68 },
                  { label: 'ОПЫТ', icon: '✨', value: 35 },
                ].map((stat, i) => (
                  <div key={i} className="profile-stat-row">
                    <div className="profile-stat-label">
                      <span className="profile-stat-icon">{stat.icon}</span>
                      <span>{stat.label}</span>
                    </div>
                    <div className="profile-stat-bar-wrap">
                      <div className="profile-stat-bar-bg">
                        <motion.div
                          className="profile-stat-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="profile-stat-value-val">{stat.value}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="profile-achievements">
                <h3 className="profile-achievements-title">ДОСТИЖЕНИЯ</h3>
                <div className="profile-achievements-grid">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="profile-achievement-slot">
                      <div className="profile-achievement-lock">🔒</div>
                      <span className="profile-achievement-label">???</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderCurrentScreen()}
    </>
  );
}

export default App;
