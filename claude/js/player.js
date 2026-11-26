/* =========================================================
   播放器：全站只用一个 Audio
   状态：idle / loading / playing / paused / stopped / ended / error
   ========================================================= */
(function () {
  'use strict';

  var audio = new Audio();
  audio.preload = 'auto';

  var state = 'idle';
  var cur = null;          // { key, src, label, startAt }
  var rate = 1;
  var pendingStart = null; // 换 src 后要跳到的秒数
  var listeners = [];

  var LABEL = {
    idle: '待機中', loading: '読み込み中…', playing: '再生中', paused: '一時停止中',
    stopped: '停止中', ended: '再生終了', error: '再生できません'
  };

  function emit(type) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](type || 'state', state, cur); } catch (e) { if (window.console) console.error(e); }
    }
  }
  function setState(s) { if (state !== s) { state = s; emit('state'); } }

  function applyRate() {
    audio.defaultPlaybackRate = rate;  // 换 src 后浏览器可能会重置 playbackRate
    audio.playbackRate = rate;
  }

  audio.addEventListener('loadedmetadata', function () {
    applyRate();
    if (pendingStart != null) {
      try { audio.currentTime = pendingStart; } catch (e) {}
      pendingStart = null;
    }
  });
  audio.addEventListener('playing', function () { applyRate(); setState('playing'); });
  audio.addEventListener('waiting', function () { if (state === 'playing') setState('loading'); });
  audio.addEventListener('pause', function () {
    // ended 之前会先触发 pause；stop() 也会触发 pause —— 都忽略
    if (audio.ended || state === 'stopped' || state === 'ended' || state === 'idle') return;
    setState('paused');
  });
  audio.addEventListener('ended', function () { setState('ended'); });
  audio.addEventListener('error', function () { if (cur) setState('error'); });
  audio.addEventListener('timeupdate', function () { emit('time'); });
  audio.addEventListener('durationchange', function () { emit('time'); });

  function startPlay() {
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function (err) {
        if (err && err.name === 'AbortError') return; // 被下一次播放打断，正常
        setState('error');
      });
    }
  }

  var P = {
    LABEL: LABEL,

    /* 播放 / 暂停 / 继续：同一个 key 再点一次就暂停，再点继续 */
    toggle: function (item) {
      if (!item || !item.src) return;
      if (cur && cur.key === item.key && cur.src === item.src) {
        if (state === 'playing' || state === 'loading') { audio.pause(); setState('paused'); return; }
        if (state === 'paused') { applyRate(); startPlay(); return; }
        if (state === 'ended' || state === 'stopped') {
          try { audio.currentTime = item.startAt || 0; } catch (e) {}
          setState('loading'); applyRate(); startPlay(); return;
        }
      }
      P.load(item, true);
    },

    load: function (item, autoplay) {
      if (state === 'playing' || state === 'paused' || state === 'loading') {
        state = 'stopped'; // 先设状态再 pause，pause 事件就不会改成「一時停止」
        audio.pause();
      }
      cur = { key: item.key, src: item.src, label: item.label || '', startAt: item.startAt || 0 };
      pendingStart = item.startAt || null;
      audio.src = item.src;
      applyRate();
      setState(autoplay ? 'loading' : 'stopped');
      emit('time');
      if (autoplay) startPlay();
    },

    pause: function () { if (state === 'playing' || state === 'loading') { audio.pause(); setState('paused'); } },

    resume: function () { if (cur && (state === 'paused' || state === 'stopped' || state === 'ended')) { setState('loading'); applyRate(); startPlay(); } },

    stop: function () {
      if (!cur) return;
      if (state === 'idle') return;
      state = 'stopped';     // 先设状态
      audio.pause();
      try { audio.currentTime = cur.startAt || 0; } catch (e) {}
      emit('state'); emit('time');
    },

    seekFraction: function (f) {
      if (!cur || !isFinite(audio.duration)) return;
      try { audio.currentTime = Math.max(0, Math.min(1, f)) * audio.duration; } catch (e) {}
    },
    seekTo: function (sec) { try { audio.currentTime = sec; } catch (e) {} },

    setRate: function (r) { rate = Number(r) || 1; applyRate(); emit('rate'); },
    getRate: function () { return rate; },

    state: function () { return state; },
    current: function () { return cur; },
    isKey: function (key) { return !!cur && cur.key === key; },
    time: function () { return { t: audio.currentTime || 0, d: isFinite(audio.duration) ? audio.duration : 0 }; },
    on: function (fn) { listeners.push(fn); },
    _audio: audio
  };

  HSK.player = P;
})();
