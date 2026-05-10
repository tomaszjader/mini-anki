# Mini Anki

README jest dostępne w dwóch językach:

- [Polski](#polski)
- [English](#english)

---

## Polski

Mini Anki to prosta lokalna aplikacja do nauki słówek metodą fiszek. Działa w przeglądarce, zapisuje dane w `localStorage` i pozwala tworzyć własne słowniki, uczyć się kart w trybie powtórek, generować przykładowe zdania przez OpenAI oraz odtwarzać wymowę.

### Funkcje

- nauka fiszek w trybie powtórek,
- oceny odpowiedzi: `Jeszcze raz`, `Trudna`, `Umiem`, `Łatwa`,
- limit nowych kart na dzień,
- dodawanie słówek w wielu językach,
- automatyczne generowanie tłumaczenia i zdania przez OpenAI,
- odtwarzanie słowa oraz zdania jako audio,
- wyszukiwanie kart,
- import i eksport kart do pliku JSON,
- jasny i ciemny motyw,
- zapis danych lokalnie w przeglądarce.

### Uruchamianie

Projekt nie wymaga instalowania zależności ani procesu budowania.

1. Otwórz plik `index.html` w przeglądarce.
2. Korzystaj z aplikacji lokalnie.

Możesz też uruchomić prosty serwer statyczny:

```bash
python -m http.server 8000
```

Potem otwórz:

```text
http://localhost:8000
```

### Jak używać

#### Nauka

1. Wejdź w zakładkę `Nauka`.
2. Przeczytaj zdanie na fiszce.
3. Kliknij `Pokaż odpowiedź`, aby zobaczyć tłumaczenie.
4. Oceń odpowiedź:
   - `Jeszcze raz` - gdy nie pamiętasz,
   - `Trudna` - gdy odpowiedź była trudna,
   - `Umiem` - gdy odpowiedź była poprawna,
   - `Łatwa` - gdy znasz kartę bardzo dobrze.

Karty pojawią się ponownie po czasie zależnym od wybranej oceny.

#### Dodawanie kart

1. Wejdź w zakładkę `Dodaj`.
2. Wybierz słownik albo utwórz nowy.
3. Wybierz język, który znasz, oraz język, którego się uczysz.
4. Wpisz słówko.
5. Uzupełnij tłumaczenie i zdanie ręcznie albo użyj `Generuj AI`.
6. Kliknij `Dodaj kartę`.

#### OpenAI i audio

Funkcje `Generuj AI`, `Odtwórz słowo` i `Odtwórz zdanie` wymagają klucza OpenAI API.

1. Wklej klucz w polu `Klucz OpenAI API`.
2. Klucz zostanie zapisany tylko lokalnie w tej przeglądarce.
3. Aplikacja użyje go bezpośrednio z poziomu przeglądarki.

Uwaga: nie publikuj tej aplikacji z wpisanym kluczem API. Klucz jest prywatny i powinien być używany tylko lokalnie.

#### Import i eksport

W zakładce `Karty` możesz:

- kliknąć `Eksport`, aby pobrać wszystkie karty jako plik JSON,
- kliknąć `Import`, aby wczytać wcześniej zapisany plik JSON,
- wyszukiwać karty po słówku,
- zmienić limit `Nowe/dzień`.

### Skróty klawiaturowe

Podczas nauki:

- `Spacja` - pokazuje odpowiedź,
- `1` - Jeszcze raz,
- `2` - Trudna,
- `3` - Umiem,
- `4` - Łatwa.

### Struktura projektu

```text
.
|-- index.html   # struktura aplikacji
|-- styles.css   # wygląd i responsywność
|-- config.js    # stałe, języki i interwały powtórek
|-- i18n.js      # tłumaczenia interfejsu
|-- cards.js     # model kart i logika powtórek
|-- storage.js   # zapis i odczyt localStorage
|-- openai.js    # generowanie AI i audio
`-- app.js       # UI, renderowanie i zdarzenia
```

### Dane i prywatność

Aplikacja zapisuje dane w `localStorage` przeglądarki:

- fiszki,
- ustawienia,
- wybrany motyw,
- klucz OpenAI API, jeśli go wpiszesz.

Usunięcie danych strony w przeglądarce może skasować zapisane karty. Przed czyszczeniem danych warto użyć eksportu.

### Rozwój

To mała aplikacja frontendowa bez procesu budowania. Po zmianach w plikach wystarczy odświeżyć stronę w przeglądarce.

Pomysły na dalszy rozwój:

- statystyki nauki,
- lepszy raport importu dla dużych plików,
- synchronizacja między urządzeniami.

---

## English

Mini Anki is a small local flashcard app for learning vocabulary. It runs in the browser, stores data in `localStorage`, and lets you create custom dictionaries, review cards, generate example sentences with OpenAI, and play pronunciation audio.

### Features

- flashcard review mode,
- answer ratings: `Again`, `Hard`, `Good`, `Easy`,
- daily limit for new cards,
- vocabulary cards in multiple languages,
- automatic translation and sentence generation with OpenAI,
- audio playback for words and sentences,
- card search,
- JSON import and export,
- light and dark theme,
- local browser storage.

### Running

The project does not require dependencies or a build step.

1. Open `index.html` in your browser.
2. Use the app locally.

You can also run a simple static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### How to Use

#### Studying

1. Open the `Nauka` tab.
2. Read the sentence on the flashcard.
3. Click `Pokaż odpowiedź` to reveal the translation.
4. Rate your answer:
   - `Jeszcze raz` - if you did not remember it,
   - `Trudna` - if it was difficult,
   - `Umiem` - if you answered correctly,
   - `Łatwa` - if you know the card very well.

Cards return later based on the rating you choose.

#### Adding Cards

1. Open the `Dodaj` tab.
2. Choose a dictionary or create a new one.
3. Choose the language you know and the language you are learning.
4. Enter the word.
5. Fill in the translation and example sentence manually, or use `Generuj AI`.
6. Click `Dodaj karte`.

#### OpenAI and Audio

The `Generuj AI`, `Odtwórz słowo`, and `Odtwórz zdanie` features require an OpenAI API key.

1. Paste the key into the `Klucz OpenAI API` field.
2. The key is stored only locally in this browser.
3. The app uses it directly from the browser.

Note: do not publish this app with an API key entered. The key is private and should be used only for local personal learning.

#### Import and Export

In the `Karty` tab you can:

- click `Eksport` to download all cards as a JSON file,
- click `Import` to load a previously saved JSON file,
- search cards by word,
- change the `Nowe/dzień` limit.

### Keyboard Shortcuts

During study:

- `Space` - reveal the answer,
- `1` - Again,
- `2` - Hard,
- `3` - Good,
- `4` - Easy.

### Project Structure

```text
.
|-- index.html   # app structure
|-- styles.css   # styling and responsiveness
|-- config.js    # constants, languages, and review intervals
|-- i18n.js      # UI translations
|-- cards.js     # card model and review logic
|-- storage.js   # localStorage persistence
|-- openai.js    # AI generation and audio
`-- app.js       # UI, rendering, and events
```

### Data and Privacy

The app stores data in browser `localStorage`:

- flashcards,
- settings,
- selected theme,
- OpenAI API key, if you enter one.

Clearing site data in the browser may delete saved cards. Export your cards before clearing browser data.

### Development

This is a small frontend app with no build process. After changing files, refresh the page in the browser.

Ideas for future development:

- editing existing cards,
- filtering by dictionary,
- confirmation before deleting,
- learning statistics,
- sync between devices.
