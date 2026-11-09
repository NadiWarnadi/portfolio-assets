(function () {
  'use strict';
  var FEED = '/feeds/posts/default/-/Blog?alt=json';
  var PAGE_SIZE = 10;
  var allPosts = [], filtered = [], currentTag = 'all', term = '', shown = 0;

  var grid = document.getElementById('wd-blog-grid');
  if (!grid) return;
  var empty = document.getElementById('wd-blog-empty');
  var input = document.getElementById('wd-search');
  var tagWrap = document.getElementById('wd-tag-filter');
  var more = document.getElementById('wd-load-more');

  function thumb(e) {
    if (e.media$thumbnail && e.media$thumbnail.url) return e.media$thumbnail.url.replace(/\/s72-c\//, '/s400/');
    var c = (e.content && e.content.$t) || (e.summary && e.summary.$t) || '';
    var m = c.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  }
  function snippet(e, len) {
    var raw = (e.summary && e.summary.$t) || (e.content && e.content.$t) || '';
    var d = document.createElement('div'); d.innerHTML = raw;
    var t = (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
    return t.length > len ? t.substr(0, len).trim() + '…' : t;
  }
  function link(e) {
    if (e.link) for (var i = 0; i < e.link.length; i++) if (e.link[i].rel === 'alternate') return e.link[i].href;
    return '#';
  }
  function date(e) {
    var d = e.published && e.published.$t; if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function tags(e) {
    if (!e.category) return [];
    return e.category.map(function (c) { return c.term; }).filter(function (t) { return t !== 'Blog' && t !== 'Proyek'; });
  }
  function card(e) {
    var th = thumb(e);
    var thumbHtml = th ? '<div class="wd-post-card-thumb"><img src="' + th + '" alt="" loading="lazy"/></div>' : '<div class="wd-post-card-thumb"></div>';
    return '<article class="wd-post-card"><a href="' + link(e) + '" class="wd-post-card-link">' + thumbHtml +
      '<div class="wd-post-card-body"><h3 class="wd-post-card-title">' + (e.title.$t || 'Untitled') + '</h3>' +
      '<p class="wd-post-card-snippet">' + snippet(e, 140) + '</p>' +
      '<time class="wd-post-card-date">' + date(e) + '</time></div></a></article>';
  }

  function apply() {
    var q = term.toLowerCase();
    filtered = allPosts.filter(function (p) {
      if (q) {
        var t = (p.title.$t || '').toLowerCase();
        var sn = snippet(p, 300).toLowerCase();
        if (t.indexOf(q) === -1 && sn.indexOf(q) === -1) return false;
      }
      if (currentTag !== 'all') {
        if (tags(p).indexOf(currentTag) === -1) return false;
      }
      return true;
    });
    shown = 0; grid.innerHTML = ''; morePosts();
  }

  function morePosts() {
    var next = filtered.slice(shown, shown + PAGE_SIZE);
    if (next.length === 0 && shown === 0) {
      empty.style.display = 'block';
      empty.textContent = 'Tidak ada tulisan yang cocok.';
      more.style.display = 'none';
      return;
    }
    empty.style.display = 'none';
    grid.insertAdjacentHTML('beforeend', next.map(card).join(''));
    shown += next.length;
    more.style.display = shown < filtered.length ? 'inline-flex' : 'none';
  }

  function buildTags() {
    var set = {};
    allPosts.forEach(function (p) { tags(p).forEach(function (t) { set[t] = 1; }); });
    var arr = Object.keys(set).sort();
    var html = '<button type="button" class="is-active" data-tag="all">Semua</button>';
    arr.forEach(function (t) { html += '<button type="button" data-tag="' + t + '">' + t + '</button>'; });
    tagWrap.innerHTML = html;
    tagWrap.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        tagWrap.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        currentTag = b.getAttribute('data-tag');
        apply();
      });
    });
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { term = input.value.trim(); apply(); }, 200);
  });
  more.addEventListener('click', morePosts);

  function fetchAll(url, acc, cb) {
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (d.feed && d.feed.entry) acc = acc.concat(d.feed.entry);
      var next = null;
      if (d.feed && d.feed.link) for (var i = 0; i < d.feed.link.length; i++) if (d.feed.link[i].rel === 'next') next = d.feed.link[i].href;
      if (next) fetchAll(next, acc, cb); else cb(acc);
    }).catch(function () { cb(acc); });
  }

  fetchAll(FEED + '&max-results=100', [], function (posts) {
    allPosts = posts;
    if (allPosts.length === 0) {
      empty.style.display = 'block';
      empty.textContent = 'Belum ada tulisan.';
      more.style.display = 'none';
      return;
    }
    buildTags(); apply();
  });
})();