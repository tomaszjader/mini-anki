# Mini Anki

README jest dostepne w dwoch jezykach:

- [Polski](#polski)
- [English](#english)

---

## Polski

Mini Anki to prosta lokalna aplikacja do nauki slowek metoda fiszek. Dziala w przegladarce, zapisuje dane w `localStorage` i pozwala tworzyc wlasne slowniki, uczyc sie kart w trybie powtorek, generowac przykladowe zdania przez OpenAI oraz odtwarzac wymowe.

### Funkcje

- nauka fiszek w trybie powtorek,
- oceny odpowiedzi: `Jeszcze raz`, `Trudna`, `Umiem`, `Latwa`,
- limit nowych kart na dzien,
- dodawanie slowek w wielu jezykach,
- automatyczne generowanie tlumaczenia i zdania przez OpenAI,
- odtwarzanie slowa oraz zdania jako audio,
- wyszukiwanie kart,
- import i eksport kart do pliku JSON,
- jasny i ciemny motyw,
- zapis danych lokalnie w przegladarce.

### Uruchamianie

Projekt nie wymaga instalowania zaleznosci ani procesu budowania.

1. Otworz plik `index.html` w przegladarce.
2. Korzystaj z aplikacji lokalnie.

Mozesz tez uruchomic prosty serwer statyczny:

```bash
python -m http.server 8000
```

Potem otworz:

```text
http://localhost:8000
```

### Jak uzywac

#### Nauka

1. Wejdz w zakladke `Nauka`.
2. Przeczytaj zdanie na fiszce.
3. Kliknij `Pokaz odpowiedz`, aby zobaczyc tlumaczenie.
4. Ocen odpowiedz:
   - `Jeszcze raz` - gdy nie pamietasz,
   - `Trudna` - gdy odpowiedz byla trudna,
   - `Umiem` - gdy odpowiedz byla poprawna,
   - `Latwa` - gdy znasz karte bardzo dobrze.

Karty pojawia sie ponownie po czasie zaleznym od wybranej oceny.

#### Dodawanie kart

1. Wejdz w zakladke `Dodaj`.
2. Wybierz slownik albo utworz nowy.
3. Wybierz jezyk, ktory znasz, oraz jezyk, ktorego sie uczysz.
4. Wpisz slowko.
5. Uzupelnij tlumaczenie i zdanie recznie albo uzyj `Generuj AI`.
6. Kliknij `Dodaj karte`.

#### OpenAI i audio

Funkcje `Generuj AI`, `Odtworz slowo` i `Odtworz zdanie` wymagaja klucza OpenAI API.

1. Wklej klucz w polu `Klucz OpenAI API`.
2. Klucz zostanie zapisany tylko lokalnie w tej przegladarce.
3. Aplikacja uzyje go bezposrednio z poziomu przegladarki.

Uwaga: nie publikuj tej aplikacji z wpisanym kluczem API. Klucz jest prywatny i powinien byc uzywany tylko lokalnie.

#### Import i eksport

W zakladce `Karty` mozesz:

- kliknac `Eksport`, aby pobrac wszystkie karty jako plik JSON,
- kliknac `Import`, aby wczytac wczesniej zapisany plik JSON,
- wyszukiwac karty po slowku,
- zmienic limit `Nowe/dzien`.

### Skroty klawiaturowe

Podczas nauki:

- `Spacja` - pokazuje odpowiedz,
- `1` - Jeszcze raz,
- `2` - Trudna,
- `3` - Umiem,
- `4` - Latwa.

### Struktura projektu

```text
.
|-- index.html   # struktura aplikacji
|-- styles.css   # wyglad i responsywnosc
`-- app.js       # logika fiszek, AI, audio, import/eksport
```

### Dane i prywatnosc

Aplikacja zapisuje dane w `localStorage` przegladarki:

- fiszki,
- ustawienia,
- wybrany motyw,
- klucz OpenAI API, jesli go wpiszesz.

Usuniecie danych strony w przegladarce moze skasowac zapisane karty. Przed czyszczeniem danych warto uzyc eksportu.

### Rozwoj

To mala aplikacja frontendowa bez procesu budowania. Po zmianach w plikach wystarczy odswiezyc strone w przegladarce.

Pomysly na dalszy rozwoj:

- edycja istniejacych kart,
- filtrowanie po slownikach,
- potwierdzenie przed usuwaniem,
- statystyki nauki,
- synchronizacja miedzy urzadzeniami.

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
3. Click `Pokaz odpowiedz` to reveal the translation.
4. Rate your answer:
   - `Jeszcze raz` - if you did not remember it,
   - `Trudna` - if it was difficult,
   - `Umiem` - if you answered correctly,
   - `Latwa` - if you know the card very well.

Cards return later based on the rating you choose.

#### Adding Cards

1. Open the `Dodaj` tab.
2. Choose a dictionary or create a new one.
3. Choose the language you know and the language you are learning.
4. Enter the word.
5. Fill in the translation and example sentence manually, or use `Generuj AI`.
6. Click `Dodaj karte`.

#### OpenAI and Audio

The `Generuj AI`, `Odtworz slowo`, and `Odtworz zdanie` features require an OpenAI API key.

1. Paste the key into the `Klucz OpenAI API` field.
2. The key is stored only locally in this browser.
3. The app uses it directly from the browser.

Note: do not publish this app with an API key entered. The key is private and should be used only for local personal learning.

#### Import and Export

In the `Karty` tab you can:

- click `Eksport` to download all cards as a JSON file,
- click `Import` to load a previously saved JSON file,
- search cards by word,
- change the `Nowe/dzien` limit.

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
`-- app.js       # flashcard, AI, audio, import/export logic
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
