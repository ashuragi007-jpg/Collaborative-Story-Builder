# Overview

This document describes the overall structure of the Collaborative Story Builder application

## Frontend structure
- pages/
    * HTML pages such as login.html, privacy.html and tos.html
- components/
    * reusable components such as:
        * user-login.mjs
        * user-create.mjs
        * account-manage.mjs
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