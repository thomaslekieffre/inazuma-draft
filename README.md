# Inazuma Draft

> Draft ton **Inazuma Japan**. Remporte le **FFI**.

Fan game inspiré de *Inazuma Eleven* — draft 11 joueurs, compose ton équipe, simule le tournoi FFI Saison 1 (Liocott Island).

**Fan project — non affilié Level-5.**

---

## Jouer

```bash
npm install
npm run dev
```

→ [http://localhost:5173](http://localhost:5173)

Build prod : `npm run build` · preview : `npm run preview`

---

## Modes

| Mode | Description |
|------|-------------|
| **Classic** | Stats visibles — draft en connaissance de cause, power rating affiché |
| **Mémoire** | Pas de stats — draft de mémoire pure |

---

## Règles

### Draft (11 rounds)
- Chaque round : **roll** une équipe FFI → pick **un joueur** de ce roster uniquement
- **3 relances au total** sur tout le draft (pas par round)
- Postes stricts (GK / DF / MF / FW), placement auto sur le terrain

### Lineup
- Compose tes 11 joueurs
- Formations : **4-3-3** · **4-4-2** · **3-5-2** · **4-2-3-1**
- Chaque joueur sur un slot compatible avec son poste

### Tournoi FFI
- **Poule A** (5 équipes) : 4 matchs joueur vs Orpheus, Unicorn, Queen, Empire
- Top 2 qualifié → demi vs 2e du Bloc B → finale vs 1er du Bloc B
- Matchs IA simulés en arrière-plan
- Sim basée sur power rating + éléments + RNG

---

## Contenu

- **403 joueurs** (stats IE3, 26 équipes draftables)
- **9 adversaires FFI** (Orpheus → Little Gigant)
- Rosters canon : [Fandom IE3](https://inazuma-eleven.fandom.com) → `scripts/fandom-rosters-final.json`
- Regénérer la DB : `npm run data:rebuild` · vérifier : `npm run data:audit`
- Portraits joueurs (scrapes + fallbacks)
- **FR / EN** · thème clair / sombre

---

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 3

---

## Auteur

**Thomas Lekieffre**

- [GitHub](https://github.com/thomaslekieffre)
- [X / Twitter](https://x.com/thomasdev59)
- [Soutenir le projet](https://paypal.me/tlekieffredev)

---

## Licence & disclaimer

Projet fan gratuit. *Inazuma Eleven* © Level-5. Aucune affiliation, endorsement ou revendication de propriété intellectuelle.
