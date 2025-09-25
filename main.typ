
#let thesis = (
  name: "Název maturitní práce",
  major: "Informační technologie",
  class: "ITB4",
  year: 2024,
  author: "Jméno Příjmení",
  abstract-cs: par([
    Tvorba maturitní práce je jedním z velmi klíčových momentů při studiu. Kvalita zpracování její formální části je pak jedním z nejdůležitějších kritérií při jejím hodnocení. Cíl této práce je popsat jednotlivé kroky během tohoto procesu, doporučit postupy a vytvořit šablonu, která usnadní celý proces.@ujc_tecka
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
  ])
)

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
#set par(leading: 0.75em, spacing: 0.75em + 6pt, justify: true)
#show heading.where(level: 1): set text(size: 20pt, weight: "bold")
#show heading.where(level: 2): set text(size: 16pt, weight: "bold")
#show heading.where(level: 3): set text(size: 14pt, weight: "bold")
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

#heading(level: 1, outlined: false, [ABSTRACT])

#thesis.abstract-en

#heading(level: 1, outlined: false, [KEYWORDS])

#thesis.keywords-en

#pagebreak()

#heading(level: 1, outlined: false, [PODĚKOVÁNÍ])

#thesis.acknowledgements

#set align(left + bottom)

#heading(level: 1, outlined: false, [PROHLÁŠENÍ])

#par([
  Prohlašuji, že jsem tuto práci vypracoval/a samostatně a uvedl/a v ní všechny prameny, literaturu a ostatní zdroje, které jsem použil/a.
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

#show outline.entry.where(
  level: 1
).or(
  outline.entry.where(level: 2)
): it => {
  strong(it)
}


#outline(depth: 3)

#set page(footer: context [
  #set align(center)
  #set text(size: 10pt)
  #counter(page).display("1")
])

= Úvod

// Úvod zde

#set heading(numbering: "1")

// Samotná práce zde

#pagebreak()

#bibliography("works.bib", title: "Seznam použité literatury", style: "iso-690-numeric")