(function () {
  'use strict';
  function getThumb(e) {
    if (e.media$thumbnail && e.media$thumbnail.url) return e.media$thumbnail.url.replace(/\/s72-c\//, '/s400/');
    var c = (e.content && e.content.$t) || (e.summary && e.summary.$t) || '';
    var m = c.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  }
  function getSnippet(e, len) {
    var raw = (e.summary && e.summary.$t) || (e.content && e.content.$t) || '';
    var d = document.createElement('div'); d.innerHTML = raw;
    var t = (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
    return t.length > len ? t.substr(0, len).trim() + '…' : t;
  }
  function getLink(e) {
    if (e.link) for (var i = 0; i < e.link.length; i++) if (e.link[i].rel === 'alternate') return e.link[i].href;
    return '#';
  }
  function getDate(e) {
    var d = e.published && e.published.$t; if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fetchLabel(label, n) {
    return fetch('/feeds/posts/default/-/' + encodeURIComponent(label) + '?alt=json&max-results=' + n)
      .then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  function renderBlogCard(e) {
    var th = getThumb(e);
    var thumb = th ? '<div class="wd-post-card-thumb"><img src="' + th + '" alt="" loading="lazy"/></div>' : '<div class="wd-post-card-thumb"></div>';
    return '<article class="wd-post-card"><a href="' + getLink(e) + '" class="wd-post-card-link">' + thumb +
      '<div class="wd-post-card-body"><h3 class="wd-post-card-title">' + (e.title.$t || 'Untitled') + '</h3>' +
      '<p class="wd-post-card-snippet">' + getSnippet(e, 120) + '</p>' +
      '<time class="wd-post-card-date">' + getDate(e) + '</time></div></a></article>';
  }

  var blog = document.getElementById('wd-home-blog');
  if (blog) fetchLabel('Blog', 3).then(function (d) {
    if (!d || !d.feed || !d.feed.entry) { blog.innerHTML = '<p class="wd-empty">Belum ada tulisan.</p>'; return; }
    blog.innerHTML = d.feed.entry.map(renderBlogCard).join('');
  });

  var proj = document.getElementById('wd-home-projects');
  if (proj) fetchLabel('Proyek', 3).then(function (d) {
    if (!d || !d.feed || !d.feed.entry) { proj.innerHTML = '<p class="wd-empty">Belum ada proyek.</p>'; return; }
    proj.innerHTML = d.feed.entry.map(function (e) {
      var th = getThumb(e);
      var thumb = th ? '<img src="' + th + '" alt="" loading="lazy"/>' : 'Screenshot proyek';
      return '<article class="wd-proj"><div class="wd-proj-img">' + thumb + '</div>' +
        '<div class="wd-proj-body"><h3>' + (e.title.$t || 'Untitled') + '</h3>' +
        '<p>' + getSnippet(e, 120) + '</p>' +
        '<div class="wd-proj-links"><a href="' + getLink(e) + '">Lihat Detail →</a></div></div></article>';
    }).join('');
  });
})();