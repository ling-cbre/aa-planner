const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CHILDREN = [
  { key: 'aurora', name: 'Aurora', short: 'Aur' },
  { key: 'anderson', name: 'Anderson', short: 'And' }
];
const DAILY_LISTS = [
  {
    key: 'homework',
    label: 'Homework List',
    items: [
      { icon: '📘', title: 'Singarpore Math' },
      { icon: '➗', title: 'Basic Math (x, y; fraction)' },
      { icon: '🎹', title: 'Piano Part 1 (30 mins)', stars: 0.5 },
      { icon: '🎼', title: 'Piano Part 2 (30 mins)', stars: 0.5 },
      { icon: '💃', title: 'Dance (30 mins)' },
      { icon: '🏫', title: 'School HW' },
      { icon: '📝', title: 'Grammar' },
      { icon: '🔬', title: 'Science' },
      { icon: '✍️', title: 'Writing' }
    ]
  },
  {
    key: 'chores',
    label: 'Planner List',
    items: [
      { icon: '🛏️', title: 'Make your bed' },
      { icon: '🍽️', title: 'Do the dishes' },
      { icon: '🪑', title: 'Tidy up your room' },
      { icon: '🐾', title: 'Feed the pets' },
      { icon: '🌿', title: 'Water the plants' },
      { icon: '🧤', title: 'Put away clean clothes' }
    ]
  }
];

const chores = WEEK_DAYS.flatMap(day =>
  DAILY_LISTS.flatMap(list =>
    list.items.map((item, index) => ({
      ...item,
      day,
      category: list.key,
      categoryLabel: list.label,
      id: `${day}-${list.key}-${index}`
    }))
  )
);

const prizes = [
  { icon: '🛍️', title: 'Shopping Spree',            desc: 'Pick something special from the store!', cost: 80 },
  { icon: '👯', title: 'Playdate',                  desc: 'Invite your best friend over!', cost: 60 },
  { icon: '🎁', title: 'Mystery Prize Box',         desc: 'A surprise gift chosen just for you!', cost: 60 },
  { icon: '🎮', title: 'Extra Game Time',           desc: '30 mins extra screen time!', cost: 30 },
  { icon: '📺', title: 'TV Night',                  desc: '45 minutes of TV time!', cost: 30 },
  { icon: '🍕', title: 'Pick Dinner Tonight',       desc: 'You choose what the family eats!', cost: 20 },
  { icon: '🎬', title: 'Movie Night',               desc: 'Pick any movie & enjoy snacks!', cost: 35 },
  { icon: '🍦', title: 'Ice Cream Trip',            desc: 'Head out for your fave ice cream!', cost: 25 },
  { icon: '📚', title: 'New Book',                  desc: 'Pick any book you want to read!', cost: 35 },
  { icon: '🍿', title: 'Cinema Trip',               desc: 'See a new movie at the theater!', cost: 80 },
  { icon: '🧵', title: '3D Printer Filament',       desc: 'Pick a new filament color for printing!', cost: 10 },
  { icon: '🌮', title: 'Favorite Restaurant',       desc: 'Dinner at your favorite restaurant!', cost: 40 },
  { icon: '🎲', title: 'Game Night Extravaganza',  desc: 'Epic game night with all your fave games!', cost: 50 },
  { icon: '🧩', title: 'New Board Game',            desc: 'Pick any new board game you want!', cost: 50 },
  { icon: '🎮', title: 'New Video Game',            desc: 'Pick any video game you want!', cost: 60 },
  { icon: '🎀', title: 'Dream Outfit',              desc: 'Pick a brand-new outfit you love!', cost: 80 },
];

const OOPSIES_ITEMS = [
  { key: 'grumpy', icon: '🗣️', title: 'Screaming / Being Grumpy', penalty: 1 },
  { key: 'bad-word', icon: '🤬', title: 'Saying a Bad Word', penalty: 1 },
  { key: 'dragging-feet', icon: '🐢', title: 'Dragging Your Feet', penalty: 1 },
  { key: 'late-bed', icon: '🌙', title: 'Going to Bed Late', penalty: 1 },
  { key: 'teeth', icon: '🪥', title: 'Not Brushing Teeth', penalty: 1 },
  { key: 'cleanup', icon: '🧹', title: 'Not Cleaning Up', penalty: 1 },
  { key: 'siblings', icon: '💢', title: 'Fighting with Siblings', penalty: 1 },
  { key: 'snacks', icon: '🍪', title: 'Sneak some Snacks', penalty: 1 },
  { key: 'ipad', icon: '📱', title: 'Sneaking Playing iPad', penalty: 1 }
];

const bigPrizes = [
  { icon: '🛝', title: 'Fun Day Out',              desc: 'Trip to the park, trampoline park, or more!', cost: 150 },
  { icon: '💅', title: 'Spa Night',                desc: 'Nails, face mask & relaxing evening!', cost: 150 },
  { icon: '💄', title: 'Makeover Day',             desc: 'Hair, nails, makeup — the full works!', cost: 180 },
  { icon: '🎠', title: 'Amusement Park Trip',      desc: 'A fun day at the amusement park!', cost: 200 },
  { icon: '🎪', title: 'Sleepover Party',          desc: 'Host a sleepover with your besties!', cost: 200 },
  { icon: '🎟️', title: 'Concert or Show',         desc: 'Tickets to a live concert or show!', cost: 300 },
  { icon: '🧳', title: 'Overnight Trip',          desc: 'A fun overnight trip somewhere cool!', cost: 500 },
];

const PRIZE_COST     = 5;
const BIG_PRIZE_COST = 20;

function getBigPrizeCost(prize) {
  return prize.cost || BIG_PRIZE_COST;
}

let stars          = 0;
let spendableStars = 0;
let savedStars     = 0;  // stars being saved toward big prize
let doneCount      = 0;
let milestoneShown = false;
let currentChoreView = 'weekly';
let selectedDay = getTodayWeekday();
let doneChoreIdsByChild = createEmptyDoneMap();
let doneOopsiesIdsByChild = createEmptyDoneMap();
let viewedWeekOffset = 0;
let activeRewardChild = 'aurora';
let childRewardState = createEmptyRewardState();
let pendingDayScroll = false;

function createEmptyDoneMap() {
  return Object.fromEntries(CHILDREN.map(child => [child.key, new Set()]));
}

function createEmptyRewardState() {
  return Object.fromEntries(CHILDREN.map(child => [child.key, { spendable: 0, saved: 0 }]));
}

function createEmptyHistoryChildMap() {
  return Object.fromEntries(CHILDREN.map(child => [child.key, 0]));
}

function normalizePoints(value) {
  return Math.round(value * 2) / 2;
}

function formatPoints(value) {
  const normalized = normalizePoints(value);
  return Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(1);
}

function formatPointLabel(value) {
  const normalized = normalizePoints(value);
  return `${formatPoints(normalized)} star${normalized === 1 ? '' : 's'}`;
}

function isMultipleOf(value, step) {
  return Math.abs(value / step - Math.round(value / step)) < 0.000001;
}

function getChoreWorth(chore) {
  return chore.stars || 1;
}

function getDoneSet(childKey) {
  return doneChoreIdsByChild[childKey];
}

function isChildDone(choreId, childKey) {
  return getDoneSet(childKey).has(choreId);
}

function getOopsiesDoneSet(childKey) {
  return doneOopsiesIdsByChild[childKey];
}

function isOopsiesDone(oopsiesId, childKey) {
  return getOopsiesDoneSet(childKey).has(oopsiesId);
}

function countOopsiesDoneForDay(childKey, dayNameOrDate) {
  const doneSet = getOopsiesDoneSet(childKey);
  let count = 0;
  
  // Determine the day name - either it's already a day name or convert from date
  let dayName = dayNameOrDate;
  if (dayNameOrDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // It's a date string like "2026-08-09", convert to day name
    const date = new Date(dayNameOrDate + 'T00:00:00');
    const weekdayIndex = date.getUTCDay();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayName = weekdays[weekdayIndex];
  }
  
  doneSet.forEach(oopsiesId => {
    if (oopsiesId.startsWith(dayName + '-')) count++;
  });
  return count;
}

function countWeekOopsies(childKey, weekStart) {
  let totalOopsies = 0;
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + i);
    const dayStr = dayDate.toISOString().slice(0, 10);
    totalOopsies += countOopsiesDoneForDay(childKey, dayStr);
  }
  return totalOopsies;
}

function getChildRewardState(childKey) {
  return childRewardState[childKey];
}

function getChildAvailableStars(childKey) {
  const childState = getChildRewardState(childKey);
  return normalizePoints(childState.spendable + childState.saved);
}

function syncAggregateRewardState() {
  spendableStars = normalizePoints(CHILDREN.reduce((sum, child) => sum + getChildRewardState(child.key).spendable, 0));
  savedStars = normalizePoints(CHILDREN.reduce((sum, child) => sum + getChildRewardState(child.key).saved, 0));
  stars = normalizePoints(spendableStars + savedStars);
}

function adjustChildReward(childKey, delta) {
  const childState = getChildRewardState(childKey);
  const before = getChildAvailableStars(childKey);

  if (delta >= 0) {
    childState.spendable = normalizePoints(childState.spendable + delta);
    syncAggregateRewardState();
    return normalizePoints(getChildAvailableStars(childKey) - before);
  }

  let remaining = Math.abs(delta);
  const spendableReduction = Math.min(childState.spendable, remaining);
  childState.spendable = normalizePoints(childState.spendable - spendableReduction);
  remaining = normalizePoints(remaining - spendableReduction);

  if (remaining > 0) {
    const savedReduction = Math.min(childState.saved, remaining);
    childState.saved = normalizePoints(childState.saved - savedReduction);
  }

  syncAggregateRewardState();
  return normalizePoints(getChildAvailableStars(childKey) - before);
}

function getChildSummary(childKey, choreList = chores) {
  const doneSet = getDoneSet(childKey);
  const completedItems = choreList.filter(chore => doneSet.has(chore.id)).length;
  const points = normalizePoints(
    choreList.reduce((sum, chore) => sum + (doneSet.has(chore.id) ? getChoreWorth(chore) : 0), 0)
  );

  return {
    completedItems,
    totalItems: choreList.length,
    points
  };
}

function getFamilySummary() {
  return CHILDREN.map(child => ({
    ...child,
    ...getChildSummary(child.key)
  }));
}

function renderRewardChildSwitch(containerId, selectedChildKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = CHILDREN.map(child => {
    const childState = getChildRewardState(child.key);
    let value = childState.spendable;
    let label = 'ready';

    if (containerId === 'big-prize-child-switch') {
      value = childState.saved;
      label = 'saved';
    } else if (containerId === 'penalty-child-switch') {
      value = countOopsiesDoneForDay(child.key, selectedDay);
      label = 'Oopsies';
    }

    // For rewards shop, show "ready" when value >= 10, otherwise show the number
    let displayText;
    if (containerId !== 'big-prize-child-switch' && containerId !== 'penalty-child-switch' && value >= 10) {
      displayText = `${child.name} • ✅ ready`;
    } else {
      displayText = `${child.name} • ${value} ${containerId === 'penalty-child-switch' ? '⚠️' : '⭐'} ${label}`;
    }

    return `
      <button type="button" class="reward-child-btn${child.key === selectedChildKey ? ' active' : ''}" data-child="${child.key}">
        ${displayText}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.reward-child-btn').forEach(button => {
    button.addEventListener('click', () => {
      activeRewardChild = button.dataset.child;
      refreshRewardViews();
      if (containerId === 'prize-child-switch' || containerId === 'big-prize-child-switch') {
        buildPrizes();
        buildBigPrizes();
      }
      if (containerId === 'penalty-child-switch') buildPenalties();
    });
  });
}

function refreshRewardViews() {
  const activeChild = CHILDREN.find(child => child.key === activeRewardChild) || CHILDREN[0];
  const activeState = getChildRewardState(activeChild.key);
  document.getElementById('milestone-child-name').textContent = activeChild.name;
  document.getElementById('milestone-child-stars').textContent = formatPoints(activeState.spendable);
  renderRewardChildSwitch('milestone-child-switch', activeChild.key);
  renderRewardChildSwitch('prize-child-switch', activeChild.key);
  renderRewardChildSwitch('big-prize-child-switch', activeChild.key);
}

// ── Big Prize Claiming (once per child) ────────────────────────
function getClaimedBigPrizes() {
  const stored = localStorage.getItem('claimedBigPrizes');
  return stored ? JSON.parse(stored) : {};
}

function hasClaimedBigPrize(childKey, prizeTitle) {
  const claimed = getClaimedBigPrizes();
  const childClaimed = claimed[childKey] || [];
  return childClaimed.includes(prizeTitle);
}

function recordBigPrizeClaim(prizeTitle, childKey) {
  const claimed = getClaimedBigPrizes();
  if (!claimed[childKey]) {
    claimed[childKey] = [];
  }
  if (!claimed[childKey].includes(prizeTitle)) {
    claimed[childKey].push(prizeTitle);
  }
  localStorage.setItem('claimedBigPrizes', JSON.stringify(claimed));
}

// ── Persistence ───────────────────────────────────────────────
function saveState() {
  syncAggregateRewardState();
  localStorage.setItem('choreStars',     stars);
  localStorage.setItem('choreSpendable', spendableStars);
  localStorage.setItem('choreSaved',     savedStars);
  localStorage.setItem('choreRewardsByChild', JSON.stringify(childRewardState));
  localStorage.setItem('choreDoneByChild', JSON.stringify(
    Object.fromEntries(CHILDREN.map(child => [child.key, [...getDoneSet(child.key)]]))
  ));
  localStorage.setItem('choreOopsiesByChild', JSON.stringify(
    Object.fromEntries(CHILDREN.map(child => [child.key, [...getOopsiesDoneSet(child.key)]]))
  ));
}

// ── Star display ──────────────────────────────────────────────
function updateStarDisplay() {
  syncAggregateRewardState();
  document.getElementById('star-display').textContent = CHILDREN.map(child => {
    const childState = getChildRewardState(child.key);
    return `${child.name}: ⭐ ${formatPoints(childState.spendable)}`;
  }).join('   |   ');
}

// ── Page switching ────────────────────────────────────────────
function showPage(page) {
  document.getElementById('chore-page').style.display     = page === 'chore'     ? '' : 'none';
  document.getElementById('prize-page').style.display     = page === 'prize'     ? '' : 'none';
  document.getElementById('penalty-page').style.display   = page === 'penalty'   ? '' : 'none';
  document.getElementById('dashboard-page').style.display = page === 'dashboard' ? '' : 'none';
  document.getElementById('report-page').style.display    = page === 'report'    ? '' : 'none';

  // Darker header text on prize page
  document.getElementById('star-display').style.color = page === 'prize' ? '#4a0e6e' : '#6c3483';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  if (page === 'prize') {
    buildPrizes();
    buildBigPrizes();
  }
  if (page === 'penalty') buildPenalties();
  if (page === 'dashboard') buildDashboard();
  if (page === 'report') buildReport();
}

// ── Points history (for dashboard) ─────────────────────────────
function getHistory() {
  return JSON.parse(localStorage.getItem('choreHistory') || '[]');
}

function getPenaltyHistory() {
  return JSON.parse(localStorage.getItem('chorePenaltyHistory') || '[]');
}

function getHistoryEntryChildTotals(entry) {
  const byChild = createEmptyHistoryChildMap();

  if (entry && entry.byChild && typeof entry.byChild === 'object') {
    CHILDREN.forEach(child => {
      byChild[child.key] = normalizePoints(parseFloat(entry.byChild[child.key] || '0'));
    });
    return byChild;
  }

  byChild.aurora = normalizePoints(parseFloat((entry && entry.stars) || '0'));
  return byChild;
}

function getHistoryEntryTotal(entry) {
  const byChild = getHistoryEntryChildTotals(entry);
  return normalizePoints(CHILDREN.reduce((sum, child) => sum + byChild[child.key], 0));
}

function recordEarnedStars(amount, childKey) {
  if (!amount || !childKey) return;
  const history = getHistory();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const entry = history.find(h => h.date === today);

  if (entry) {
    const byChild = getHistoryEntryChildTotals(entry);
    byChild[childKey] = normalizePoints(byChild[childKey] + amount);
    entry.byChild = byChild;
    entry.stars = normalizePoints(CHILDREN.reduce((sum, child) => sum + byChild[child.key], 0));
  } else {
    const byChild = createEmptyHistoryChildMap();
    byChild[childKey] = normalizePoints(amount);
    history.push({
      date: today,
      stars: normalizePoints(amount),
      byChild
    });
  }
  localStorage.setItem('choreHistory', JSON.stringify(history));
}

function recordPenalty(amount, childKey) {
  if (!amount || !childKey) return;
  const history = getPenaltyHistory();
  const today = new Date().toISOString().slice(0, 10);
  const entry = history.find(item => item.date === today);

  if (entry) {
    const byChild = getHistoryEntryChildTotals(entry);
    byChild[childKey] = normalizePoints(byChild[childKey] + amount);
    entry.byChild = byChild;
    entry.stars = normalizePoints(CHILDREN.reduce((sum, child) => sum + byChild[child.key], 0));
  } else {
    const byChild = createEmptyHistoryChildMap();
    byChild[childKey] = normalizePoints(amount);
    history.push({
      date: today,
      stars: normalizePoints(amount),
      byChild
    });
  }

  localStorage.setItem('chorePenaltyHistory', JSON.stringify(history));
}

function getEarnedItemsHistory() {
  return JSON.parse(localStorage.getItem('earnedItemsHistory') || '[]');
}

function recordEarnedItem(choreTitle, childKey, starsEarned, dayOfWeek, weekOffset) {
  if (!choreTitle || !childKey || !starsEarned) return;
  
  const weekDates = getCurrentWeekDates(weekOffset);
  const itemDate = weekDates[dayOfWeek]?.date || new Date().toISOString().slice(0, 10);
  
  const history = getEarnedItemsHistory();
  const item = {
    date: itemDate,
    child: childKey,
    item: choreTitle,
    stars: starsEarned
  };
  history.push(item);
  localStorage.setItem('earnedItemsHistory', JSON.stringify(history));
}

function getRewardClaimsHistory() {
  return JSON.parse(localStorage.getItem('rewardClaimsHistory') || '[]');
}

function recordRewardClaim(prizeTitle, prizeType, cost, childKey, startingPoints) {
  const claims = getRewardClaimsHistory();
  const today = new Date().toISOString().slice(0, 10);
  const claim = {
    date: today,
    child: childKey,
    reward: prizeTitle,
    type: prizeType,
    startingPoints: startingPoints || 0,
    cost: cost,
    endingPoints: normalizePoints((startingPoints || 0) - cost)
  };
  claims.push(claim);
  localStorage.setItem('rewardClaimsHistory', JSON.stringify(claims));
}

// Returns Monday (start of week) for a given date, as YYYY-MM-DD
function startOfWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function formatWeekLabel(weekStart) {
  return new Date(weekStart + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatShortWeekLabel(weekStart) {
  return new Date(weekStart + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

function getCurrentWeekDates() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const weekStart = startOfWeek(todayStr);
  const monday = new Date(weekStart + 'T00:00:00');
  monday.setDate(monday.getDate() + viewedWeekOffset * 7);

  return Object.fromEntries(
    WEEK_DAYS.map((day, index) => {
      const current = new Date(monday);
      current.setDate(monday.getDate() + index);
      return [day, {
        iso: current.toISOString().slice(0, 10),
        shortLabel: current.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        compactLabel: current.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
      }];
    })
  );
}

function formatPlannerWeekRange(weekDates) {
  const start = weekDates[WEEK_DAYS[0]].iso;
  const end = weekDates[WEEK_DAYS[WEEK_DAYS.length - 1]].iso;
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');

  const startLabel = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endLabel = endDate.toLocaleDateString(undefined, {
    month: startDate.getFullYear() === endDate.getFullYear() ? undefined : 'short',
    day: 'numeric',
    year: startDate.getFullYear() === endDate.getFullYear() ? undefined : 'numeric'
  });

  return `${startLabel} - ${endLabel}`;
}

function buildWeeklyEntries(history, penaltyHistory = []) {
  const weekMap = {};
  [...history, ...penaltyHistory].forEach(entry => {
    const weekStart = startOfWeek(entry.date);
    const byChild = getHistoryEntryChildTotals(entry);
    if (!weekMap[weekStart]) {
      weekMap[weekStart] = {
        byChild: createEmptyHistoryChildMap(),
        total: 0
      };
    }

    CHILDREN.forEach(child => {
      weekMap[weekStart].byChild[child.key] = normalizePoints(
        weekMap[weekStart].byChild[child.key] + byChild[child.key]
      );
    });
    weekMap[weekStart].total = normalizePoints(
      CHILDREN.reduce((sum, child) => sum + weekMap[weekStart].byChild[child.key], 0)
    );
  });

  return Object.keys(weekMap)
    .sort((a, b) => a.localeCompare(b))
    .map(weekStart => ({
      weekStart,
      byChild: weekMap[weekStart].byChild,
      total: weekMap[weekStart].total,
      label: formatWeekLabel(weekStart),
      shortLabel: formatShortWeekLabel(weekStart)
    }));
}

function buildDailyEntries(weekStart) {
  const monday = new Date(weekStart + 'T00:00:00');
  const choreGroups = getChoreGroups();
  const penaltyHistory = getPenaltyHistory();

  return WEEK_DAYS.map((day, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    const isoDate = current.toISOString().slice(0, 10);
    const dayChores = choreGroups[day] || [];
    const byChild = Object.fromEntries(
      CHILDREN.map(child => [child.key, getChildSummary(child.key, dayChores).points])
    );
    const oopsiesByChild = Object.fromEntries(
      CHILDREN.map(child => [child.key, countOopsiesDoneForDay(child.key, isoDate)])
    );

    penaltyHistory
      .filter(entry => entry.date === isoDate)
      .forEach(entry => {
        const penaltyByChild = getHistoryEntryChildTotals(entry);
        CHILDREN.forEach(child => {
          byChild[child.key] = normalizePoints(byChild[child.key] + penaltyByChild[child.key]);
        });
      });

    return {
      date: isoDate,
      dayLabel: day.slice(0, 3),
      byChild,
      oopsiesByChild,
      total: normalizePoints(CHILDREN.reduce((sum, child) => sum + byChild[child.key], 0)),
      totalOopsies: normalizePoints(CHILDREN.reduce((sum, child) => sum + oopsiesByChild[child.key], 0))
    };
  });
}

function renderDailyBarChart(dailyEntries, currentDate) {
  const chart = document.getElementById('weekly-bar-chart');
  chart.innerHTML = '';

  if (dailyEntries.every(entry => entry.total <= 0 && entry.totalOopsies <= 0)) {
    chart.innerHTML = '<div class="chart-empty">No daily activity yet this week.</div>';
    return;
  }

  const maxChildTotal = Math.max(
    ...dailyEntries.flatMap(entry => CHILDREN.map(child => entry.byChild[child.key])),
    1
  );

  dailyEntries.forEach(entry => {
    const column = document.createElement('div');
    column.className = `bar-column${entry.date === currentDate ? ' current' : ''}`;
    const starsText = entry.total > 0 ? `Aurora ⭐${formatPoints(entry.byChild.aurora)}, Anderson ⭐${formatPoints(entry.byChild.anderson)}` : 'No stars';
    const oopsiesText = entry.totalOopsies > 0 ? `Aurora ⚠️${formatPoints(entry.oopsiesByChild.aurora)}, Anderson ⚠️${formatPoints(entry.oopsiesByChild.anderson)}` : 'No oopsies';
    column.title = `${entry.dayLabel}: ${starsText} | ${oopsiesText}`;

    column.innerHTML = `
      <div class="bar-value">⭐ ${formatPoints(entry.total)}${entry.totalOopsies > 0 ? ` / ⚠️ ${formatPoints(entry.totalOopsies)}` : ''}</div>
      <div class="bar-track-group">
        ${CHILDREN.map(child => {
          const childTotal = entry.byChild[child.key];
          const height = `${Math.max((childTotal / maxChildTotal) * 100, childTotal > 0 ? 10 : 0)}%`;
          return `
            <div class="mini-bar-track ${child.key}">
              <div class="mini-bar-fill" style="height:${height};"></div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="bar-label">${entry.dayLabel}</div>
    `;

    chart.appendChild(column);
  });
}

function renderWeeklyPieChart(weekByChild, oopsiesByChild = {}) {
  const pieChart = document.getElementById('weekly-pie-chart');
  const legend = document.getElementById('weekly-pie-legend');
  const totalLabel = document.getElementById('weekly-pie-total');
  const childColors = {
    aurora: '#6c3483',
    anderson: '#89d4f5'
  };

  legend.innerHTML = '';

  const grandTotal = normalizePoints(CHILDREN.reduce((sum, child) => sum + weekByChild[child.key], 0));

  if (grandTotal <= 0) {
    pieChart.style.background = 'linear-gradient(135deg, #f3eef8, #fbf7ff)';
    pieChart.classList.add('empty');
    totalLabel.textContent = '0';
    legend.innerHTML = '<li class="chart-empty">No weekly stars yet.</li>';
    return;
  }

  totalLabel.textContent = formatPoints(grandTotal);
  pieChart.classList.remove('empty');

  let currentStop = 0;
  const segments = CHILDREN
    .filter(child => weekByChild[child.key] > 0)
    .map(child => {
      const portion = (weekByChild[child.key] / grandTotal) * 100;
      const color = childColors[child.key];
      const start = currentStop;
      const end = currentStop + portion;
      currentStop = end;
      return `${color} ${start}% ${end}%`;
    });

  pieChart.style.background = `conic-gradient(${segments.join(', ')})`;

  CHILDREN.forEach(child => {
    const points = weekByChild[child.key];
    const oopsies = oopsiesByChild[child.key] || 0;
    const share = grandTotal > 0 ? Math.round((points / grandTotal) * 100) : 0;
    const item = document.createElement('li');
    item.className = 'pie-legend-item';
    item.innerHTML = `
      <span class="legend-swatch" style="background:${childColors[child.key]};"></span>
      <div class="legend-copy">
        <strong>${child.name}</strong>
        <span>${formatPoints(points)} star${points === 1 ? '' : 's'} • ${share}%</span>
        ${oopsies > 0 ? `<span style="color:#ff6b6b; font-size:0.9em;">⚠️ -${oopsies} oopsies</span>` : ''}
      </div>
    `;
    legend.appendChild(item);
  });
}

function buildDashboard() {
  const history = getHistory();
  const penaltyHistory = getPenaltyHistory();
  const todayStr = new Date().toISOString().slice(0, 10);
  const thisWeekStart = startOfWeek(todayStr);
  const currentWeekByChild = Object.fromEntries(
    CHILDREN.map(child => [child.key, getChildSummary(child.key).points])
  );
  const currentWeekOopsiesByChild = Object.fromEntries(
    CHILDREN.map(child => [child.key, countWeekOopsies(child.key, thisWeekStart)])
  );
  const childTotals = Object.fromEntries(
    CHILDREN.map(child => [child.key, {
      week: 0,
      weekOopsies: currentWeekOopsiesByChild[child.key],
      allTime: 0,
      balance: getChildAvailableStars(child.key)
    }])
  );

  history.forEach(entry => {
    const byChild = getHistoryEntryChildTotals(entry);
    const entryWeekStart = startOfWeek(entry.date);

    if (entryWeekStart === thisWeekStart) return;

    CHILDREN.forEach(child => {
      childTotals[child.key].allTime = normalizePoints(childTotals[child.key].allTime + byChild[child.key]);
    });
  });

  penaltyHistory.forEach(entry => {
    const byChild = getHistoryEntryChildTotals(entry);
    const entryWeekStart = startOfWeek(entry.date);

    CHILDREN.forEach(child => {
      childTotals[child.key].allTime = normalizePoints(childTotals[child.key].allTime + byChild[child.key]);
      if (entryWeekStart === thisWeekStart) {
        currentWeekByChild[child.key] = normalizePoints(currentWeekByChild[child.key] + byChild[child.key]);
      }
    });
  });

  CHILDREN.forEach(child => {
    childTotals[child.key].week = currentWeekByChild[child.key];
    childTotals[child.key].allTime = normalizePoints(childTotals[child.key].allTime + currentWeekByChild[child.key]);
  });

  CHILDREN.forEach(child => {
    document.getElementById(`dash-${child.key}-week-total`).textContent = formatPoints(childTotals[child.key].week);
    document.getElementById(`dash-${child.key}-week-oopsies`).textContent = formatPoints(childTotals[child.key].weekOopsies);
    document.getElementById(`dash-${child.key}-alltime-total`).textContent = formatPoints(childTotals[child.key].allTime);
    document.getElementById(`dash-${child.key}-current-balance`).textContent = formatPoints(childTotals[child.key].balance);
  });

  const dailyEntries = buildDailyEntries(thisWeekStart);
  renderDailyBarChart(dailyEntries, todayStr);
  renderWeeklyPieChart(currentWeekByChild, currentWeekOopsiesByChild);

  const weeklyEntries = buildWeeklyEntries(history, penaltyHistory).filter(entry => entry.weekStart !== thisWeekStart);
  const currentWeekTotal = normalizePoints(CHILDREN.reduce((sum, child) => sum + currentWeekByChild[child.key], 0));
  if (currentWeekTotal > 0) {
    weeklyEntries.push({
      weekStart: thisWeekStart,
      byChild: currentWeekByChild,
      total: currentWeekTotal,
      label: formatWeekLabel(thisWeekStart),
      shortLabel: formatShortWeekLabel(thisWeekStart)
    });
  }
  const weeks = [...weeklyEntries].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  const tbody = document.getElementById('weekly-history-body');
  tbody.innerHTML = '';

  if (weeks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="no-history">No history yet — go complete some planner items! 🌟</td></tr>';
    return;
  }

  weeks.forEach(wk => {
    const row = document.createElement('tr');
    if (wk.weekStart === thisWeekStart) row.classList.add('current-week-row');
    row.innerHTML = `
      <td>${wk.label}${wk.weekStart === thisWeekStart ? ' (this week)' : ''}</td>
      <td>⭐ ${formatPoints(wk.byChild.aurora)}</td>
      <td>⭐ ${formatPoints(wk.byChild.anderson)}</td>
      <td>⭐ ${formatPoints(wk.total)}</td>
    `;
    tbody.appendChild(row);
  });
}

function buildReport(filterChild = null) {
  const claimsHistory = JSON.parse(localStorage.getItem('rewardClaimsHistory') || '[]');
  const tbody = document.getElementById('reward-claims-body');
  const empty = document.getElementById('report-empty');
  const table = document.getElementById('reward-claims-table');
  
  tbody.innerHTML = '';
  
  // Set active filter button
  document.querySelectorAll('.report-filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (filterChild === null && btn.dataset.filter === 'all') {
      btn.classList.add('active');
    } else if (filterChild === btn.dataset.filter) {
      btn.classList.add('active');
    }
  });
  
  if (claimsHistory.length === 0) {
    table.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  table.style.display = 'table';
  empty.style.display = 'none';
  
  let filteredItems = claimsHistory;
  if (filterChild && filterChild !== 'all') {
    filteredItems = claimsHistory.filter(item => item.child === filterChild);
  }
  
  const sortedItems = [...filteredItems].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#999;">No reward claims for this filter.</td></tr>`;
    return;
  }
  
  sortedItems.forEach(item => {
    const row = document.createElement('tr');
    const childName = CHILDREN.find(c => c.key === item.child)?.name || item.child;
    const itemDate = new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const startingPts = item.startingPoints || 0;
    const cost = item.cost || 0;
    const endingPts = item.endingPoints !== undefined ? item.endingPoints : (startingPts - cost);
    
    row.innerHTML = `
      <td>${itemDate}</td>
      <td>${childName}</td>
      <td>${item.reward}</td>
      <td>⭐ ${formatPoints(startingPts)}</td>
      <td>🔒 ${formatPoints(cost)} ⭐</td>
      <td>⭐ ${formatPoints(endingPts)}</td>
    `;
    tbody.appendChild(row);
  });
}


function getTodayWeekday() {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[new Date().getDay()];
}

function isPastDate(dayOfWeek, weekOffset) {
  const weekDates = getCurrentWeekDates();
  const choreDate = weekDates[dayOfWeek]?.iso;
  const todayStr = new Date().toISOString().slice(0, 10);
  return choreDate < todayStr;
}

function getChoreGroups() {
  const groups = Object.fromEntries(WEEK_DAYS.map(day => [day, []]));
  chores.forEach(chore => {
    groups[chore.day].push(chore);
  });
  return groups;
}

function getDayProgressByIndex(dayChores) {
  const perChild = Object.fromEntries(
    CHILDREN.map(child => [child.key, getChildSummary(child.key, dayChores)])
  );
  const totalDone = Object.values(perChild).reduce((sum, child) => sum + child.completedItems, 0);
  return { perChild, totalDone, total: dayChores.length * CHILDREN.length };
}

function refreshPlannerHeader() {
  document.querySelectorAll('.planner-view-btn').forEach(btn => {
    const isActive = btn.dataset.view === currentChoreView;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function refreshWeekNavigation(weekDates, pageId = 'planner') {
  const rangeId = pageId === 'penalty' ? 'penalty-week-range' : 'planner-week-range';
  const range = document.getElementById(rangeId);
  if (range) range.textContent = formatPlannerWeekRange(weekDates);
}

function buildWeekdayStrip(groups, pageId = 'planner') {
  const stripId = pageId === 'penalty' ? 'penalty-weekday-strip' : 'weekday-strip';
  const strip = document.getElementById(stripId);
  strip.innerHTML = '';
  const weekDates = getCurrentWeekDates();
  refreshWeekNavigation(weekDates, pageId);

  WEEK_DAYS.forEach(day => {
    const dateInfo = weekDates[day];
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'weekday-pill';
    if (day === selectedDay) pill.classList.add('active');
    if (viewedWeekOffset === 0 && day === getTodayWeekday()) pill.classList.add('today');
    pill.innerHTML = `
      <span class="weekday-pill-short">${day.slice(0, 3)}</span>
      <span class="weekday-pill-date">${dateInfo.shortLabel}</span>
    `;
    pill.addEventListener('click', () => {
      selectedDay = day;
      pendingDayScroll = currentChoreView === 'weekly';
      if (pageId === 'penalty') {
        buildPenalties();
      } else {
        buildCards();
      }
    });
    strip.appendChild(pill);
  });
}

function applyCardCompletionState(card, chore) {
  const completedChildren = CHILDREN.filter(child => isChildDone(chore.id, child.key)).length;
  card.classList.remove('done', 'partial-done');
  const existingBadge = card.querySelector('.done-badge');
  if (existingBadge) existingBadge.remove();

  if (completedChildren === CHILDREN.length) {
    card.classList.add('done');
  } else if (completedChildren > 0) {
    card.classList.add('partial-done');
  }

  if (completedChildren > 0) {
    const badge = document.createElement('span');
    badge.className = 'done-badge';
    badge.textContent = `${completedChildren}/${CHILDREN.length}`;
    card.appendChild(badge);
  }
}

function toggleChildCompletion(chore, childKey, card) {
  if (isPastDate(chore.day, viewedWeekOffset)) {
    return;
  }
  
  const worth = getChoreWorth(chore);
  const doneSet = getDoneSet(childKey);

  if (doneSet.has(chore.id)) {
    doneSet.delete(chore.id);
    doneCount = CHILDREN.reduce((sum, child) => sum + getDoneSet(child.key).size, 0);
    adjustChildReward(childKey, -worth);
    recordEarnedStars(-worth, childKey);
    updateStarDisplay();
    saveState();
    document.getElementById('congrats').style.display = 'none';
    if (spendableStars < PRIZE_COST) {
      milestoneShown = false;
      document.getElementById('milestone-bar').style.display = 'none';
    }
    buildCards();
    return;
  }

  doneSet.add(chore.id);
  doneCount = CHILDREN.reduce((sum, child) => sum + getDoneSet(child.key).size, 0);
  activeRewardChild = childKey;
  adjustChildReward(childKey, worth);
  recordEarnedStars(worth, childKey);
  recordEarnedItem(chore.title, childKey, worth, chore.day, viewedWeekOffset);
  updateStarDisplay();
  applyCardCompletionState(card, chore);
  card.classList.add('pop');
  card.addEventListener('animationend', () => card.classList.remove('pop'), { once: true });
  const burstCount = Math.max(1, Math.ceil(worth));
  for (let i = 0; i < burstCount; i++) spawnStar(card, i);
  saveState();
  checkMilestone(childKey);
  checkAllDone();
  setTimeout(() => buildCards(), 320);
}

function createChoreCard(chore) {
  const card = document.createElement('div');
  card.className = `chore-card${chore.category === 'homework' ? ' homework-card' : ''}`;
  card.dataset.choreId = chore.id;
  const isPast = isPastDate(chore.day, viewedWeekOffset);
  card.innerHTML = `
    <span class="card-icon">${chore.icon}</span>
    <div class="card-copy">
      <div class="card-title">${chore.title}</div>
      <div class="card-meta">${chore.categoryLabel} • ${formatPointLabel(chore.stars || 1)}</div>
    </div>
    <div class="child-toggle-group">
      ${CHILDREN.map(child => `
        <button type="button" class="child-toggle-btn${isChildDone(chore.id, child.key) ? ' active' : ''}${isPast ? ' disabled' : ''}" data-child="${child.key}"${isPast ? ' disabled' : ''}>
          <span>${child.name}</span>
        </button>
      `).join('')}
    </div>
  `;
  card.dataset.stars = String(chore.stars || 1);
  if (isPast) card.classList.add('past-date');
  applyCardCompletionState(card, chore);
  card.querySelectorAll('.child-toggle-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      toggleChildCompletion(chore, button.dataset.child, card);
    });
  });

  return card;
}

function createDaySection(day, choresForDay, options = {}) {
  const { calendar = false, focus = false } = options;
  const section = document.createElement('section');
  section.dataset.day = day;
  const categories = DAILY_LISTS.map(list => ({
    ...list,
    chores: choresForDay.filter(chore => chore.category === list.key)
  }));
  section.className = `planner-day-section${calendar ? ' calendar-day' : ''}${focus ? ' focus-day' : ''}`;
  if (day === selectedDay) section.classList.add('selected-day');

  section.innerHTML = `
    <div class="planner-day-header">
      <div>
        <div class="planner-day-label">${calendar ? day.slice(0, 3) : day}</div>
      </div>
    </div>
  `;

  categories.forEach(category => {
    const subsection = document.createElement('div');
    subsection.className = `planner-subsection planner-subsection-${category.key}`;
    subsection.innerHTML = `
      <div class="planner-subsection-header">
        <h3>${category.label}</h3>
        <span>${category.chores.length} items</span>
      </div>
    `;

    const list = document.createElement('div');
    list.className = 'planner-day-cards';

    category.chores.forEach(chore => {
      list.appendChild(createChoreCard(chore));
    });

    subsection.appendChild(list);
    section.appendChild(subsection);
  });

  return section;
}

// ── Confetti ──────────────────────────────────────────────────
function launchConfetti() {
  const splash = document.getElementById('congrats-splash');
  const container = document.getElementById('confetti-container');

  // Show congrats text
  splash.style.display = 'flex';
  setTimeout(() => { splash.style.display = 'none'; }, 3000);

  // Clear old confetti
  container.innerHTML = '';

  const colors = ['#ffb6c1', '#bde0fe', '#ff9ec4', '#89d4f5'];
  const count = 120;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
    piece.style.animationDelay    = (Math.random() * 1.5) + 's';
    piece.style.width  = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }

  // Remove after 3 seconds
  setTimeout(() => { container.innerHTML = ''; }, 3000);
}

// ── Chore cards ───────────────────────────────────────────────
function buildCards() {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  grid.className = `cards-grid planner-grid view-${currentChoreView}`;
  doneCount = CHILDREN.reduce((sum, child) => sum + getDoneSet(child.key).size, 0);
  refreshPlannerHeader();
  refreshRewardViews();

  const choreGroups = getChoreGroups();
  buildWeekdayStrip(choreGroups);

  if (currentChoreView === 'daily') {
    grid.appendChild(createDaySection(selectedDay, choreGroups[selectedDay], { focus: true }));
    return;
  }

  WEEK_DAYS.forEach(day => {
    grid.appendChild(createDaySection(day, choreGroups[day], { calendar: currentChoreView === 'calendar' }));
  });

  if (pendingDayScroll && currentChoreView === 'weekly') {
    pendingDayScroll = false;
    const selectedSection = grid.querySelector(`[data-day="${selectedDay}"]`);
    if (selectedSection) {
      requestAnimationFrame(() => {
        selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
}

function spawnStar(card, offset = 0) {
  const rect = card.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = 'star-burst';
  burst.textContent = '⭐';
  burst.style.left = (rect.left + rect.width / 2 - 16 + offset * 24) + 'px';
  burst.style.top  = (rect.top + window.scrollY - 10) + 'px';
  document.body.appendChild(burst);
  burst.addEventListener('animationend', () => burst.remove());
}

// ── Milestones ────────────────────────────────────────────────
function checkMilestone(childKey = activeRewardChild) {
  const childState = getChildRewardState(childKey);
  const totalAvailable = getChildAvailableStars(childKey);
  activeRewardChild = childKey;

  if (totalAvailable >= BIG_PRIZE_COST) {
    if (childState.spendable > 0) {
      childState.saved = normalizePoints(childState.saved + childState.spendable);
      childState.spendable = 0;
      syncAggregateRewardState();
    }
    milestoneShown = true;
    document.getElementById('milestone-bar').style.display = 'none';
    saveState();
    updateStarDisplay();
    showPage('prize');
    return;
  }

  if (childState.spendable > 0 && isMultipleOf(childState.spendable, PRIZE_COST) && !milestoneShown) {
    milestoneShown = true;
    const bar = document.getElementById('milestone-bar');
    bar.style.display = 'block';
    refreshRewardViews();
  }
}

function checkAllDone() {
  if (doneCount === chores.length * CHILDREN.length) {
    document.getElementById('final-stars').textContent = formatPoints(stars);
    document.getElementById('congrats').style.display = 'block';
    document.getElementById('congrats').scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Milestone bar buttons ─────────────────────────────────────
document.getElementById('spend-now-btn').addEventListener('click', () => {
  document.getElementById('milestone-bar').style.display = 'none';
  showPage('prize');
});

document.getElementById('save-stars-btn').addEventListener('click', () => {
  const childState = getChildRewardState(activeRewardChild);
  childState.saved = normalizePoints(childState.saved + childState.spendable);
  childState.spendable = 0;
  syncAggregateRewardState();
  milestoneShown  = false;
  document.getElementById('milestone-bar').style.display = 'none';
  updateStarDisplay();
  saveState();
  if (childState.saved >= BIG_PRIZE_COST) {
    showPage('prize');
  } else {
    showSaveToast();
  }
});

function showSaveToast() {
  const activeChild = CHILDREN.find(child => child.key === activeRewardChild) || CHILDREN[0];
  const childState = getChildRewardState(activeChild.key);
  const toast = document.createElement('div');
  toast.className = 'prize-toast';
  toast.innerHTML = `💾 ${activeChild.name} saved stars! They now have <strong>${formatPoints(childState.saved)}</strong> saved toward a big reward (need 20)!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

// ── 5-star Prize Shop ─────────────────────────────────────────
function buildPrizes() {
  const activeChild = CHILDREN.find(child => child.key === activeRewardChild) || CHILDREN[0];
  const childState = getChildRewardState(activeChild.key);
  renderRewardChildSwitch('prize-child-switch', activeChild.key);
  const grid = document.getElementById('prize-grid');
  grid.innerHTML = '';

  const sortedPrizes = [...prizes].sort((a, b) => (a.cost || PRIZE_COST) - (b.cost || PRIZE_COST));
  sortedPrizes.forEach(prize => {
    const prizeCost = prize.cost || PRIZE_COST;
    const canAfford = childState.spendable >= prizeCost;
    const card = document.createElement('div');
    card.className = 'prize-card' + (canAfford ? '' : ' locked');
    card.innerHTML = `
      <span class="prize-icon">${prize.icon}</span>
      <div class="prize-title">${prize.title}</div>
      <div class="prize-desc">${prize.desc}</div>
      ${canAfford ? '<button class="claim-btn">Claim!</button>' : `<div class="locked-label">🔒 ${formatPoints(prizeCost)} ⭐</div>`}
    `;
    if (canAfford) card.querySelector('.claim-btn').addEventListener('click', () => claimPrize(prize, activeChild.key));
    grid.appendChild(card);
  });
}

function claimPrize(prize, childKey) {
  const childState = getChildRewardState(childKey);
  const prizeCost = prize.cost || PRIZE_COST;
  if (childState.spendable < prizeCost) return;
  const startingPoints = childState.spendable;
  childState.spendable = normalizePoints(childState.spendable - prizeCost);
  syncAggregateRewardState();
  recordRewardClaim(prize.title, 'Regular', prizeCost, childKey, startingPoints);
  saveState();
  updateStarDisplay();
  document.getElementById('prize-banner-child-name').textContent = CHILDREN.find(child => child.key === childKey).name;
  document.getElementById('prize-banner-icon').textContent = prize.icon;
  document.getElementById('prize-banner-name').textContent = prize.title;
  document.getElementById('prize-claimed-banner').style.display = 'flex';
  buildPrizes();
}

document.getElementById('prize-banner-close').addEventListener('click', () => {
  document.getElementById('prize-claimed-banner').style.display = 'none';
  milestoneShown = false;
  showPage('chore');
});

// ── Big Prize Shop ────────────────────────────────────────────
function buildBigPrizes() {
  const activeChild = CHILDREN.find(child => child.key === activeRewardChild) || CHILDREN[0];
  const childState = getChildRewardState(activeChild.key);
  const grid = document.getElementById('big-prize-grid');
  grid.innerHTML = '';

  const sortedBigPrizes = [...bigPrizes].sort((a, b) => getBigPrizeCost(a) - getBigPrizeCost(b));
  sortedBigPrizes.forEach(prize => {
    const prizeCost = getBigPrizeCost(prize);
    const canAfford = childState.saved >= prizeCost;
    const alreadyClaimed = hasClaimedBigPrize(activeChild.key, prize.title);
    
    const card = document.createElement('div');
    card.className = 'prize-card big-prize-card' + (canAfford && !alreadyClaimed ? '' : ' locked') + (alreadyClaimed ? ' claimed' : '');
    card.innerHTML = `
      <span class="prize-icon">${prize.icon}</span>
      <div class="prize-title">${prize.title}</div>
      <div class="prize-desc">${prize.desc}</div>
      ${alreadyClaimed ? '<div class="claimed-label">✨ Already Claimed!</div>' : (canAfford ? '<button class="claim-btn big-claim-btn">Claim!</button>' : `<div class="locked-label">🔒 ${formatPoints(prizeCost)} ⭐ (${formatPoints(childState.saved)}/${formatPoints(prizeCost)})</div>`)}
    `;
    if (canAfford && !alreadyClaimed) card.querySelector('.big-claim-btn').addEventListener('click', () => claimBigPrize(prize, activeChild.key));
    grid.appendChild(card);
  });
}

function claimBigPrize(prize, childKey) {
  const childState = getChildRewardState(childKey);
  const prizeCost = getBigPrizeCost(prize);
  if (childState.saved < prizeCost) return;
  
  const startingPoints = childState.saved;
  // Record that this child has claimed this big prize (once-only)
  recordBigPrizeClaim(prize.title, childKey);
  
  childState.saved = normalizePoints(childState.saved - prizeCost);
  syncAggregateRewardState();
  recordRewardClaim(prize.title, 'Big Prize', prizeCost, childKey, startingPoints);
  saveState();
  updateStarDisplay();
  document.getElementById('big-prize-banner-child-name').textContent = CHILDREN.find(child => child.key === childKey).name;
  document.getElementById('big-prize-banner-icon').textContent = prize.icon;
  document.getElementById('big-prize-banner-name').textContent = prize.title;
  launchConfetti();
  document.getElementById('big-prize-claimed-banner').style.display = 'flex';
  buildBigPrizes();
}

function createOopsiesCard(item) {
  const card = document.createElement('div');
  card.className = 'chore-card oopsies-card';
  const oopsiesId = item.id;
  const dayFromId = oopsiesId.split('-')[0];
  const isPast = isPastDate(dayFromId, viewedWeekOffset);
  card.innerHTML = `
    <span class="card-icon">${item.icon}</span>
    <div class="card-copy">
      <div class="card-title">${item.title}</div>
      <div class="card-meta">Oopsies • -${formatPointLabel(item.penalty)}</div>
    </div>
    <div class="child-toggle-group">
      ${CHILDREN.map(child => `
        <button type="button" class="child-toggle-btn${isOopsiesDone(oopsiesId, child.key) ? ' active' : ''}${isPast ? ' disabled' : ''}" data-child="${child.key}"${isPast ? ' disabled' : ''}>
          <span>${child.name}</span>
        </button>
      `).join('')}
    </div>
  `;
  if (isPast) card.classList.add('past-date');
  applyOopsiesCardSelectionState(card, oopsiesId);

  card.querySelectorAll('.child-toggle-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      applyPenalty(item, button.dataset.child);
    });
  });

  return card;
}

function applyOopsiesCardSelectionState(card, oopsiesId) {
  const completedChildren = CHILDREN.filter(child => isOopsiesDone(oopsiesId, child.key)).length;
  card.classList.remove('done', 'partial-done');
  const existingBadge = card.querySelector('.done-badge');
  if (existingBadge) existingBadge.remove();

  if (completedChildren === CHILDREN.length) {
    card.classList.add('done');
  } else if (completedChildren > 0) {
    card.classList.add('partial-done');
  }

  if (completedChildren > 0) {
    const badge = document.createElement('span');
    badge.className = 'done-badge';
    badge.textContent = `${completedChildren}/${CHILDREN.length}`;
    card.appendChild(badge);
  }
}

function buildPenalties() {
  const activeChild = CHILDREN.find(child => child.key === activeRewardChild) || CHILDREN[0];
  renderRewardChildSwitch('penalty-child-switch', activeChild.key);

  // Build week navigation for penalties
  buildWeekdayStrip([], 'penalty');

  const grid = document.getElementById('penalty-grid');
  grid.innerHTML = '';

  // Only show the selected day
  const section = document.createElement('section');
  section.className = 'planner-day-section oopsies-day-section';
  section.innerHTML = `
    <div class="planner-day-header">
      <div>
        <div class="planner-day-label">${selectedDay}</div>
      </div>
    </div>
  `;

  const list = document.createElement('div');
  list.className = 'planner-day-cards';
  OOPSIES_ITEMS.forEach(item => {
    list.appendChild(createOopsiesCard({
      ...item,
      id: `${selectedDay}-${item.key}`
    }));
  });

  section.appendChild(list);
  grid.appendChild(section);
}

function applyPenalty(item, childKey = activeRewardChild) {
  const dayFromId = item.id.split('-')[0];
  if (isPastDate(dayFromId, viewedWeekOffset)) {
    return;
  }
  
  const penaltyAmount = Math.abs(normalizePoints(item.penalty));
  activeRewardChild = childKey;
  const activeChild = CHILDREN.find(child => child.key === childKey) || CHILDREN[0];
  const selectedOopsiesSet = getOopsiesDoneSet(childKey);
  const result = document.getElementById('penalty-result');

  if (selectedOopsiesSet.has(item.id)) {
    selectedOopsiesSet.delete(item.id);
    const restoredChange = adjustChildReward(childKey, penaltyAmount);
    recordPenalty(restoredChange, childKey);
    updateStarDisplay();
    saveState();
    buildPenalties();
    buildPrizes();
    buildBigPrizes();
    if (document.getElementById('dashboard-page').style.display !== 'none') buildDashboard();
    result.textContent = `${activeChild.name} got ${formatPoints(restoredChange)} star${restoredChange === 1 ? '' : 's'} back.`;
    return;
  }

  const actualChange = adjustChildReward(childKey, -penaltyAmount);

  if (actualChange === 0) {
    result.textContent = `${activeChild.name} does not have any stars left.`;
    return;
  }

  selectedOopsiesSet.add(item.id);
  recordPenalty(actualChange, childKey);
  milestoneShown = false;
  document.getElementById('milestone-bar').style.display = 'none';
  updateStarDisplay();
  saveState();
  buildPenalties();
  buildPrizes();
  buildBigPrizes();
  if (document.getElementById('dashboard-page').style.display !== 'none') buildDashboard();
  result.textContent = `${activeChild.name} lost ${formatPoints(Math.abs(actualChange))} star${Math.abs(actualChange) === 1 ? '' : 's'}.`;
}

function resetChores() {
  stars = 0;
  spendableStars = 0;
  savedStars = 0;
  doneCount = 0;
  milestoneShown = false;
  doneChoreIdsByChild = createEmptyDoneMap();
  doneOopsiesIdsByChild = createEmptyDoneMap();
  childRewardState = createEmptyRewardState();
  localStorage.removeItem('choreStars');
  localStorage.removeItem('choreSpendable');
  localStorage.removeItem('choreSaved');
  localStorage.removeItem('choreDone');
  localStorage.removeItem('choreDoneByChild');
  localStorage.removeItem('choreOopsiesByChild');
  localStorage.removeItem('choreRewardsByChild');
  localStorage.removeItem('chorePenaltyHistory');
  updateStarDisplay();
  document.getElementById('congrats').style.display = 'none';
  document.getElementById('milestone-bar').style.display = 'none';
  buildCards();
}

document.getElementById('big-prize-banner-close').addEventListener('click', () => {
  document.getElementById('big-prize-claimed-banner').style.display = 'none';
  showPage('chore');
});

// ── Nav buttons (tabs) ────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

document.getElementById('go-prizes-btn').addEventListener('click', () => showPage('prize'));

document.querySelectorAll('.planner-view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentChoreView = btn.dataset.view;
    buildCards();
  });
});

document.getElementById('prev-week-btn').addEventListener('click', () => {
  viewedWeekOffset -= 1;
  buildCards();
});

document.getElementById('next-week-btn').addEventListener('click', () => {
  viewedWeekOffset += 1;
  buildCards();
});

// Oopsies week navigation
document.getElementById('penalty-prev-week-btn')?.addEventListener('click', () => {
  viewedWeekOffset -= 1;
  buildCards();
});

document.getElementById('penalty-next-week-btn')?.addEventListener('click', () => {
  viewedWeekOffset += 1;
  buildCards();
});

// ── Report filter buttons ──────────────────────────────────────
document.querySelectorAll('.report-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.report-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    buildReport(filter === 'all' ? null : filter);
  });
});


// ── Init ──────────────────────────────────────────────────────
const savedRewardsByChild = JSON.parse(localStorage.getItem('choreRewardsByChild') || 'null');
const hasPerChildRewards = !!(savedRewardsByChild && typeof savedRewardsByChild === 'object');
childRewardState = createEmptyRewardState();
if (hasPerChildRewards) {
  CHILDREN.forEach(child => {
    const childState = savedRewardsByChild[child.key];
    if (childState && typeof childState === 'object') {
      childRewardState[child.key] = {
        spendable: normalizePoints(parseFloat(childState.spendable || '0')),
        saved: normalizePoints(parseFloat(childState.saved || '0'))
      };
    }
  });
} else {
  childRewardState = createEmptyRewardState();
}
syncAggregateRewardState();
const savedDoneByChild = JSON.parse(localStorage.getItem('choreDoneByChild') || 'null');
doneChoreIdsByChild = createEmptyDoneMap();
if (savedDoneByChild && typeof savedDoneByChild === 'object') {
  CHILDREN.forEach(child => {
    doneChoreIdsByChild[child.key] = new Set(
      Array.isArray(savedDoneByChild[child.key]) ? savedDoneByChild[child.key].filter(value => typeof value === 'string') : []
    );
  });
} else {
  const legacyDone = JSON.parse(localStorage.getItem('choreDone') || '[]').filter(value => typeof value === 'string');
  doneChoreIdsByChild.aurora = new Set(legacyDone);
}
const savedOopsiesByChild = JSON.parse(localStorage.getItem('choreOopsiesByChild') || 'null');
doneOopsiesIdsByChild = createEmptyDoneMap();
if (savedOopsiesByChild && typeof savedOopsiesByChild === 'object') {
  CHILDREN.forEach(child => {
    doneOopsiesIdsByChild[child.key] = new Set(
      Array.isArray(savedOopsiesByChild[child.key]) ? savedOopsiesByChild[child.key].filter(value => typeof value === 'string') : []
    );
  });
}
if (!hasPerChildRewards) {
  const auroraEarned = getChildSummary('aurora').points;
  const legacySaved = normalizePoints(parseFloat(localStorage.getItem('choreSaved') || '0'));
  childRewardState.aurora.saved = Math.min(legacySaved, auroraEarned);
  childRewardState.aurora.spendable = normalizePoints(Math.max(auroraEarned - childRewardState.aurora.saved, 0));
  syncAggregateRewardState();
  saveState();
}
updateStarDisplay();
buildCards();
showPage('chore');
if (CHILDREN.some(child => getChildRewardState(child.key).spendable >= PRIZE_COST)) milestoneShown = true;
