# point-game

Egy mobil/tablet készülékekre szánt böngészős játék elkészítése lenne a feladat Vue.js keretrendszerben, a kódot Git-ben tárolva.

A koncepció alapja a papíros pontösszekötős játékok, ahol meg vannak adva számozott pontok, amiket ceruzával össze kell kötni sorrendben, hogy kialakuljon egy kép.

A játékot mi 2 résztvevőnek szánjuk olyan módon, hogy:

1. Az első játékos egy tiszta fehér "vászonra" rajzol valamit az ujjával (érintőkijelzőn) - 1 vonallal.
2. A program gombnyomásra ebből a vonalból egy pontozott vonalat generál, a pontok között egységes távolságot tartva. Emellett a pontok mellé ír sorszámokat.
3. Az első játékos átadja az eszközt a második játékosnak.
4. A második játékosnak össze kell kötnie a pontokat sorrendben, hogy megkapja a képet. Ha minden pontot helyesen összekötött, akkor vége a játéknak.

A pontok összekötésére 2 lehetséges mód van, ebből az egyikre van szükségünk - Rád bízzuk, melyiket csinálod meg:

A) A játékos mindig csak 2 pontot köt össze.

- Leteszi az ujját a kiinduló ponton, húzza az ujját a kijelzőn a végpontra (közben a vonal folyamatosan látszódik és frissül az ujj pozíciójához - mint egy előnézet), és amikor felengedi az ujját, a vonal véglegesedik a kiinduló pont, és a felengedés pozíciójához legközelebb eső pont között.
- Ha nincs értelmes távolságban pont, akkor nem húzunk vonalat.
- Ha a sorszámok szerint rossz pont párt kötött össze, akkor a vonal pirossá válik.
- A játékban szükség van egy visszavonás gombra, amivel a legutóbbi vonal törölhető.

B) A második játékos az első játékoshoz hasonlóan teljesen szabadkézzel rajzolhat vonalat / vonalakat (ez további megbeszélés tárgya lehet).

- Ekkor is meg kéne oldani annak ellenőrzését, hogy jó pontokat kötött-e össze / nem-e hagyott ki pontokat. Pl. a pontoknak lehetne egy "türelmi" sugarú köre, amiket érinteni kell.
- A rosszul összekötött pontok pirossá válnak.
- A játékban szükség van egy radír gombra (ha egy vonalat rajzolhat), vagy visszavonás gombra (ha több vonalat rajzolhat).

Ha ez a mechanika már működik, akkor be lehet vezetni a nehézségi szinteket, amikből az első játékos választ rajzolás előtt:

- könnyű: a pontokat csak simán megsorszámozzuk 1-től N-ig
- közepes: a rajz pontjai valamilyen matematikai sorozat szerint kapják a számokat (pl. páros számok, 3-mal oszthatók), és a program további random pontokat generál a rajzot alkotó pontoktól megfelelő távolságban, hogy az összes természetes számnak (a legmagasabb játékban részt vevő számig) legyen egy pontja (ezek a plusz pontok a nehezítések). A 2. játékosnak ki kell írni a képernyő tetején az instrukciót.
- nehéz: ugyanaz, mint a közepes, csak nehezebb sorozatokkal (pl. 4-gyel, 5-tel oszthatók).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
"# point_game" 
