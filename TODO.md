# FB2Creator TODO List
*Last updated: May 7, 2025*

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
- [#] Add keyboard navigation between chapters
- [#] Improve ARIA labels and roles
- [#] Add screen reader announcements for state changes

## Download Settings
- [!] Add toggle button to group chapters by volume/number
- [#] Add pause/resume functionality
- [#] Handle network failures gracefully with retries
- [#] Implement progress bar for each volume

## Search Component
- [#] Add advanced search filters (by type, status, year)
- [#] Add pagination for search results
- [#] Show meaningful error messages to users

## Global Improvements
- [#] Add proper loading states and transitions
- [#] Optimize re-renders with memo and useCallback
- [#] Extract common styles to shared components
- [#] Create theme provider for consistent styling
- [#] Add error boundary components

## Project Level Tasks
- [#] Work on design and functionality improvements
- [✓] Deploy site to hosting
- [✓] Create Tauri client