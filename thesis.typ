#let thesis = (
  name: "Název maturitní práce",
  major: "Informační technologie",
  class: "ITB4",
  year: 2024,
  author: "Jméno Příjmení",
  abstract-cs: par([
    Tvorba maturitní práce je jedním z velmi klíčových momentů při studiu. Kvalita zpracování její formální části je pak jedním z nejdůležitějších kritérií při jejím hodnocení. Cíl této práce je popsat jednotlivé kroky během tohoto procesu, doporučit postupy a vytvořit šablonu, která usnadní celý proces.@ujc-tecka
  ]),
  abstract-en: par([
    The creation of a graduation thesis is one of the most crucial moments during studies. The quality of the processing of its formal part is then one of the most important criteria in its evaluation. The aim of this work is to describe the individual steps during this process, recommend procedures and create a template that will facilitate the entire process.
  ]),
  keywords-cs: par([
    maturitní práce, šablona
  ]),
  keywords-en: par([
    graduation thesis, template
  ]),
  acknowledgements: par([
    Děkuji Mgr. Petru Novotnému za cenné připomínky a rady, které mi poskytl při vypracování maturitní práce.
  ]),
  assignment: par([
    Zadání maturitní práce je přílohou této práce.
  ]),
)

= Úvod

// Úvod zde

#pagebreak()

#set heading(numbering: "1.1")

= Nadpis 1

#figure(
  [
    ```tsx
    import type React from "react";

    export default async function Page() {
      return <div>Hello, world!</div>;
    }
    ```
  ],
  supplement: "Výpis",
  caption: "Ukázka kódu v jazyce TypeScript s využitím knihovny React.",
)

#figure(
  table(
    columns: 4,
    [t], [1], [2], [3],
    [y], [0.3s], [0.4s], [0.8s],
  ),
  caption: [Časy],
)

#figure(
  image("res/logo.svg", width: 50%),
  caption: "Logo školy",
)

#figure(
  $x_(1,2) = frac(-b plus.minus sqrt(b^2 - 4 a c), 2a)$,
  kind: "equation",
  supplement: "Rovnice",
  caption: "Vzorec pro výpočet kvadratické rovnice",
)

== Nadpis 2
=== Nadpis 3
=== Nadpis 3

// Zbytek práce zde
