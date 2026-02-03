# API ROUTES

This file contains API routes for the COllaborative Story Builder.


## User API

### POST /user
- Creats a user profile
- requires username (IGN) and user must accept Terms of Service.
- Generate unique  ID 

### GET /user
- Returns all stored user
### GET /user/:id
- returns a user that match the provided id
- will return a 404 if user does not exist

## Story API

### POST /stories
- creates a new story entry
- story require a title
- Description is optional so user can leave it blank
- Generate a unique story ID

### GET /stories
- returns all stored stories.

### GET /stories/:id 
- returns a story that matched the id
- returns 404 if the story doesnt exist


## Endpoints
- `POST /chapters` - create new chapter 
    - Requires storyId and chapter content
    - Checks if the submitted chapters exists and between 50 to 3000 words.
    - sanitize chapters by removing scripts and tags

- `GET /chapters` - get a list of chapters
    - this currently returns an empty list, chapters: []
    - Currently a scaffold to test if GET works.

### GET /chapters/:id
    - returns specific chapter that match the chapter id

### GET /chapters/byStory/:storyId
    - returns all chapters that match the story id.