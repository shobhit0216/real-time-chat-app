# Chat Application Screenshots

This document describes the key pages and features of the Real-Time Chat Application.

## 📸 Application Pages

### 1. Login Page (`/login`)
**Description:** Clean and modern login interface with gradient background
- Email and password input fields
- "Login" button with loading state
- Link to registration page
- Error message display
- Responsive design for all screen sizes

**Features Visible:**
- Purple gradient background (primary color theme)
- White card with shadow
- Form validation
- Professional typography

---

### 2. Registration Page (`/register`)
**Description:** User-friendly registration form
- Username field (minimum 3 characters)
- Email field with validation
- Password field (minimum 6 characters)
- Confirm password field
- Visual feedback for validation errors
- Link back to login page

**Features Visible:**
- Same purple gradient theme
- Real-time form validation
- Password strength requirements
- Responsive layout

---

### 3. Main Chat Interface (`/`)
**Description:** Full-featured chat dashboard with three main sections

#### Left Sidebar (320px width):
- **Header:**
  - "Chat Rooms" or "Direct Messages" title
  - "+" button to create new room/chat
  
- **Tabs:**
  - "Rooms" tab for public/private rooms
  - "Direct" tab for one-on-one conversations
  
- **Search Bar:**
  - Real-time search functionality
  - Search icon indicator
  
- **Chat List:**
  - User avatars with online status indicators (green = online, gray = offline)
  - Chat names
  - Last message preview
  - Timestamp (e.g., "5 minutes ago")
  - Active chat highlighted with purple border

**Chat List Example:**
```
[Avatar] General Discussion        2h ago
         Hey everyone! Welcome...

[Avatar] Project Updates          5m ago
         🎉 New feature deployed!

[Avatar] John Doe (●online)       just now
         Thanks for the help!
```

#### Center Chat Area:
- **Chat Header:**
  - Chat/user avatar
  - Chat name or username
  - Number of members (for rooms) or status (for DMs)
  - Action buttons (settings, info)

- **Messages Section:**
  - Messages displayed in chronological order
  - Different styling for sent (purple) vs received (gray) messages
  - User avatars next to messages
  - Timestamps
  - Image previews for shared images
  - File download buttons for documents
  - Smooth scroll behavior
  - Auto-scroll to latest message

**Message Examples:**
```
[Avatar] Alice                    2:30 PM
         Hey! How's the project going?

                          It's going great! 2:31 PM
                          [Image preview]

[Avatar] Bob                      2:32 PM
         📎 project-report.pdf [Download]
```

- **Typing Indicator:**
  - "Alice is typing..." appears when someone is typing

- **Message Input Area:**
  - Multi-line text input
  - Paperclip button for file attachment
  - Send button (purple, with icon)
  - File preview when selected
  - Auto-resize textarea

#### Top Navbar:
- **Left:** 
  - "ChatApp" logo with message icon
  
- **Right:**
  - Current user avatar
  - Username display
  - Logout button

---

### 4. Create Room Modal
**Description:** Popup modal for creating new chat rooms
- Room name input (required)
- Description textarea (optional)
- "Private Room" checkbox
- "Cancel" and "Create Room" buttons
- Error message display
- Click outside to close

**Example:**
```
┌─────────────────────────────┐
│ Create New Room          ✕  │
├─────────────────────────────┤
│ Room Name                   │
│ [Enter room name]           │
│                             │
│ Description                 │
│ [What's this room about?]   │
│                             │
│ ☐ Private Room (invite only)│
│                             │
│      [Cancel] [Create Room] │
└─────────────────────────────┘
```

---

### 5. New Chat Modal
**Description:** Modal for starting direct conversations
- Search bar at the top
- List of available users
- User avatars with online status
- Username and email display
- Click user to start chat

**User List Example:**
```
┌─────────────────────────────┐
│ Start New Conversation   ✕  │
├─────────────────────────────┤
│ 🔍 [Search users...]        │
├─────────────────────────────┤
│ [●] John Doe                │
│     john@example.com        │
│                             │
│ [○] Jane Smith              │
│     jane@example.com        │
│                             │
│ [●] Bob Wilson              │
│     bob@example.com         │
└─────────────────────────────┘
```

---

## 🎨 Design Features

### Color Scheme:
- **Primary:** Purple (#7c3aed)
- **Secondary:** Light gray (#f3f4f6)
- **Background:** White (#ffffff)
- **Surface:** Off-white (#f9fafb)
- **Text Primary:** Dark gray (#111827)
- **Text Secondary:** Medium gray (#6b7280)
- **Success/Online:** Green (#22c55e)
- **Danger:** Red (#ef4444)

### Typography:
- Clean, modern sans-serif font
- Consistent font sizes
- Proper hierarchy

### Components:
- Rounded corners (8-12px border-radius)
- Subtle shadows
- Smooth transitions
- Hover effects on interactive elements

### Responsive Breakpoints:
- **Desktop:** Full 3-column layout
- **Tablet (≤768px):** Sidebar toggles, full-width chat
- **Mobile (≤480px):** Optimized single-column view

---

## 📱 Responsive Behavior

### Desktop View (>768px):
```
┌─────────────────────────────────────────────┐
│ [ChatApp Logo]              [User] [Logout] │
├──────────┬──────────────────────────────────┤
│          │ [Chat Header]                    │
│ Sidebar  │ ─────────────────────────────    │
│          │                                  │
│ [Search] │      Messages                    │
│          │      Area                        │
│ Rooms    │                                  │
│ - Room 1 │                                  │
│ - Room 2 │ ─────────────────────────────    │
│          │ [Type message...] [📎] [Send]   │
└──────────┴──────────────────────────────────┘
```

### Mobile View (≤768px):
```
┌─────────────────────────┐
│ [☰] ChatApp    [Logout] │
├─────────────────────────┤
│ [Chat Header]           │
├─────────────────────────┤
│                         │
│    Messages             │
│    Area                 │
│                         │
├─────────────────────────┤
│ [Type...] [📎] [Send]  │
└─────────────────────────┘
```

---

## ✨ Interactive Features Visible

1. **Real-time Updates:**
   - Messages appear instantly
   - Online status updates in real-time
   - Typing indicators

2. **File Sharing:**
   - Image previews inline
   - File download buttons with icons
   - Upload progress indication

3. **User Feedback:**
   - Loading spinners
   - Success/error messages
   - Form validation messages
   - Hover effects

4. **Navigation:**
   - Smooth page transitions
   - Active state highlighting
   - Breadcrumb-style navigation

---

## 📊 Key Metrics Displayed

- Number of room members
- Message timestamps
- User online/offline status
- Last activity time
- Unread message indicators (optional feature)

---

## 🎯 User Experience Highlights

1. **Intuitive Layout:** Clear separation of rooms, chats, and messages
2. **Visual Hierarchy:** Important actions prominently displayed
3. **Consistent Design:** Uniform styling across all pages
4. **Accessibility:** Proper contrast ratios, readable fonts
5. **Performance:** Smooth animations, fast loading

---

## 📝 Notes for Screenshots

When taking screenshots, capture:

1. **Login page:** Show the full form with gradient background
2. **Registration page:** Display validation in action
3. **Empty chat:** Show the "Select a chat" empty state
4. **Active chat:** Capture a conversation with multiple messages
5. **Room list:** Show mix of public/private rooms
6. **Direct messages:** Display users with online/offline status
7. **File upload:** Show an image and file in messages
8. **Create room modal:** Capture the popup overlay
9. **New chat modal:** Display the user search interface
10. **Mobile view:** Show responsive layout on narrow screen

---

**Recommended Screenshot Resolution:** 1920x1080 (Desktop), 375x667 (Mobile)
