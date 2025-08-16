var LOWER = "abcdefghijklmnopqrstuvwxyz";
    var UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var NUMS  = "0123456789";
    var SYMS  = "!@#$%^&*()-_=+[]{};:,.?/";

    // Short helpers without any advanced JS
    function $(id) { return document.getElementById(id); }
    function rand(max) { return Math.floor(Math.random() * max); }

    var out = $("password");
    var len = $("length");
    var badge = $("lengthBadge");
    var bar = $("bar");

    function updateBadge() {
      var v = parseInt(len.value, 10) || 12;
      if (v < 4) v = 4; if (v > 64) v = 64;
      len.value = v;
      badge.textContent = v;
      updateStrength(v);
    }

    function updateStrength(v) {
      // Simple strength estimate based on length and variety
      var sets = 0;
      if ($("lower").checked) sets++;
      if ($("upper").checked) sets++;
      if ($("nums").checked) sets++;
      if ($("syms").checked) sets++;
      var score = Math.min(100, (v - 4) * 4 + sets * 15);
      if (score < 0) score = 0;
      bar.style.width = score + "%";
    }

    function buildPool() {
      var pool = "";
      if ($("lower").checked) pool += LOWER;
      if ($("upper").checked) pool += UPPER;
      if ($("nums").checked)  pool += NUMS;
      if ($("syms").checked)  pool += SYMS;
      return pool;
    }

    function ensureAtLeastOne(selectedSets, passwordArray) {
      // Guarantee at least one character from every chosen set
      for (var i = 0; i < selectedSets.length; i++) {
        var set = selectedSets[i];
        if (set.length > 0) {
          passwordArray.push(set[rand(set.length)]);
        }
      }
    }

    function shuffle(arr) {
      // Basic Fisher-Yates shuffle
      for (var i = arr.length - 1; i > 0; i--) {
        var j = rand(i + 1);
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    }

    function generate() {
      var l = parseInt(len.value, 10);
      if (isNaN(l)) l = 12;
      if (l < 4) l = 4; if (l > 64) l = 64;

      var sets = [];
      if ($("lower").checked) sets.push(LOWER);
      if ($("upper").checked) sets.push(UPPER);
      if ($("nums").checked)  sets.push(NUMS);
      if ($("syms").checked)  sets.push(SYMS);

      var pool = buildPool();
      if (!pool) {
        alert("Please select at least one character type.");
        return;
      }

      var chars = [];
      // Ensure at least one from each chosen set
      ensureAtLeastOne(sets, chars);

      // Fill the rest from the whole pool
      while (chars.length < l) {
        chars.push(pool[rand(pool.length)]);
      }

      // Shuffle to avoid predictable positions
      shuffle(chars);

      out.value = chars.join("");
      updateBadge();
    }

    function copy() {
      if (!out.value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.value).then(function () {
          flash($("copyBtn"));
        }, function () {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    }

    function fallbackCopy() {
      out.focus();
      out.select();
      try {
        document.execCommand('copy');
        flash($("copyBtn"));
      } catch (e) { /* ignore */ }
      window.getSelection().removeAllRanges();
    }

    function flash(btn) {
      var old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(function(){ btn.textContent = old; }, 900);
    }

    $("genBtn").addEventListener("click", generate);
    $("copyBtn").addEventListener("click", copy);
    $("clearBtn").addEventListener("click", function(){ out.value = ""; });
    $("lower").addEventListener("change", updateBadge);
    $("upper").addEventListener("change", updateBadge);
    $("nums").addEventListener("change", updateBadge);
    $("syms").addEventListener("change", updateBadge);
    len.addEventListener("input", updateBadge);

    // Initialize UI
    updateBadge();
