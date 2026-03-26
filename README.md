# Collaborative Story Builder

# Project Description
Users create a short story beginnings, and other users can add chapters or create branching paths to continue the story. Each participants has a user account with an in-game name (IGN) or avatar so contributions are credited to the correct user. 

## Technical Requirements
- Client
- Server
- User Accounts
- Persisten cloud-based storage (PostgreSQL)
- REST'ish API
- PWA
- Offline functionality

## Core MVP Features
- #01 Start a new story
- #02 Continue an existing story
- #03 Create user accounts

## Planned features
- #04 Branch Stories : not implemented because of architectural complexity and prioritization of core features

## Architecture Overview
The application follows a client server architecture
- Frontend handles UI, user interaction and API communication
- Backend handles business logic, validation, and db operations
- PostgreSQL used for persistent storage

For more details, read:
- "01-architecture.md"
- "01.5-client-structure.md"

## API
The backend exposes a REST-style API for:
- users
- authentication
- stories
- chapters

For more details, read:
- "02-api.md"

## Data Handling
The application stores user data and story content
- user accounts include both username and password
- stories and chapters are linked to authors view author_id.
- user can delete their account

For more details, read:
- "04-data-handling.md"

## Progressive Web APP (PWA)
The application is installable and supports offline usage.
- uses a web app manifest
- uses a service worker for caching
- previously visited pages and resources are available offline

## Deployment
- Base URL: https://collaborative-story-builder-zrt9.onrender.com

# Link for Feature map and plan
- Feature Map: https://www.figma.com/board/nZKzigzMy93RhhyVOSFRiG/Welcome-to-FigJam?node-id=0-1&t=tnfk5r6hunYfpqI5-1 
- Project Plan: https://github.com/users/ashuragi007-jpg/projects/3
