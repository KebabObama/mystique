# SPŠT Maturitní práce - Typst šablona

Toto je šablona pro tvorbu maturitní práce na Střední průmyslové škole Třebíč pomocí [Typst](https://typst.app/).

## Jak používat

Na začátku souboru `thesis.typ` vyplňte základní údaje o práci, ty se sami doplní na příslušná místa v dokumentu.
Zbytek práce pak můžete psát dále v souboru `thesis.typ`, který se poté importuje do hlavního souboru `main.typ`.
Pro citace a tvorbu seznamu použité literatury je využíván formát [BibTeX](https://en.wikipedia.org/wiki/BibTeX). Citace lze vkládat pomocí příkazu `#cite("klíč")` nebo `@klíč`, kde `klíč` odpovídá klíči v souboru `works.bib`.  

Soubor do PDF lze zkompilovat jednoduše pomocí `typst compile main.typ`.

## Licence

Tento projekt je licencován pod [MIT licencí](LICENSE).

## Poděkování

Tato šablona využívá [modifikovanou šablonu pro citování dle normy ČSN ISO 690-2022](./iso690-2022.csl). Tato šablona používá licenci CC0 1.0 Universal. Původními autory jsou:
Marta Zizienová, Adam Zizien. Originální verze je dostupná online: https://github.com/zizienova/zoteroTUL2022