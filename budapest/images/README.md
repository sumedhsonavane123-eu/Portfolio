# Drop real photos here (optional)

Every landmark card, the hero, and the pop-up detail view already show a crisp vector illustration.
To upgrade any of them to a real photograph, add files named after the slot. The page picks them up
automatically and fades them in over the illustration. Missing files are simply ignored.

| Slot name   | Shows           |
|-------------|-----------------|
| hero        | Home page hero  |
| parliament, chain, bastion, castle, basilica, szechenyi, market, ruin, heroes, gellert, shoes, margaret | Matching card |

Per slot, supply any of (browser picks by screen size):

- `<slot>-1600.jpg`  (1600 px wide)
- `<slot>-2560.jpg`  (2560 px wide, QHD / retina)
- `<slot>-3840.jpg`  (3840 px wide, 4K)
- `<slot>.jpg`       (fallback)

Tips: export at 80-85% JPEG quality (a 4K photo is typically 1-2 MB), and keep a landscape crop.
Use photos you own, or properly licensed ones (e.g. Wikimedia Commons CC-BY / CC0), and add
attribution in the page footer where the licence requires it.
