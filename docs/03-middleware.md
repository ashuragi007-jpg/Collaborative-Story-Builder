# Middleware Plan

This file contain middleware functions for the Collabortaive Story Builder.

## Current Middleware
- validateChapterLength: this checks if content exists and is withing 50 to 3000 words. Purpose of this middleware is to see if the user write less than 50 or more. If the user wrote less than 50 words they will get an error about it.

- sanitizeContent: remove scripts and tags but still accepts the chapter after removing them. 