# ComboTree Multi Entity (Web + Native)

`olari.combotreemultientity` is a Mendix pluggable widget that builds a single tree from up to 3 related entities.

## What is new

- Separate data sources for level 1, level 2, and optional level 3
- Parent-child linking through association references
- Existing ComboTree behavior kept: single/multi select, filtering, select all, keyboard navigation, read-only modes
- Entity badges in the dropdown (for example: Country, State/Province, County)

## Hierarchy setup example

1. Level 1 data source: `Country`
2. Level 2 data source: `StateProvince`
3. Level 2 parent reference: association from `StateProvince` to `Country`
4. Enable level 3 and set:
   - Level 3 data source: `County`
   - Level 3 parent reference: association from `County` to `StateProvince`

## Selection output

Primary output (recommended):

- `selectedLevel1RefSet`: selected level 1 objects
- `selectedLevel2RefSet`: selected level 2 objects
- `selectedLevel3RefSet`: selected level 3 objects

## Scripts

- `npm run lint`: format + eslint checks
- `npm run build`: web + native build
- `npm run release`: web production release

## Build output

- `dist/1.0.0/olari.combotreemultientity.ComboTree.mpk`
