# Naturale - Platforma za učenje fizike kroz realne primere

Naturale je web platforma koja učenicima osnovnih i srednjih škola približava fiziku kroz realne primere i interaktivna predavanja. Omogućava administratorima da upravljaju sadržajem, objavljuju blogove, dodaju aktivnosti i informacije o članovima tima.

## Tehnologije

- **Frontend & Backend**: [Next.js 14](https://nextjs.org/) (App Router)
- **Stilizovanje**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Baza podataka**: [Prisma](https://www.prisma.io/) + PostgreSQL
- **Markdown podrška**: [react-markdown](https://github.com/remarkjs/react-markdown)

## Struktura projekta

```
naturale/
├── prisma/                # Prisma konfiguracija i šema baze podataka
├── public/                # Statički fajlovi (slike, fontovi, itd.)
├── src/
│   ├── app/               # Next.js stranice i rute
│   │   ├── (admin)/       # Admin deo sajta
│   │   ├── (main)/        # Glavni (javni) deo sajta
│   │   └── api/           # API rute
│   ├── components/        # React komponente
│   │   ├── ui/            # UI komponente (shadcn/ui)
│   │   ├── blog/          # Komponente za blog
│   │   ├── activities/    # Komponente za aktivnosti
│   │   ├── team/          # Komponente za tim
│   │   └── layouts/       # Layout komponente
│   └── lib/               # Biblioteke i pomočne funkcije
└── package.json           # NPM zavisnosti i skripte
```

## Funkcionalnosti

### Javni deo

- **Početna stranica** - Prikaz glavnih informacija o projektu Naturale
- **O projektu** - Detaljan opis misije, vizije i ciljeva projekta
- **Tim** - Prikaz članova tima sa detaljnim profilima
- **Aktivnosti** - Pregled prošlih i nadolazećih aktivnosti
- **Blog** - Obrazovni članci o fizici i nauci

### Admin panel

- **Upravljanje blogovima** - Dodavanje, izmena i brisanje blog postova sa Markdown editorom
- **Upravljanje aktivnostima** - Dodavanje, izmena i brisanje aktivnosti sa opcijom dodavanja slika
- **Upravljanje timom** - Dodavanje, izmena i brisanje članova tima
- **Podešavanja** - Upravljanje korisničkim profilom i podešavanjima notifikacija

## Pokretanje projekta lokalno

### Preduslovi

- Node.js 18+ i npm
- PostgreSQL baza podataka

### Koraci za instalaciju

1. Klonirati repozitorijum:
   ```bash
   git clone https://github.com/vaša-organizacija/naturale.git
   cd naturale
   ```

2. Instalirati zavisnosti:
   ```bash
   npm install
   ```

3. Konfigurisati okruženje:
   - Kreirati `.env` fajl na osnovu `.env.example`
   - Podesiti vezu sa bazom podataka u `.env` fajlu

4. Inicijalizovati bazu podataka:
   ```bash
   npx prisma migrate dev
   ```

5. Pokrenuti razvojni server:
   ```bash
   npm run dev
   ```

6. Otvoriti [http://localhost:3000](http://localhost:3000) u pregledaču

## Produkciono pokretanje

Za pokretanje u produkcionom okruženju:

```bash
npm run build
npm start
```

## Autori

- Tim Naturale

## Licenca

Ovaj projekat je pod [MIT licencom](LICENSE).
