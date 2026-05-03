# Mini Anki

Mini Anki to prosta lokalna aplikacja do nauki slowek metoda fiszek. Dziala w przegladarce, zapisuje dane w `localStorage` i pozwala dodawac wlasne slowniki, generowac przykladowe zdania przez OpenAI oraz odtwarzac wymowe.

## Funkcje

- nauka fiszek w trybie powtorek,
- oceny odpowiedzi: `Jeszcze raz`, `Trudna`, `Umiem`, `Latwa`,
- limit nowych kart na dzien,
- dodawanie slowek w roznych jezykach,
- automatyczne generowanie tlumaczenia i zdania przez OpenAI,
- odtwarzanie slowa oraz zdania jako audio,
- import i eksport kart do pliku JSON,
- jasny i ciemny motyw,
- zapis danych lokalnie w przegladarce.

## Uruchamianie

Projekt nie wymaga instalowania zaleznosci ani serwera.

1. Otworz plik `index.html` w przegladarce.
2. Korzystaj z aplikacji lokalnie.

Mozesz tez uruchomic prosty serwer statyczny, jesli wolisz pracowac pod adresem `localhost`:

```bash
python -m http.server 8000
```

Potem otworz:

```text
http://localhost:8000
```

## Jak uzywac

### Nauka

1. Wejdz w zakladke `Nauka`.
2. Przeczytaj zdanie na fiszce.
3. Kliknij `Pokaz odpowiedz`, aby zobaczyc tlumaczenie.
4. Ocen odpowiedz:
   - `Jeszcze raz` - gdy nie pamietasz,
   - `Trudna` - gdy odpowiedz byla trudna,
   - `Umiem` - gdy odpowiedz byla poprawna,
   - `Latwa` - gdy znasz karte bardzo dobrze.

Karty pojawia sie ponownie po czasie zaleznym od wybranej oceny.

### Dodawanie kart

1. Wejdz w zakladke `Dodaj`.
2. Wybierz slownik albo utworz nowy.
3. Wybierz jezyk, ktory znasz, oraz jezyk, ktorego sie uczysz.
4. Wpisz slowko.
5. Uzupelnij tlumaczenie i zdanie recznie albo uzyj `Generuj AI`.
6. Kliknij `Dodaj karte`.

### OpenAI i audio

Funkcje `Generuj AI`, `Odtworz slowo` i `Odtworz zdanie` wymagaja klucza OpenAI API.

1. Wklej klucz w polu `Klucz OpenAI API`.
2. Klucz zostanie zapisany tylko lokalnie w tej przegladarce.
3. Aplikacja uzyje go bezposrednio z poziomu przegladarki.

Uwaga: nie publikuj tej aplikacji z wpisanym kluczem API. Klucz jest prywatny i powinien byc uzywany tylko lokalnie.

### Import i eksport

W zakladce `Karty` mozesz:

- kliknac `Eksport`, aby pobrac wszystkie karty jako plik JSON,
- kliknac `Import`, aby wczytac wczesniej zapisany plik JSON,
- zmienic limit `Nowe/dzien`.

## Skroty klawiaturowe

Podczas nauki:

- `Spacja` - pokazuje odpowiedz,
- `1` - Jeszcze raz,
- `2` - Trudna,
- `3` - Umiem,
- `4` - Latwa.

## Struktura projektu

```text
.
|-- index.html   # struktura aplikacji
|-- styles.css   # wyglad i responsywnosc
`-- app.js       # logika fiszek, AI, audio, import/eksport
```

## Dane i prywatnosc

Aplikacja zapisuje dane w `localStorage` przegladarki:

- fiszki,
- ustawienia,
- wybrany motyw,
- klucz OpenAI API, jesli go wpiszesz.

Usuniecie danych strony w przegladarce moze skasowac zapisane karty. Przed czyszczeniem danych warto uzyc eksportu.

## Rozwoj

To mala aplikacja frontendowa bez procesu budowania. Po zmianach w plikach wystarczy odswiezyc strone w przegladarce.

Przydatne pomysly na dalszy rozwoj:

- edycja istniejacych kart,
- filtrowanie po slownikach,
- potwierdzenie przed usuwaniem,
- statystyki nauki,
- synchronizacja miedzy urzadzeniami.
