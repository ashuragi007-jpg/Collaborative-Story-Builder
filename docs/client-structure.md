# OVERVIEW

The goal is to separate the following:
- UI components
- Application logics
- Client state
- API communication

## Folder Structure
The structure is to that the main controller is inside the public folder and inside public is multiple sub folder in order to separate each uses of the code.

public/
- storyBuilderApp.mjs
- loginApp.mjs
- actions/
- components/
- i18n-l10n/
- pages/
- state/
- utils/

## Roles

### storyBuilderApp.mjs
It is responsible for rendering the main UI, wiring components together andstarting the application.

### loginApp.mjs
- The reason for making another entry point is so that i can separate user-related features from the main app features. User creation and account management are handled in loginApp.mjs while storyBuilderApp.mjs is for collaborative story functionality.

### actions/
this folder contains the apiClient and usersActions. Its responsibilities are to communicate with server API, updating state

### components/
this folder contains the custom web components like user-create and user-delete. It is responsible for handling user interaction, and rendeirng UI.

### i18n-l10n/
this folder contains the translation files used by the frontend.

Examples:
* en.json
* no.json

### state/
this folder contains userState. its responsibilities are storing client-side user data.

### pages/
this folder contains all html files.

### utils/
contains the utility functions used by frontend.

currently have:
- transalate.mjs: this module gives translation functions for the frontend.
