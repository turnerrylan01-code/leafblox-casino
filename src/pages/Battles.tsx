import { useState } from 'react';
import { Link, useParams, Outlet } from 'react-router-dom';
import './Battles.css';

interface Game {
  _id: string;
  state: string;
  mode: string;
  playerCount: number;
  amount: number;
  options: {
    funding: number;
    cursed: boolean;
    terminal: boolean;
    levelMin: number;
    private: boolean;
  };
  boxes: Array<{ box: Box; count: number }>;
  bets: Array<{
    slot: number;
    user?: { avatar: string; level: number; rank: string; _id: string };
    bot?: boolean;
    payout?: number;
  }>;
  createdAt: string;
}

interface Box {
  _id: string;
  name: string;
  amount: number;
  image: string;
}

export function BattlesPage() {
  const [filterSort, setFilterSort] = useState('price');
  const [selectedBoxes, setSelectedBoxes] = useState<Box[]>([]);
  const [filterMode, setFilterMode] = useState('1v1');
  const [filterType, setFilterType] = useState('standard');
  const [filterLevel, setFilterLevel] = useState(0);
  const [filterFunding, setFilterFunding] = useState(0);
  const [filterPrivate, setFilterPrivate] = useState(false);
  const [filterAffiliate, setFilterAffiliate] = useState(false);
  const [filterCursed, setFilterCursed] = useState(false);
  const [filterTerminal, setFilterTerminal] = useState(false);
  const { gameId } = useParams();

  const boxes: Box[] = [
    { _id: '1', name: 'Elite Case', amount: 1000, image: '📦' },
    { _id: '2', name: 'Premium Case', amount: 5000, image: '🎁' },
    { _id: '3', name: 'Legendary Case', amount: 10000, image: '💎' },
    { _id: '4', name: 'Rare Case', amount: 2500, image: '⭐' },
    { _id: '5', name: 'Common Case', amount: 500, image: '📋' },
  ];

  const games: Game[] = [
    {
      _id: '1',
      state: 'rolling',
      mode: '1v1',
      playerCount: 2,
      amount: 50000,
      options: { funding: 5, cursed: false, terminal: false, levelMin: 0, private: false },
      boxes: [{ box: boxes[0], count: 5 }],
      bets: [
        { slot: 0, user: { avatar: '👤', level: 25, rank: 'user', _id: '1' } },
        { slot: 1, bot: true },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      state: 'completed',
      mode: '2v2',
      playerCount: 4,
      amount: 100000,
      options: { funding: 10, cursed: true, terminal: false, levelMin: 10, private: false },
      boxes: [{ box: boxes[1], count: 10 }],
      bets: [
        { slot: 0, user: { avatar: '👤', level: 50, rank: 'partner', _id: '2' }, payout: 75000 },
        { slot: 1, user: { avatar: '👤', level: 30, rank: 'user', _id: '3' } },
        { slot: 2, bot: true },
        { slot: 3, bot: true },
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const formatValue = (value: number): string => {
    return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getFilteredGames = () => {
    let filtered = [...games];
    if (filterSort === 'price') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return filtered;
  };

  const getTotalAmount = () => {
    return games.reduce((sum, game) => sum + game.amount, 0);
  };

  const getPlayerCount = () => {
    let count = 2;
    if (filterMode === '2v2' || filterMode === '1v1v1v1') count = 4;
    else if (filterMode === '1v1v1') count = 3;
    return count;
  };

  const getCost = () => {
    let cost = selectedBoxes.reduce((sum, box) => sum + box.amount, 0);
    cost = Math.floor(cost + (cost * getPlayerCount() * filterFunding / 100));
    return cost;
  };

  const getMode = (game: Game) => {
    if (game.mode === 'group') return 'Group';
    if (game.mode === 'team') return '2v2';
    if (game.playerCount === 3) return '1v1v1';
    if (game.playerCount === 4) return '1v1v1v1';
    return '1v1';
  };

  const getOption = (game: Game) => {
    if (game.options.cursed && !game.options.terminal) return 'CURSED';
    if (!game.options.cursed && game.options.terminal) return 'TERMINAL';
    return '';
  };

  const getBets = (game: Game) => {
    const bets = [];
    for (let bet = 0; bet < game.playerCount; bet++) {
      const index = game.bets.findIndex((element) => element.slot === bet);
      bets.push(index !== -1 ? game.bets[index] : null);
    }
    return bets;
  };

  const getLevelColor = (level: number) => {
    if (level >= 2 && level < 26) return 'blue';
    if (level >= 26 && level < 51) return 'green';
    if (level >= 51 && level < 76) return 'orange';
    if (level >= 76 && level < 100) return 'red';
    if (level >= 100) return 'purple';
    return '';
  };

  const handleBoxAdd = (box: Box) => {
    setSelectedBoxes([...selectedBoxes, box]);
  };

  const handleBoxRemove = (boxId: string) => {
    setSelectedBoxes(selectedBoxes.filter((b) => b._id !== boxId));
  };

  if (gameId) {
    const currentGame = games.find((g) => g._id === gameId);
    return (
      <div className="battles">
        <div className="battles-header">
          <div className="battles-header-game">
            <Link to="/battles" className="link-back">
              <div className="link-inner">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.519893 4.88899C-0.173298 5.40596 -0.173297 6.69838 0.519893 7.21535L5.97877 11.2865C6.67196 11.8035 7.53845 11.1573 7.53845 10.1233V9.06113H14V3.04304H7.53845V1.98103C7.53845 0.947086 6.67196 0.300873 5.97877 0.817844L0.519893 4.88899Z" fill="#557b9b"/>
                </svg>
                GO BACK
              </div>
            </Link>
            <div className="game-cost">
              TOTAL BATTLE COST
              <div className="cost-amount">
                <span className="coin-icon">💰</span>
                <div className="amount-value">
                  <span>{formatValue(currentGame?.amount || 0).split('.')[0]}</span>.{formatValue(currentGame?.amount || 0).split('.')[1]}
                </div>
              </div>
            </div>
            <div className="game-info">
              <div className="info-text">{currentGame?.state === 'completed' ? 'Game Ended' : 'Waiting to start...'}</div>
              <div className="info-cases">
                <div className="cases-list">
                  {currentGame?.boxes.map((b, i) => (
                    <div key={i} className="case-item">
                      <span className="case-emoji">{b.box.image}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="game-right">
              <div className="right-info">
                {currentGame?.options.cursed && <span className="info-option">CURSED MODE</span>}
                {currentGame?.options.terminal && <span className="info-option">TERMINAL MODE</span>}
                STANDARD
              </div>
              <div className="right-actions">
                <button className="button-fair">
                  <div className="button-inner">FAIRNESS</div>
                </button>
                <button className="button-sound">
                  <div className="button-inner">🔊</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="battles-content">
          <div className="battles-game">
            <div className="game-content">
              <div className="game-spinner">
                <div className="spinner-placeholder">SPINNER</div>
              </div>
              <div className="content-bets">
                {currentGame && getBets(currentGame).map((bet, index) => (
                  <div key={index} className="bet-element">
                    <div className="bet-user">
                      {bet?.user ? (
                        <div className={`user-avatar user-${getLevelColor(bet.user.level)}`}>
                          {bet.user.avatar}
                        </div>
                      ) : (
                        <div className="user-avatar user-empty">⏳</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="battles">
      <div className="battles-header">
        <div className="battles-header-overview">
          <div className="overview-title">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261Z" fill="white"/>
              <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261Z" fill="url(#icon-battles-gradient)"/>
              <defs>
                <linearGradient id="icon-battles-gradient" x1="60.7566" y1="-0.804659" x2="8.70414" y2="31.7497" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFC2"/>
                  <stop offset="1" stopColor="#00AA6D"/>
                </linearGradient>
              </defs>
            </svg>
            BATTLES LOBBY
          </div>
          <div className="overview-info">
            <div className="info-amount">
              <div className="amount-container">
                <div className="container-inner">
                  <span className="coin-icon">💰</span>
                  <div className="inner-value">
                    <span>{formatValue(getTotalAmount()).split('.')[0]}</span>.{formatValue(getTotalAmount()).split('.')[1]}
                  </div>
                </div>
              </div>
            </div>
            <div className="info-count">
              <span>{games.length}</span> BATTLES
            </div>
            <div className="info-sort">
              <button onClick={() => setFilterSort(filterSort === 'price' ? 'date' : 'price')} className="sort-button">
                {filterSort === 'price' ? 'HIGHEST' : 'NEWEST'}
              </button>
            </div>
          </div>
          <Link to="/battles/create" className="link-create">
            <div className="link-inner">
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.47861 7.85824L6.15342 10.5285L5.08395 11.5963L6.15493 12.6649L5.08471 13.7327L3.21144 11.8636L1.07023 14L0 12.9322L2.14121 10.7951L0.267935 8.9268L1.33816 7.859L2.40839 8.92605L3.47861 7.85824Z" fill="white"/>
              </svg>
              CREATE
            </div>
          </Link>
        </div>
      </div>
      <div className="battles-content">
        <div className="battles-overview">
          <div className="overview-header">
            <div className="header-players">PLAYERS</div>
            <div className="header-cases">CASES</div>
            <div className="header-right">
              <div className="right-amount">AMOUNT</div>
              <div className="right-action">ACTION</div>
            </div>
          </div>
          <div className="overview-content">
            <div className="content-list">
              {getFilteredGames().map((game) => (
                <div key={game._id} className={`battles-game-element element-${game.state} ${game.options.cursed ? 'element-cursed' : ''} ${game.options.terminal ? 'element-terminal' : ''}`}>
                  <div className="element-inner">
                    <div className="inner-info">
                      <div className="info-type">
                        <div className="type-inner">
                          <span>{getMode(game)}</span>
                        </div>
                      </div>
                      {(game.options.cursed || game.options.terminal) && (
                        <div className="info-option">
                          <div className="option-inner">
                            <span>{getOption(game)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="inner-players">
                      {getBets(game).map((bet, index) => (
                        <div key={index} className="players-element">
                          <div className={`element-user ${bet?.user ? `user-${getLevelColor(bet.user.level)}` : 'user-empty'} ${game.state === 'completed' && bet?.payout && bet.payout > 0 ? 'user-winner' : ''}`}>
                            {bet?.user ? bet.user.avatar : '⏳'}
                          </div>
                          {index < game.playerCount - 1 && (game.mode !== 'team' || index === 1) && (
                            <div className="element-separator">
                              <div className="separator-inner">VS</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="inner-cases">
                      <div className="cases-list">
                        {game.boxes.map((b, i) => (
                          <div key={i} className="case-item">
                            <span className="case-emoji">{b.box.image}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="inner-right">
                      <div className="right-amount">
                        <div className="amount-inner">
                          <div className="inner-effective">
                            <span className="coin-icon">💰</span>
                            <div className="effective-value">
                              <span>{formatValue(game.amount - Math.floor(game.amount * game.options.funding / 100)).split('.')[0]}</span>.{formatValue(game.amount - Math.floor(game.amount * game.options.funding / 100)).split('.')[1]}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="right-separator"></div>
                      <div className="right-action">
                        <Link to={`/battles/${game._id}`} className="link-view">
                          <div className="link-inner">
                            <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.8581 4.63847C18.6885 4.44929 14.6093 0 9.49998 0C4.39071 0 0.311514 4.44929 0.141887 4.63847C-0.0472957 4.84992 -0.0472957 5.16958 0.141887 5.38103C0.311514 5.57021 4.39078 10.0195 9.49998 10.0195C14.6092 10.0195 18.6885 5.57021 18.8581 5.38103C19.0472 5.16958 19.0472 4.84992 18.8581 4.63847Z" fill="#5e768e"/>
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
