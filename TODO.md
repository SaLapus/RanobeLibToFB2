# FB2Creator TODO List
*Last updated: May 2, 2025*

## Legend
- [!] High Priority
- [*] Current Task
- [-] Normal Priority
- [#] Low Priority
- [✓] Completed

## ChapterList Component
- [✓] Fix chapters overflowing in volume containers
- [#] Implement virtualization for large chapter lists
- [#] Add pagination or infinite scroll for better memory management
- [-] Add keyboard navigation between chapters
- [-] Implement drag-select for multiple chapters
- [-] Add search/filter functionality for chapters
- [-] Improve ARIA labels and roles
- [-] Add screen reader announcements for state changes

## Download Settings
- [-] Implement progress tracking for downloads
- [-] Add pause/resume functionality
- [-] Handle network failures gracefully with retries
- [-] Add batch size controls for parallel downloads
- [-] Show estimated time remaining
- [-] Add download speed indicator
- [-] Implement progress bar for each volume
- [-] Add configurable concurrent download limit
- [-] Allow customizing output format options
- [-] Add option to save download preferences

## Search Component
- [-] Add search suggestions/autocomplete
- [-] Implement search history
- [-] Add advanced search filters (by type, status, year)
- [-] Implement debouncing for search input
- [-] Cache recent search results
- [-] Add pagination for search results
- [-] Add proper error states for failed searches
- [-] Implement retry mechanism for failed API calls
- [-] Show meaningful error messages to users

## Global Improvements
- [-] Add proper loading states and transitions
- [-] Optimize re-renders with memo and useCallback
- [-] Extract common styles to shared components
- [-] Create theme provider for consistent styling
- [-] Add error boundary components

## Project Level Tasks
- [-] Work on design and functionality improvements
- [✓] Deploy site to hosting
- [✓] Create Tauri client