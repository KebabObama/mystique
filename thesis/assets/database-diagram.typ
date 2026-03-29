#import "@preview/fletcher:0.5.8": diagram, edge, node

#figure(
  diagram(
    spacing: (30mm, 5mm),
    node-stroke: 1pt,
    node-fill: luma(245),
    node-corner-radius: 0pt,
    node-shape: rect,
    edge-stroke: 1.25pt + luma(80),

    node((1, 0), align(center)[*user*\ #text(size: 8pt)[id · name · email\ image · created_at]], name: <user>),

    node((0, 1), align(center)[*session*\ #text(size: 8pt)[id · token · expires_at\ user_id]], name: <session>),
    node((1, 1), align(center)[*account*\ #text(size: 8pt)[id · provider_id\ account_id · user_id]], name: <account>),
    node(
      (2, 1),
      align(center)[*verification*\ #text(size: 8pt)[id · identifier\ value · expires_at]],
      name: <verification>,
    ),

    node(
      (0, 2),
      align(
        center,
      )[*character*\ #text(size: 8pt)[id · name · race · level\ owner_id · lobby_id\ attributes · hp · stamina]],
      name: <char>,
    ),
    node((2, 2), align(center)[*lobby*\ #text(size: 8pt)[id · name · data\ master_id · created_at]], name: <lobby>),

    node(
      (0, 3),
      align(center)[*inventory*\ #text(size: 8pt)[character_id · item_id\ quantity · equipped]],
      name: <inv>,
    ),
    node(
      (1, 3),
      align(center)[*lobby_member*\ #text(size: 8pt)[lobby_id · user_id\ last_seen · last_read_at]],
      name: <lm>,
    ),
    node((2, 3), align(center)[*message*\ #text(size: 8pt)[id · lobby_id\ sender_id · content]], name: <msg>),

    node((0, 4), align(center)[*item*\ #text(size: 8pt)[id · name · type\ weight · armor\ abilities]], name: <item>),
    node(
      (2, 4),
      align(
        center,
      )[*lobby_entity*\ #text(size: 8pt)[id · lobby_id · type\ character_id · monster_id\ chest_id · campfire_id\ position · actions]],
      name: <le>,
    ),

    node(
      (0, 5),
      align(center)[*monster*\ #text(size: 8pt)[id · name · level\ hp · armor · stamina\ abilities]],
      name: <mon>,
    ),
    node((1, 5), align(center)[*chest*\ #text(size: 8pt)[id · name\ mesh_path]], name: <chest>),
    node((2, 5), align(center)[*campfire*\ #text(size: 8pt)[id · name\ mesh_path]], name: <camp>),

    node((1, 6), align(center)[*chest_inventory*\ #text(size: 8pt)[chest_id · item_id\ quantity]], name: <ci>),
    node((2, 6), align(center)[*campfire_shop_item*\ #text(size: 8pt)[campfire_id · item_id\ cost]], name: <csi>),

    edge(<user>, <session>, "->"),
    edge(<user>, <account>, "->"),
    edge(<user>, <lobby>, "->", label: text(size: 7pt)[masters]),
    edge(<user>, <char>, "->", label: text(size: 7pt)[owns]),
    edge(<user>, <lm>, "->"),
    edge(<user>, <msg>, "->"),

    edge(<lobby>, <lm>, "->"),
    edge(<lobby>, <msg>, "->"),
    edge(<lobby>, <le>, "->"),
    edge(<lobby>, <char>, "->", label: text(size: 7pt)[hosts]),

    edge(<char>, <inv>, "->"),
    edge(<char>, <le>, "->"),

    edge(<item>, <inv>, "->"),
    edge(<item>, <ci>, "->"),
    edge(<item>, <csi>, "->"),

    edge(<mon>, <le>, "->"),
    edge(<chest>, <le>, "->"),
    edge(<camp>, <le>, "->"),

    edge(<chest>, <ci>, "->"),
    edge(<camp>, <csi>, "->"),
  ),
  caption: [Diagram databázove],
) <fig-er-diagram>
