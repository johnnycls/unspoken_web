# Unspoken Web API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [API Endpoints](#api-endpoints)
   - [User Routes](#user-routes)
   - [Crush Routes](#crush-routes)
   - [Group Routes](#group-routes)
   - [Letter Routes](#letter-routes)

---

## Overview

The Unspoken Web API is a RESTful API built with Express.js and TypeScript. It provides endpoints for user authentication, crush management, group collaboration, and letter sending functionality.

**Base URL:** `http://localhost:3000` (or your configured domain)

**API Version:** 1.0.0

---

## Authentication

Most endpoints require JWT (JSON Web Token) authentication. The token must be included in the `Authorization` header of the request.

### Authentication Header Format

```
Authorization: <your-jwt-token>
```

### Obtaining a Token

Use the `/user/login` endpoint to obtain a JWT token via Google OAuth.

### Token Expiration

Tokens expire after **30 days**.

---

## Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

### Recommended Practices

- Implement rate limiting on the client side for sensitive operations
- Cache responses when appropriate
- Batch requests when possible

### Current Limits

- **Letters:** 1 per day per user
- **Groups:** Maximum 10 groups per user
- **Group Members:** Maximum 250 total members/invites per group

---

## API Endpoints

---

## User Routes

Base path: `/user`

### 1. Login / Register

**Endpoint:** `POST /user/login`

**Description:** Authenticate a user via Google OAuth and receive a JWT token. Creates a new user if one doesn't exist.

**Authentication:** Not required

**Request Body:**

```json
{
  "credentials": {
    "credential": "google-id-token-here"
  }
}
```

**Success Response (200):**

```json
{
  "token": "jwt-token-here"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid or missing credential
- `500 Internal Server Error` - Server configuration error

**Example:**

```javascript
fetch("/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    credentials: {
      credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
    },
  }),
});
```

---

### 2. Get User Profile

**Endpoint:** `GET /user`

**Description:** Retrieve the authenticated user's profile information.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Success Response (200):**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "lang": "en"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

**Example:**

```javascript
fetch("/user", {
  method: "GET",
  headers: {
    Authorization: "your-jwt-token",
  },
});
```

---

### 3. Update User Profile

**Endpoint:** `PATCH /user`

**Description:** Update the authenticated user's profile information.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "lang": "en"
}
```

**Fields:**

- `name` (optional, string, max 20 chars) - User's display name
- `lang` (optional, string) - User's preferred language code

**Success Response (200):**

```json
{
  "message": "Profile updated"
}
```

**Error Responses:**

- `400 Bad Request` - Name too long
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

**Example:**

```javascript
fetch("/user", {
  method: "PATCH",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    lang: "es",
  }),
});
```

---

### 4. Get Names by Emails

**Endpoint:** `POST /user/get-names`

**Description:** Retrieve display names for a list of email addresses.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Fields:**

- `emails` (required, array of strings, max 250 items) - Array of email addresses

**Success Response (200):**

```json
{
  "user1@example.com": "John Doe",
  "user2@example.com": "user2@example.com"
}
```

**Notes:**

- Returns display name if set, otherwise returns the email address
- Duplicate emails are automatically removed
- All emails must be valid format

**Error Responses:**

- `400 Bad Request` - Invalid emails array or invalid email format
- `401 Unauthorized` - Invalid or missing token

**Example:**

```javascript
fetch("/user/get-names", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    emails: ["alice@example.com", "bob@example.com"],
  }),
});
```

---

## Crush Routes

Base path: `/crush`

### Overview

The crush feature allows users to anonymously indicate interest in other users. Crushes are organized by month with specific submission and viewing periods:

- **Days 1-14:** Users can create/update/delete crushes
- **Days 15-31:** Users can view mutual crushes (read-only period)

---

### 1. Create or Update Crush

**Endpoint:** `POST /crush`

**Description:** Create or update a crush for the current month. Only available from day 1-14.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "toEmail": "crush@example.com",
  "message": "I think you're amazing!"
}
```

**Fields:**

- `toEmail` (required, string, valid email) - Email of the person you have a crush on
- `message` (required, string, max 25000 chars, non-empty) - Personal message

**Validation Rules:**

- Cannot create a crush on yourself
- Only available during days 1-14 of the month
- Email must be valid format
- Message cannot be empty or just whitespace

**Success Response (200):**

```json
{
  "message": "Crush saved successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid email, self-crush, or message validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Outside submission period (after day 14)

**Example:**

```javascript
fetch("/crush", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    toEmail: "special@example.com",
    message: "You make every day brighter!",
  }),
});
```

---

### 2. Get Current Month's Crush

**Endpoint:** `GET /crush`

**Description:** Get your crush record for the current month. Response varies based on the day of the month.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Success Response (200) - Days 1-14:**

```json
{
  "toEmail": "crush@example.com",
  "message": "I think you're amazing!",
  "month": "2025-10",
  "responseMessage": ""
}
```

**Success Response (200) - Days 15-31 (with mutual crush):**

```json
{
  "toEmail": "crush@example.com",
  "message": "I think you're amazing!",
  "month": "2025-10",
  "responseMessage": "I feel the same way!"
}
```

**Success Response (200) - No crush exists:**

```json
null
```

**Behavior:**

- **Days 1-14:** Returns your crush data without checking for mutual interest
- **Days 15-31:** Returns your crush data with `responseMessage` if there's a mutual crush
- If no crush exists for current month, returns `null`

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token

**Example:**

```javascript
fetch("/crush", {
  method: "GET",
  headers: {
    Authorization: "your-jwt-token",
  },
});
```

---

### 3. Delete Crush

**Endpoint:** `DELETE /crush`

**Description:** Delete your crush record for the current month. Only available from day 1-14.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Success Response (200):**

```json
{
  "message": "Crush deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Outside deletion period (after day 14)
- `404 Not Found` - No crush record found for current month

**Example:**

```javascript
fetch("/crush", {
  method: "DELETE",
  headers: {
    Authorization: "your-jwt-token",
  },
});
```

---

## Group Routes

Base path: `/group`

### Overview

Groups allow users to collaborate and send letters to each other. Each group has a creator, members, and invited users.

---

### 1. Get All Groups

**Endpoint:** `GET /group`

**Description:** Retrieve all groups where the user is a member or has been invited.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Success Response (200):**

```json
[
  {
    "id": "64f5a8b9c1234567890abcde",
    "name": "Study Group",
    "description": "Weekly study sessions",
    "memberEmails": ["user1@example.com", "user2@example.com"],
    "invitedEmails": ["user3@example.com"],
    "creatorEmail": "user1@example.com"
  }
]
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token

**Example:**

```javascript
fetch("/group", {
  method: "GET",
  headers: {
    Authorization: "your-jwt-token",
  },
});
```

---

### 2. Create Group

**Endpoint:** `POST /group`

**Description:** Create a new group. The creator is automatically added as a member.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "name": "Book Club",
  "description": "Monthly book discussions",
  "invitedEmails": ["friend1@example.com", "friend2@example.com"]
}
```

**Fields:**

- `name` (required, string, max 20 chars) - Group name
- `description` (optional, string, max 300 chars) - Group description
- `invitedEmails` (optional, array, max 249 emails) - Emails to invite

**Validation Rules:**

- User can create maximum 10 groups
- All invited emails must be valid format
- Duplicates are automatically removed
- Creator's email is automatically excluded from invites
- Maximum 250 total members (including creator)

**Success Response (201):**

```json
{
  "id": "64f5a8b9c1234567890abcde",
  "message": "Group created successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid name, description, or emails
- `401 Unauthorized` - Invalid or missing token

**Example:**

```javascript
fetch("/group", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Photography Enthusiasts",
    description: "Share and discuss photography",
    invitedEmails: ["alice@example.com", "bob@example.com"],
  }),
});
```

---

### 3. Update Group

**Endpoint:** `PATCH /group`

**Description:** Update group details. Only the creator can update the group.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "groupId": "64f5a8b9c1234567890abcde",
  "name": "Updated Name",
  "description": "Updated description",
  "memberEmails": ["user1@example.com", "user2@example.com"],
  "invitedEmails": ["user3@example.com"]
}
```

**Fields:**

- `groupId` (required, string) - MongoDB ObjectId of the group
- `name` (optional, string, max 20 chars) - Updated group name
- `description` (optional, string, max 300 chars) - Updated description
- `memberEmails` (optional, array) - Updated member list
- `invitedEmails` (optional, array) - Updated invited list

**Validation Rules:**

- Only creator can update the group
- Creator is always kept in member list (auto-added if missing)
- All emails must be valid format
- Duplicates are automatically removed
- Emails in member list are excluded from invited list
- Total members + invited cannot exceed 250

**Success Response (200):**

```json
{
  "message": "Group updated successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid groupId, validation errors, or total limit exceeded
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Only creator can update
- `404 Not Found` - Group not found

**Example:**

```javascript
fetch("/group", {
  method: "PATCH",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    groupId: "64f5a8b9c1234567890abcde",
    name: "Renamed Group",
    description: "New description",
  }),
});
```

---

### 4. Handle Group Invitation

**Endpoint:** `POST /group/invitation`

**Description:** Accept or decline a group invitation.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "id": "64f5a8b9c1234567890abcde",
  "isAccept": true
}
```

**Fields:**

- `id` (required, string) - MongoDB ObjectId of the group
- `isAccept` (required, boolean) - `true` to accept, `false` to decline

**Behavior:**

- **Accept:** Moves user from `invitedEmails` to `memberEmails`
- **Decline:** Removes user from `invitedEmails`

**Success Response (200) - Accept:**

```json
{
  "message": "Invitation accepted"
}
```

**Success Response (200) - Decline:**

```json
{
  "message": "Invitation declined"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid groupId or missing isAccept
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User not invited to this group
- `404 Not Found` - Group not found

**Example:**

```javascript
fetch("/group/invitation", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: "64f5a8b9c1234567890abcde",
    isAccept: true,
  }),
});
```

---

### 5. Leave Group

**Endpoint:** `POST /group/leave`

**Description:** Leave a group. Creators cannot leave and must delete the group instead.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "groupId": "64f5a8b9c1234567890abcde"
}
```

**Fields:**

- `groupId` (required, string) - MongoDB ObjectId of the group

**Success Response (200):**

```json
{
  "message": "Successfully left the group"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid groupId
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Creator cannot leave, or user not a member
- `404 Not Found` - Group not found

**Example:**

```javascript
fetch("/group/leave", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    groupId: "64f5a8b9c1234567890abcde",
  }),
});
```

---

### 6. Delete Group

**Endpoint:** `DELETE /group`

**Description:** Delete a group. Only the creator can delete the group.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "groupId": "64f5a8b9c1234567890abcde"
}
```

**Fields:**

- `groupId` (required, string) - MongoDB ObjectId of the group

**Success Response (200):**

```json
{
  "message": "Group deleted successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid groupId
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Only creator can delete
- `404 Not Found` - Group not found

**Example:**

```javascript
fetch("/group", {
  method: "DELETE",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    groupId: "64f5a8b9c1234567890abcde",
  }),
});
```

---

## Letter Routes

Base path: `/letter`

### Overview

Letters allow group members to send anonymous or pseudonymous messages to other users. Each user can send one letter per day.

---

### 1. Get All Letters

**Endpoint:** `GET /letter`

**Description:** Retrieve all letters where the user is either the sender or recipient. Recipients can only see letters sent before today (delayed delivery).

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Success Response (200):**

```json
[
  {
    "fromGroupId": "64f5a8b9c1234567890abcde",
    "toEmail": "recipient@example.com",
    "alias": "Anonymous Friend",
    "content": "Hope you're having a great day!",
    "timestamp": "2025-10-26T12:34:56.789Z"
  }
]
```

**Response Fields:**

- `fromGroupId` - MongoDB ObjectId of the group the letter was sent from
- `toEmail` - Email of the recipient
- `alias` - Sender's chosen alias (or empty string)
- `content` - Letter content
- `timestamp` - When the letter was sent

**Behavior:**

- Returns all letters sent by the user
- Returns letters received before today (yesterday and earlier)
- Letters sent today won't be visible to recipient until tomorrow
- Sorted by timestamp (newest first)

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token

**Example:**

```javascript
fetch("/letter", {
  method: "GET",
  headers: {
    Authorization: "your-jwt-token",
  },
});
```

---

### 2. Send Letter

**Endpoint:** `POST /letter`

**Description:** Send a letter from a group you're a member of. Limited to 1 letter per day.

**Authentication:** Required

**Request Headers:**

```
Authorization: <jwt-token>
```

**Request Body:**

```json
{
  "fromGroupId": "64f5a8b9c1234567890abcde",
  "toEmail": "friend@example.com",
  "alias": "Your Secret Admirer",
  "content": "Just wanted to brighten your day with this message!"
}
```

**Fields:**

- `fromGroupId` (required, string) - MongoDB ObjectId of the group
- `toEmail` (required, string, valid email) - Recipient's email
- `alias` (optional, string) - Your alias for this letter
- `content` (required, string, max 25000 chars, non-empty) - Letter content

**Validation Rules:**

- Must be a member of the specified group
- Can only send 1 letter per day (per user, not per group)
- Email must be valid format
- Content cannot be empty or just whitespace
- All strings are sanitized to remove control characters

**Success Response (201):**

```json
{
  "message": "Letter sent successfully",
  "letterId": "64f5a8b9c1234567890abcde"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid fromGroupId, toEmail, or content validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Not a member of the group
- `404 Not Found` - Group not found
- `429 Too Many Requests` - Already sent a letter today

**Example:**

```javascript
fetch("/letter", {
  method: "POST",
  headers: {
    Authorization: "your-jwt-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fromGroupId: "64f5a8b9c1234567890abcde",
    toEmail: "recipient@example.com",
    alias: "A Friend",
    content: "Sending you positive vibes!",
  }),
});
```

---

## Security Best Practices

### For API Consumers

1. **Token Storage**

   - Store JWT tokens securely (e.g., httpOnly cookies or secure storage)
   - Never expose tokens in URLs or logs
   - Implement token refresh mechanisms

2. **Input Validation**

   - Always validate user input on the client side
   - Sanitize data before sending to the API
   - Use proper email validation

3. **Error Handling**

   - Don't expose sensitive information in error messages
   - Log errors securely on the server side
   - Provide user-friendly error messages

4. **Rate Limiting**
   - Implement client-side rate limiting
   - Cache responses when appropriate
   - Use exponential backoff for retries

### For API Administrators

1. **Environment Variables**

   - Never commit sensitive credentials
   - Use strong JWT secrets
   - Rotate credentials regularly

2. **Database Security**

   - Use MongoDB indexes for performance
   - Implement proper access controls
   - Regular backups

3. **Monitoring**
   - Monitor API usage and errors
   - Set up alerts for suspicious activity
   - Log all authentication attempts

---

## Data Validation Summary

### String Length Limits

- **Name:** 20 characters
- **Description:** 300 characters
- **Message (Crush):** 25,000 characters
- **Letter Content:** 25,000 characters

### Array Limits

- **Max Groups Per User:** 10
- **Max Group Members/Invites:** 250 total
- **Max Emails in get-names:** 250

### Rate Limits

- **Letters Per Day:** 1 per user

### Time-Based Rules

- **Crush Submission Period:** Days 1-14 of each month
- **Crush Viewing Period:** Days 15-31 of each month
- **Letter Delivery Delay:** Letters visible to recipient starting next day

---

## Changelog

### Version 1.0.0 (2025-10-27)

- Initial API documentation
- Added comprehensive security improvements:
  - Email validation across all endpoints
  - MongoDB ObjectId validation
  - Input sanitization for all string fields
  - Duplicate removal in email arrays
  - Self-crush prevention
  - Creator protection in group updates
- Improved error messages for better security (avoiding information leakage)
- Enhanced validation consistency across all routes

---

## Support

For issues, questions, or feature requests, please contact the development team or open an issue in the project repository.

**Project Repository:** https://github.com/johnnycls/unspoken_web
