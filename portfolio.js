(function () {
  'use strict';
  var grid = document.getElementById('wd-portfolio-grid');
  if (!grid) return;
  var empty = document.getElementById('wd-portfolio-empty');

  function thumb(e) {
    if (e.media$thumbnail && e.media$thumbnail.url) return e.media$thumbnail.url.replace(/\/s72-c\//, '/s600/');
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
  function tags(e) {
    if (!e.category) return [];
    return e.category.map(function (c) { return c.term; }).filter(function (t) { return t !== 'Proyek'; });
  }
  function card(e) {
    var th = thumb(e);
    var thumbHtml = th ? '<img src="' + th + '" alt="" loading="lazy"/>' : 'Screenshot proyek';
    var tg = tags(e);
    var tagHtml = tg.length ? '<div class="wd-proj-tech">' + tg.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' : '';
    return '<article class="wd-proj"><div class="wd-proj-img">' + thumbHtml + '</div>' +
      '<div class="wd-proj-body"><h3>' + (e.title.$t || 'Untitled') + '</h3>' +
      '<p>' + snippet(e, 140) + '</p>' + tagHtml +
      '<div class="wd-proj-links"><a href="' + link(e) + '">Lihat Detail →</a></div></div></article>';
  }
  function fetchAll(url, acc, cb) {
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (d.feed && d.feed.entry) acc = acc.concat(d.feed.entry);
      var next = null;
      if (d.feed && d.feed.link) for (var i = 0; i < d.feed.link.length; i++) if (d.feed.link[i].rel === 'next') next = d.feed.link[i].href;
      if (next) fetchAll(next, acc, cb); else cb(acc);
    }).catch(function () { cb(acc); });
  }
  fetchAll('/feeds/posts/default/-/Proyek?alt=json&max-results=100', [], function (posts) {
    if (posts.length === 0) { empty.style.display = 'block'; return; }
    grid.innerHTML = posts.map(card).join('');
  });
})();