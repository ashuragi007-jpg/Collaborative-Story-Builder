# API ROUTES

This file contains API routes for the COllaborative Story Builder.


## Endpoints
- `POST /chapters` - create new chapter 
    - Checks if the submitted chapters exists and between 50 to 3000 words.
    - sanitize chapters by removing scripts and tags

- `GET /chapters` - get a list of chapters
    - this currently returns an empty list, chapters: []
    - Currently a scaffold to test if GET works. It will be replace as the project continue