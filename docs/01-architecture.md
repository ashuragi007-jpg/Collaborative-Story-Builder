# Overview

## Application Flow
The application have two main types of usage: reading stories and writing stories.

### Reader Flow
Users can browse stories without needing an account.
- Library shows the list of stories.
- Story view displays story information and list of chapters

### Writer Flow
Users must create an account and log in before they can make stories
- Logged in users can create stories
- stories are written and manage inside the editor.
- writers can add chapters and edit their chapters.

Stories and chapters are tied to the author through "author_id"

This document describes the overall structure of the Collaborative Story Builder application

## Frontend structure
- pages/
    * HTML pages such as login.html, privacy.html and tos.html
- components/
    * reusable components such as:
        * user-login.mjs
        * user-create.mjs
        * account-manage.mjs
- controllers/
    * contains controllers for the collaborative app, such as:
        * chapterApp.mjs
        * readerApp.mjs
        * loginApp.mjs
        * storyBuilderApp.mjs
        * createStoryApp.mjs
        * editorApp.mjs
- actions/
    * API communications logic such as:
        * apiClient.mjs
        * usersActions.mjs
- state/
    * client state management such as:
        * userState.mjs
- utils/
    * shared frontend helper such as:
        * translate.mjs
- styels/
    * contains all CSS files used for different pages. Such as:
        * editor.css
        * indexStyle.css
        * Loginstyle.css
Two main frontend entry points are:
- loginApp.mjs: handles user login, creating account and account management
- storyBuilderApp.mjs: 

## Backend structure
- server.mjs: application entry point adn registers middleware. also starts the server

- routes/
    * API route handlers
- services/
    * business logic and db access
- modules/
    * middlewares and shares backend utilities
- db/
    * database schema


### Routes
Routes are separated so they have their own responsibilities.
- userAPI.mjs: this handle
    * create user
    * list users
    * get user by id
    * update username
    * delete user
- authAPI.mjs this handle authentication and the features are login existing user and change user password
- storyAPI.mjs this handle:
    * create story
    * list stories
    * get story by id
- chaptersApi.mjs: this handle:
    * create chapter
    * list chapter
    * get chapter by id
    * list chapters by story id

### Services
Services contains the database logic for the application
* userService.mjs
* storyService.mjs
* chapterService.mjs

Its responsibilities are to query PostgreSQL using pool.query(...) and to keep route files more focus to routes instead of mixing with persistence logic

### Security and Authentication
Authentication is based on username and password.

Passwords are never stored in plain text.

- The backend uses: modules/security.mjs
    - Responsibilities
        * hash passwords using hmac sha-256 and a secret key
    - The hashed value is used for
        * account creation
        * login verification
        * updates password

### Internationalization (i18n-l10n)
The system supports multiple language

#### Backend translation
- Backend translation is handled by, modules/translator.mjs. The module reads translation data and used for backend validation and error messages
#### Frontend translation
- Frontend tanslation is handled by, public/utils/translate.mjs

- translation files are stored in:
    - public/i18n-l10n
        - en.json
        - no.json