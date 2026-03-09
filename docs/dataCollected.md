# Data Collected
This document describes what data is collected and stored by the Collaborative Story Builder app.

The app is designed to minimize the collection of personal information and only stores the data required for the app to function.

## Account Data
The following information are stored when user made an account.

- id: a random unique identifier used to identify a user
- username: a pseudonym/nickname/in-game name(IGN) chosen by the user
- password_hash: a hashed version of user's password. The purpose is authentication as passwords are never stored in plain text.
- tos_accepted: a boolean value that indicates whether the user accepted the Terms of Service. The purpose is to confim if user agreed with the platform rules.
- created_at: it is a timestap when the user account was created. The purpose is to record the account creation time
