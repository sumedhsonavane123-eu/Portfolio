(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let uid = 0;

  /* ---------- art slot: vector scene + optional real photo (images/<name>-1600|2560|3840.jpg, or images/<name>.jpg) ---------- */
  function mountArt(el, scene, photo) {
    el.innerHTML = window.SCENES[scene]('s' + uid++);
    if (!photo) return;
    const img = new Image();
    img.className = 'photo'; img.alt = el.firstChild.getAttribute('aria-label') || ''; img.decoding = 'async'; img.loading = 'lazy';
    img.sizes = '(min-width:1600px) 3840px, (min-width:900px) 2560px, 1600px';
    img.srcset = `images/${photo}-1600.jpg 1600w, images/${photo}-2560.jpg 2560w, images/${photo}-3840.jpg 3840w`;
    img.src = `images/${photo}.jpg`;
    img.onload = () => img.classList.add('ok');
    img.onerror = () => img.remove();
    el.appendChild(img);
  }

  /* ---------- data ---------- */
  const SIGHTS = [
    { id: 'parliament', cat: 'Landmarks', name: 'Hungarian Parliament', sub: 'A neo-Gothic riverfront giant, best seen from the water at dusk.',
      facts: [['Built', '1885–1904'], ['Architect', 'Imre Steindl'], ['Dome height', '96 m'], ['Getting there', 'M2 Kossuth tér · Tram 2']],
      text: "One of Europe's oldest legislative buildings and the icon of the skyline. Inside, the grand staircase, gilded halls and the Holy Crown of Hungary are visible only on a guided tour. The façade is covered in statues of Hungarian rulers.",
      tip: "Book timed tickets online well ahead; tours sell out in season. For the postcard shot, cross to the Buda bank near Batthyány tér, or take an evening river cruise when it is floodlit." },
    { id: 'chain', cat: 'Landmarks', name: 'Széchenyi Chain Bridge', sub: 'The bridge that joined Buda and Pest, guarded by stone lions.',
      facts: [['Opened', '1849'], ['Designer', 'William Tierney Clark'], ['Rebuilt', '1949, after WWII'], ['Getting there', 'Tram 2 · Bus 16']],
      text: "The first permanent bridge across the Danube in Budapest, and the reason Buda and Pest began to function as one city. The four lions at the abutments are a local legend, since the story goes that they have no tongues (they do, you just can't see them from below).",
      tip: "Walk across at night when the chain is outlined in lights, then ride the Castle Hill Funicular (Sikló) up from the Buda end." },
    { id: 'bastion', cat: 'Views', name: "Fisherman's Bastion", sub: 'Seven fairytale turrets and the best terrace view in the city.',
      facts: [['Built', '1895–1902'], ['Architect', 'Frigyes Schulek'], ['Towers', '7, for the 7 Magyar tribes'], ['Getting there', 'Bus 16 / Funicular']],
      text: "A white neo-Romanesque terrace with cone-roofed towers, built purely for beauty, beside the Gothic Matthias Church with its patterned Zsolnay roof tiles. The view takes in Parliament and the whole Pest bank.",
      tip: "Come at sunrise or after dark for empty terraces. The upper terraces are ticketed during the day, but the walkways below stay open, so check current rules." },
    { id: 'castle', cat: 'History', name: 'Buda Castle', sub: 'A royal palace on a hill, now home to museums and galleries.',
      facts: [['Site', 'Castle Hill, 13th c. onward'], ['Today', 'National Gallery, History Museum'], ['UNESCO', 'Since 1987'], ['Getting there', 'Funicular or Bus 16']],
      text: "Kings have lived on this hill since the 13th century. The palace was rebuilt many times, most recently after wartime destruction. Today the Hungarian National Gallery and the Budapest History Museum occupy it, and the surrounding lanes are the old Castle District.",
      tip: "The courtyards and terraces are free to wander. Save the museums for a rainy afternoon." },
    { id: 'basilica', cat: 'Landmarks', name: "St. Stephen's Basilica", sub: 'The city\'s largest church, crowned with a panoramic dome.',
      facts: [['Completed', '1905'], ['Height', '96 m, as tall as Parliament'], ['Relic', "St. Stephen's Holy Right Hand"], ['Getting there', 'M1 Bajcsy-Zsilinszky út']],
      text: "Budapest's largest church shares its 96 m height with the Parliament on purpose: neither the church nor the state may rise above the other. A panorama walkway circles the dome for a 360° view over Pest.",
      tip: "Concerts are held inside regularly, and organ evenings are a gorgeous way to see the interior." },
    { id: 'szechenyi', cat: 'Baths', name: 'Széchenyi Thermal Bath', sub: 'Steaming outdoor pools beneath a golden neo-baroque palace.',
      facts: [['Opened', '1913'], ['Pools', '18 (indoor & outdoor)'], ['Water', 'Roughly 27–38 °C'], ['Getting there', 'M1 Széchenyi fürdő']],
      text: "Europe's largest medicinal bath complex, fed by natural hot springs. Locals play chess while neck-deep in 38 °C water, and winter evenings, with steam rising into the cold, are the stuff of memory.",
      tip: "Buy tickets online to skip the queue, bring flip-flops and a swimsuit, and go early on a weekday or in the evening to avoid crowds. Hot water plus alcohol is a poor idea." },
    { id: 'market', cat: 'Food & Drink', name: 'Great Market Hall', sub: 'A cathedral of paprika, salami and langos under a tiled roof.',
      facts: [['Opened', '1897'], ['Architect', 'Samu Pecz'], ['Closed', 'Sundays'], ['Getting there', 'Tram 47/49 · M4 Fővám tér']],
      text: "Ground-floor stalls sell produce, Tokaji wine, paprika and cured meats. Upstairs is the place for lángos (fried dough with sour cream and cheese) and a quick goulash. The roof is laid with colourful Zsolnay ceramic tiles.",
      tip: "Come on a weekday morning. Check the stall's prices before ordering. Paprika and local sausage make good gifts, and are cheaper here than in shops on Váci utca." },
    { id: 'ruin', cat: 'Nightlife', name: 'Ruin Bars', sub: 'Crumbling courtyards turned into the world\'s most original bars.',
      facts: [['Where', 'District VII, Jewish Quarter'], ['Pioneer', 'Szimpla Kert (2002)'], ['Vibe', 'Mismatched, eclectic, loud'], ['Getting there', 'M2 Astoria · Tram 4/6']],
      text: "Abandoned pre-war buildings were filled with thrift-shop furniture, bathtub sofas and fairy lights, and a new bar culture was born. Szimpla Kert is the original, but there are dozens within a few streets of each other.",
      tip: "Visit in the early evening for a calmer look, or on Sunday mornings when Szimpla hosts a farmers' market. Keep an eye on your belongings in busy bars." },
    { id: 'heroes', cat: 'History', name: "Heroes' Square", sub: 'A monumental stage for a thousand years of Hungarian history.',
      facts: [['Built', '1896–1900'], ['Column', 'Archangel Gabriel atop'], ['Statues', '14 national figures'], ['Getting there', 'M1 Hősök tere']],
      text: "Built for Hungary's millennium celebrations, with the seven chieftains of the Magyar tribes at the base and kings and statesmen in the colonnades. The Museum of Fine Arts and the Műcsarnok gallery frame the square.",
      tip: "Walk or ride the yellow M1 metro here along Andrássy út, then continue straight on into City Park and Széchenyi Baths." },
    { id: 'gellert', cat: 'Views', name: 'Gellért Hill & Citadella', sub: 'The highest viewpoint over the Danube, topped by Lady Liberty.',
      facts: [['Height', '235 m'], ['Citadella', '1850s fortress'], ['Liberty Statue', '1947'], ['Getting there', 'Tram 19/41 · then walk']],
      text: "A rocky hill above the river, once a vineyard, now a park with winding paths. The Citadella fortress and the 14 m Liberty Statue give you views of every bridge. At the foot is the Art Nouveau Gellért Bath, whose long renovation may affect access, so check ahead.",
      tip: "Allow 30-40 minutes to walk up from the Liberty Bridge. Sunset is the ideal time to go." },
    { id: 'shoes', cat: 'History', name: 'Shoes on the Danube Bank', sub: 'A quiet, moving memorial to the Jews killed here in 1944–45.',
      facts: [['Unveiled', '2005'], ['Artists', 'Can Togay & Gyula Pauer'], ['Pairs', '60 cast in iron'], ['Getting there', 'Tram 2 · Parliament']],
      text: "Sixty pairs of period shoes made of iron line the embankment, honouring the Jewish people shot into the river by the Arrow Cross in the winter of 1944–45. Visitors leave candles and flowers.",
      tip: "Visit respectfully and quietly. It is a memorial, not a photo backdrop. It is a short walk from Parliament." },
    { id: 'margaret', cat: 'Landmarks', name: 'Margaret Island', sub: 'A car-free green escape in the middle of the Danube.',
      facts: [['Length', 'About 2.5 km'], ['Highlights', 'Musical fountain, Japanese garden'], ['Rent', 'Bikes & pedal-karts'], ['Getting there', 'Tram 4/6 · Bus 26']],
      text: "A 2.5 km parkland island with rose gardens, a water tower, ruined medieval monasteries and thermal spas. Locals jog the 5.3 km running track that circles it. Mostly closed to cars.",
      tip: "Rent a bike or a four-person pedal buggy near the bridge entrance, and stay for the musical fountain show in the evening during the warm months." },
  ];
  const CATS = ['All', 'Landmarks', 'Views', 'History', 'Baths', 'Food & Drink', 'Nightlife'];

  const PLAN = {
    1: { title: 'The greatest hits in one long day', steps: [
      ['09:00', 'Great Market Hall', 'Coffee and a first taste of paprika, then walk the market before the crowds.'],
      ['10:30', 'Cross the Liberty Bridge', 'Walk to Buda and up Gellért Hill for the best view of the day.'],
      ['13:00', 'Castle District', "Fisherman's Bastion, Matthias Church, and lunch in a side street."],
      ['15:30', 'Chain Bridge to Pest', 'Walk across, then head to the Basilica and its dome walkway.'],
      ['18:30', 'Parliament & Shoes on the Danube', 'Evening light on the river, and a quiet moment at the memorial.'],
      ['21:00', 'Ruin bar crawl', 'Dinner in the Jewish Quarter, then Szimpla Kert and neighbours.'] ] },
    2: { title: 'Add baths, boulevards and culture', steps: [
      ['Day 1', 'Follow the one-day route', 'Market, Gellért Hill, Castle District, Parliament, ruin bars.'],
      ['09:30', 'Andrássy út by M1', "Ride the historic yellow metro to Heroes' Square and see the Opera House on the way."],
      ['11:00', 'City Park', "Vajdahunyad Castle, then relax at Széchenyi Baths: 2-3 hours."],
      ['15:30', 'Coffee like it\'s 1894', 'New York Café or Gerbeaud for dobos torta and a chandeliered ceiling.'],
      ['18:00', 'Sunset river cruise', 'Parliament lit up, bridges glowing.'],
      ['20:30', 'Dinner & jazz', 'Hungarian dinner and live music in District VII or VI.'] ] },
    3: { title: 'Dig deeper: history, greenery and the outskirts', steps: [
      ['Days 1–2', 'Follow the two-day route', 'All the essentials covered.'],
      ['09:30', 'Margaret Island', 'Rent a bike and loop the island.'],
      ['12:00', 'Óbuda & Aquincum', 'Roman ruins of the ancient city and the quieter side of Buda.'],
      ['15:00', 'Gellért Bath or Rudas Bath', 'Soak in the Ottoman-era Rudas dome, or a spa on the Buda bank.'],
      ['18:00', 'Wine & food in Buda', 'Víziváros wine bars, then dinner with a Hungarian wine flight.'],
      ['Option', 'Day trip', 'Szentendre (artists\' town), Visegrád (Danube Bend) or Eger for wine, all by train or bus.'] ] },
  };

  const DISHES = [
    ['Main', 'Gulyás', 'The famed paprika-and-beef soup is eaten as a meal, not a stew. Best with fresh bread.'],
    ['Street', 'Lángos', 'Deep-fried dough topped with garlic, sour cream and cheese. Share one, you will want a second.'],
    ['Main', 'Pörkölt & nokedli', 'Slow-braised paprika meat with small dumplings, the everyday classic.'],
    ['Sweet', 'Kürtőskalács', 'Chimney cake: a spiral of caramelised dough, baked over coals and rolled in cinnamon or walnut.'],
    ['Sweet', 'Dobos torta', "Five-layer sponge with chocolate cream and a caramel-glazed top, created in Budapest in 1885."],
    ['Drink', 'Tokaji Aszú', "The 'wine of kings', a golden sweet wine from the Tokaj region. Dry furmint is superb too."],
    ['Drink', 'Pálinka', 'Fruit brandy served in small glasses. Try plum (szilva) or apricot (barack). Say Egészségedre! (cheers)'],
    ['Local', 'Túrós csusza', 'Noodles with cottage cheese and crispy bacon, honest comfort food.'],
  ];

  const PRACT = [
    ['Money', 'Forint, not euro', '<p>Hungary uses the <b>forint (HUF)</b>. Cards and contactless work nearly everywhere. Use ATMs of banks, not the yellow standalone ones with poor exchange rates. When asked, always pay in <b>forints</b>, not your home currency.</p>'],
    ['Getting around', 'BudapestGO & the metro', '<ul><li>Buy tickets or passes with the <b>BudapestGO</b> app, and validate where required</li><li>24-hour and 72-hour travel cards pay off quickly</li><li>The historic M1 line is small and delightful</li><li>Night buses (9xxE) and trams (6, 4) run late</li></ul>'],
    ['Airport', 'Ferenc Liszt (BUD)', '<p>The <b>100E</b> airport express bus runs to Deák Ferenc tér in the centre. Taxis exist, but use the official airport taxi desk or ride-hailing apps (Bolt, Főtaxi) to avoid overcharging.</p>'],
    ['Safety', 'Generally very safe', '<p>Watch for pickpockets on trams, at Váci utca and in busy bars. Avoid unmarked taxis and restaurants that hide prices. Check the bill, as some include a service charge already.</p>'],
    ['Tipping', '10–15% is standard', '<p>Check whether a <b>service charge</b> is on the bill before tipping. If it is not, round up or add 10–15% for good service. Tell the waiter the total you want to pay when handing over cash.</p>'],
    ['Tap water', 'Safe to drink', '<p>Budapest tap water is safe. Carry a bottle. Thermal baths: bring a towel and flip-flops, or rent them at the entrance. A lock-and-key wristband is used for lockers.</p>'],
  ];

  const SEASONS = [
    ['Spring', 'Mar – May', 'Mild, 10–20 °C, blooming. Cherry blossoms and the Budapest Spring Festival fill the city with concerts. Cafés spill onto the sidewalks.'],
    ['Summer', 'Jun – Aug', 'Hot, often 25–35 °C. Outdoor bars, river life and long evenings, and the huge Sziget music festival in August. Baths are packed, so go late.'],
    ['Autumn', 'Sep – Nov', "Golden light and grape harvest. Comfortable 10–20 °C. Wine festivals, fewer crowds and perhaps the best season for walking."],
    ['Winter', 'Dec – Feb', 'Cold, often near 0 °C. Christmas markets in December (Vörösmarty tér, the Basilica), steaming outdoor baths and cheaper hotels.'],
  ];

  const PHRASES = [
    ['Jó napot kívánok', 'Good day (formal hello)', 'ˈyoː ˈnɒpot ˈkiːvaːnok'], ['Szia!', 'Hi / Bye (casual)', 'SEE-yaw'], ['Köszönöm', 'Thank you', 'KUH-suh-nuhm'],
    ['Kérem', 'Please / You\'re welcome', 'KAY-rem'], ['Igen / Nem', 'Yes / No', 'EE-gen / nem'], ['Elnézést', 'Excuse me / Sorry', 'EL-nay-zaysht'],
    ['Egészségedre!', 'Cheers!', 'EH-gays-shay-ged-reh'], ['Beszél angolul?', 'Do you speak English?', 'BEH-sayl AWN-go-lool'], ['Mennyibe kerül?', 'How much is it?', 'MEN-yi-beh KEH-rool'],
    ['A számlát kérem', 'The bill, please', 'aw SAAM-laat KAY-rem'], ['Hol van a…?', 'Where is the…?', 'hol vawn aw'], ['Finom volt!', 'It was delicious!', 'FEE-nom volt'],
  ];

  /* ---------- hero + mode ---------- */
  const root = document.documentElement;
  mountArt($('#heroArt'), 'parliament', 'hero');
  function setMode(m) { root.dataset.mode = m; $$('.toggle button').forEach(b => b.classList.toggle('on', b.dataset.m === m)); try { localStorage.setItem('bp-mode', m); } catch (e) {} }
  let saved; try { saved = localStorage.getItem('bp-mode'); } catch (e) {}
  setMode(saved || (new Date().getHours() >= 19 || new Date().getHours() < 6 ? 'night' : 'gold'));
  $$('.toggle button').forEach(b => b.onclick = () => setMode(b.dataset.m));

  /* ---------- sights ---------- */
  $('#chips').innerHTML = CATS.map((c, i) => `<button class="chip${i ? '' : ' on'}" data-c="${c}">${c}</button>`).join('');
  $('#grid').innerHTML = SIGHTS.map(s => `<button class="card rv" data-id="${s.id}" data-cat="${s.cat}"><div class="art" data-scene="${s.id}" data-photo="${s.id}"></div><div class="meta"><div class="tag">${s.cat}</div><h3>${s.name}</h3><p>${s.sub}</p></div></button>`).join('');
  $$('.card .art').forEach(a => mountArt(a, a.dataset.scene, a.dataset.photo));
  $('#chips').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip').forEach(x => x.classList.toggle('on', x === b));
    $$('.card').forEach(c => c.classList.toggle('hide', b.dataset.c !== 'All' && c.dataset.cat !== b.dataset.c)); };

  const modal = $('#modal'), sheet = $('#sheet');
  function openSight(id) {
    const s = SIGHTS.find(x => x.id === id);
    sheet.innerHTML = `<div class="art" id="mart"></div><div class="body"><div class="tag">${s.cat}</div><h3>${s.name}</h3><p>${s.text}</p><div class="facts">${s.facts.map(f => `<div>${f[0]}<b>${f[1]}</b></div>`).join('')}</div><div class="tip"><b>Insider tip · </b>${s.tip}</div></div>`;
    mountArt($('#mart'), s.id, s.id); modal.classList.add('open'); document.body.style.overflow = 'hidden'; $('#mclose').focus();
  }
  const closeM = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  $('#grid').onclick = e => { const c = e.target.closest('.card'); if (c) openSight(c.dataset.id); };
  $('#mclose').onclick = closeM; modal.onclick = e => { if (e.target === modal) closeM(); };
  addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

  /* ---------- itinerary ---------- */
  function showPlan(d) { const p = PLAN[d]; $('#tl').innerHTML = `<div class="day-title">${p.title}</div>` + p.steps.map(s => `<div class="step"><time>${s[0]}</time><div><h4>${s[1]}</h4><p>${s[2]}</p></div></div>`).join('');
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.d == d)); }
  $('#tabs').onclick = e => { const b = e.target.closest('button'); if (b) showPlan(b.dataset.d); }; showPlan(1);

  /* ---------- eat / practical / seasons / phrases ---------- */
  $('#eatGrid').innerHTML = DISHES.map(d => `<div class="dish"><i>${d[0]}</i><h4>${d[1]}</h4><p>${d[2]}</p></div>`).join('');
  $('#pract').innerHTML = PRACT.map(p => `<div class="pc"><h4><span>${p[0].toUpperCase()}</span>${p[1]}</h4>${p[2]}</div>`).join('');
  $('#sb').innerHTML = SEASONS.map((s, i) => `<button data-i="${i}" class="${i ? '' : 'on'}">${s[0]}</button>`).join('');
  function showSeason(i) { const s = SEASONS[i]; $('#sp').innerHTML = `<h3>${s[0]}</h3><div class="t">${s[1]}</div><p>${s[2]}</p>`; $$('#sb button').forEach((b, j) => b.classList.toggle('on', i == j)); }
  $('#sb').onclick = e => { const b = e.target.closest('button'); if (b) showSeason(+b.dataset.i); }; showSeason(0);
  $('#phr').innerHTML = PHRASES.map(p => `<button class="ph" data-t="${p[0]}"><div><b>${p[0]}</b><small>${p[1]} · <i>${p[2]}</i></small></div><em>copy</em></button>`).join('');
  $('#phr').onclick = e => { const b = e.target.closest('.ph'); if (!b) return; const em = $('em', b);
    (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.t) : Promise.reject()).then(() => em.textContent = 'copied ✓', () => em.textContent = 'select text'); setTimeout(() => em.textContent = 'copy', 1400); };

  /* ---------- chrome ---------- */
  const nav = $('#nav'); addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 60), { passive: true });
  $('#burger').onclick = () => $('#menu').classList.toggle('open'); $$('#menu a').forEach(a => a.onclick = () => $('#menu').classList.remove('open'));
  const art = $('#heroArt'); if (matchMedia('(pointer:fine)').matches) addEventListener('mousemove', e => { if (scrollY > innerHeight) return; art.style.transform = `scale(1.05) translate(${(e.clientX / innerWidth - .5) * -16}px,${(e.clientY / innerHeight - .5) * -10}px)`; });
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .08 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (el.classList.contains('card') ? (i % 3) * 90 : 0) + 'ms'; io.observe(el); });
})();
