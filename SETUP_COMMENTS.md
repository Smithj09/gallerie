# Setup Instructions for Comments Feature

## Database Setup

To enable the comments feature, you need to create the `comments` table in your Supabase database.

### Steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_comments_migration.sql`
4. Click "Run" to execute the SQL

### What the migration does:

- Creates a `comments` table with the following columns:
  - `id` (UUID, primary key)
  - `project_id` (UUID, foreign key to projects table)
  - `author_name` (TEXT)
  - `comment_text` (TEXT)
  - `created_at` (TIMESTAMP)

- Creates indexes for better query performance
- Enables Row Level Security (RLS)
- Sets up policies to allow:
  - Anyone to read comments
  - Anyone to insert comments
  - Anyone to delete comments (with passkey verification in the app)

## Features Implemented

### 1. Interactive Star Rating
- Click on stars in the gallery item cards to rate projects
- Click on stars in the project detail modal to update ratings
- Ratings are saved to the database and update in real-time
- Visual feedback with hover effects

### 2. Comments Section
- View all comments for a project in the detail modal
- Add new comments with your name and message
- Delete comments (requires passkey: `INNO-SOLAR-2025`)
- Comments are displayed with author name and timestamp
- Real-time updates when adding/deleting comments

## Usage

### Rating a Project
1. Click on any star (1-5) on a project card or in the detail modal
2. The rating updates immediately in the database
3. The average rating is displayed on the card and in the modal

### Adding a Comment
1. Click on a project to open the detail modal
2. Scroll to the comments section on the right side
3. Enter your name and comment
4. Click "Publier" to post the comment

### Deleting a Comment
1. Click the X button next to any comment
2. Enter the passkey when prompted: `INNO-SOLAR-2025`
3. The comment will be deleted

## Notes

- The passkey for deleting comments is the same as for deleting projects
- Comments are automatically loaded when opening a project detail modal
- The modal now has a split layout: image on the left, details and comments on the right