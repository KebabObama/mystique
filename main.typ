
#import "@preview/codly:1.3.0": *
#import "@preview/codly-languages:0.1.1": *
#show: codly-init.with()

#codly(languages: codly-languages, zebra-fill: none, display-icon: false, display-name: false)
#import "thesis.typ": thesis

#set page(
  paper: "a4",
  margin: (
    left: 4cm,
    right: 2.5cm,
    top: 3cm,
    bottom: 3cm,
  ),
)

#set text(font: "Times New Roman", size: 12pt, lang: "cs")
#show heading: set block(below: 16pt, above: 16pt)
#show math.equation: set text(size: 16pt)
#set figure(gap: 1.5em)
#show figure: set block(below: 16pt, above: 16pt)
#set par(first-line-indent: (amount: 2em, all: true))
#set par(leading: 1.5em, spacing: 0.75em + 6pt, justify: true)
#show heading.where(level: 1): set text(size: 20pt, weight: "bold")
#show heading.where(level: 2): set text(size: 16pt, weight: "bold")
#show heading.where(level: 3): set text(size: 14pt, weight: "bold")
#show figure.where(kind: "code"): set figure(supplement: "Výpis")
#set align(center)

#grid(
  columns: 2,
  align: horizon,
  column-gutter: 0.5cm,
  [
    #image("res/logo.svg", width: 1.77in)
  ],
  [
    #text(
      "Střední průmyslová škola Třebíč",
      size: 16pt,
      font: "Arial",
      weight: "bold",
      fill: rgb("#1F3864"),
    )
  ],
)

#set align(center + horizon)

#heading(level: 3, outlined: false, [Maturitní práce])
#heading(level: 2, outlined: false, [#upper(thesis.name)])
#heading(level: 3, outlined: false, [Profilová část maturitní zkoušky])

#set align(left + bottom)

#table(
  columns: 2,
  stroke: none,
  [
    #text("Studijní obor:")
  ],
  [
    #text(thesis.major)
  ],

  [
    Třída:
    #text(thesis.class)
  ],
  [],

  [
    Školní rok:
  ],
  [
    #text(str(thesis.year))
    #text(thesis.author)
  ],
)

#pagebreak()

#set align(left + top)
#heading(level: 1, outlined: false, [Zadání práce])
#thesis.assignment

#pagebreak()

#heading(level: 1, outlined: false, [ABSTRAKT])
#thesis.abstract-cs

#heading(level: 1, outlined: false, [KLÍČOVÁ SLOVA])
#thesis.keywords-cs

#pagebreak()

#heading(level: 1, outlined: false, [ABSTRACT])
#thesis.abstract-en

#heading(level: 1, outlined: false, [KEYWORDS])
#thesis.keywords-en

#pagebreak()

#heading(level: 1, outlined: false, [PODĚKOVÁNÍ])
#thesis.acknowledgements

#pagebreak()

#set align(left + bottom)
#heading(level: 1, outlined: false, [PROHLÁŠENÍ])

#par([
  Prohlašuji, že jsem tuto práci vypracoval/a samostatně a uvedl/a v ní všechny prameny, literaturu a ostatní zdroje, které jsem použil/a. Pro vypracování této práce byla
  použita šablona pro citování podle normy ČSN ISO 690-2022, kterou vytvořili Marta Zizienová a Adam Zizien, licencovaná pod Creative Commons Zero v1.0 Universal.
])

#v(3em)

#par([
  V Třebíči dne 15. května 2024
])

#set align(right)

#par([
  Podpis autora
])

#pagebreak()

#set align(left + top)

#[
  #show (
    outline
      .entry
      .where(
        level: 1,
      )
      .or(
        outline.entry.where(level: 2),
      )
  ): it => {
    strong(it)
  }
  #outline(depth: 3)
]

#set page(footer: context [
  #set align(center)
  #set text(size: 10pt)
  #counter(page).display("1")
])

#include "thesis.typ"

#pagebreak()

#bibliography("works.bib", title: "Seznam použité literatury", style: "iso690-2022.csl")

#pagebreak()

#outline(
  title: heading(level: 1, outlined: true, [Seznam obrázků]),
  target: figure.where(kind: image),
)

#pagebreak()

#outline(
  title: heading(level: 1, outlined: true, [Seznam tabulek]),
  target: figure.where(kind: table),
)