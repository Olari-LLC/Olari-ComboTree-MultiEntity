## [1.0.1] - 2026-03-04

- Added release note coverage for DataGrid Core usage.
- Updated naming fields to follow `olari.<widgetname>` conventions across package metadata.
- Clarified that selection output can be handled fully in-widget through level-specific reference set outputs:
  - `selectedLevel1RefSet`
  - `selectedLevel2RefSet`
  - `selectedLevel3RefSet`
- Removed legacy `selectedValues` output to keep association-only persistence.

## [1.0.0] - 2026-03-04

- Initial `olari.combotreemultientity` widget implementation.
- Added multi-entity tree composition using:
  - Level 1 data source (root)
  - Level 2 data source with Level 2 -> Level 1 reference
  - Optional Level 3 data source with Level 3 -> Level 2 reference
- Added optional entity badges in web/native tree nodes.
- Added direct association outputs per level:
  - `selectedLevel1RefSet`
  - `selectedLevel2RefSet`
  - `selectedLevel3RefSet`
- Initial implementation included prefixed `selectedValues` output (removed in 1.0.1).
- Kept selection/filtering behavior from ComboTree, including select-all and keyboard navigation.
- Updated toolbox display name to `ComboTree MultiEntity`.
- Updated package metadata and module path for the new widget package.
