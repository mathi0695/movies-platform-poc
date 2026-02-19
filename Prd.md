# 🎬 Movie Ticket Booking Platform – PRD

## 1. Product Overview

### 1.1 Purpose

Build a movie ticket booking platform where:

* Movies are listed
* Theatres manage screens and shows
* Users can browse shows and book seats
* Tickets are generated with unique verification codes
* Theatre owners can manage and validate bookings

---

## 2. Goals

### Primary Goals

* Enable users to book movie tickets online
* Provide theatre owners tools to manage shows and bookings
* Generate secure digital tickets

### Non Goals (Phase 1)

* Loyalty points
* Food ordering
* Seat resale
* Subscription packages
* Payment gateway integration (Skipped as per requirement)

---

## 3. User Roles

### 3.1 Customer (End User)

* Browse movies and shows
* Select seats
* Book tickets
* View ticket history

### 3.2 Theatre Owner

* Manage theatres and screens
* Publish and manage shows
* View ticket sales
* Validate tickets

### 3.3 Admin (Platform Owner)

* Approve theatres
* Add movies
* Manage global settings

---

## 4. Functional Requirements

---

# 4.1 Movie Management

## Description

Platform should allow adding and managing movies.

### Fields

* Movie Name
* Certification (U, UA, A etc)
* Duration
* Release Date
* Crew Members
* Language
* Genre
* Synopsis
* Poster Image
* Status (Upcoming / Running / Expired)

---

### CRUD Operations

| Operation    | Access |
| ------------ | ------ |
| Create Movie | Admin  |
| Update Movie | Admin  |
| Delete Movie | Admin  |
| View Movie   | All    |

---

# 4.2 Theatre Management

## Description

Theatre owners can register theatres.

### Theatre Fields

* Theatre Name
* Location (Address + Geo Coordinates)
* Total Screens
* Contact Details
* Status (Pending Approval / Approved / Rejected)

---

### Screen Fields

Each theatre contains multiple screens.

* Screen Name
* Screen Type (IMAX / 3D / 2D / Dolby etc)
* Sound Type
* Video Format
* Seating Layout Template

---

### Seating Layout Structure

* Rows (A,B,C...)
* Seat Numbers
* Seat Types (Gold / Silver / Platinum / Recliner)
* Seat Price Mapping
* Seat Status (Active / Disabled)

---

# 4.3 Show Management

## Description

Theatre owner publishes shows.

### Show Fields

* Movie
* Theatre
* Screen
* Show Date
* Start Time
* End Time
* Show Type (Morning / Matinee / Evening / Night)
* Seat Pricing Override (Optional)
* Booking Open Time
* Booking Close Time
* Show Status

---

### Rules

* Overlapping shows NOT allowed
* Screen must belong to theatre
* Seating layout is copied from screen template

---

# 4.4 Booking Flow

## Step 1: Browse Shows

User filters by:

* City
* Movie
* Date
* Theatre
* Language
* Show Type

---

## Step 2: Seat Selection

### Behaviour

* Display seating layout
* Highlight:

  * Available
  * Booked
  * Selected
  * Blocked

### Rules

* Seat lock duration: 5 minutes
* Multiple users cannot book same seat

---

## Step 3: Price Calculation

Total Price =

Sum of Seat Price + Convenience Fee + Taxes

---

## Step 4: Payment Confirmation

(Skipped actual gateway integration)

System marks booking as:

* Pending
* Confirmed
* Failed
* Expired

---

## Step 5: Ticket Generation

Generate:

* Unique Ticket Code (UUID / QR based)
* Booking Confirmation
* Seat Details
* Show Details

---

# 4.5 User Authentication

### Registration Fields

* Mobile Number (Mandatory)
* Email
* Password
* Name

### Login Methods

* Mobile + Password
* Email + Password

### Password Storage

* Must be hashed

---

# 4.6 Theatre Owner Dashboard

### Capabilities

* Create Theatre
* Create Screens
* Publish Shows
* Update Shows
* Delete Shows
* View Sales Reports
* Validate Ticket

---

### Ticket Validation

* Enter ticket code
* Display ticket status
* Mark as used

---

# 4.7 Ticket Generation Logic

Trigger:

* Payment status becomes Confirmed

Process:

* Generate Ticket ID
* Generate QR Code
* Save ticket details
* Assign seats
* Update seat booking status

---

## 5. Non Functional Requirements

### Performance

* Seat selection response < 2 seconds
* Concurrent seat booking handling

### Security

* Password hashing
* Token based authentication
* Ticket QR encryption

### Scalability

* Must support multi city
* Horizontal scaling supported

---

## 6. System Workflows

### Booking Workflow

User → Select Show → Select Seats → Lock Seats → Confirm Payment → Generate Ticket

---

### Theatre Owner Workflow

Owner → Add Theatre → Add Screen → Publish Show → Monitor Booking → Validate Ticket

---

## 7. Database Schema

---

# 7.1 Users Table

```sql
users
-----
id (PK)
name
email
mobile
password_hash
role (customer, owner, admin)
created_at
updated_at
```

---

# 7.2 Movies Table

```sql
movies
------
id (PK)
name
certification
duration_minutes
release_date
language
genre
synopsis
poster_url
status
created_at
```

---

# 7.3 Crew Members Table

```sql
movie_crew
-----------
id
movie_id (FK)
name
role
```

---

# 7.4 Theatres Table

```sql
theatres
---------
id
owner_id (FK users)
name
address
city
latitude
longitude
status
created_at
```

---

# 7.5 Screens Table

```sql
screens
--------
id
theatre_id (FK)
name
screen_type
sound_type
video_format
created_at
```

---

# 7.6 Seating Templates

```sql
seat_templates
--------------
id
screen_id (FK)
row_label
seat_number
seat_type
base_price
status
```

---

# 7.7 Shows Table

```sql
shows
------
id
movie_id (FK)
theatre_id (FK)
screen_id (FK)
show_date
start_time
end_time
show_type
booking_open_time
booking_close_time
status
```

---

# 7.8 Show Seat Map (Runtime Copy)

```sql
show_seats
-----------
id
show_id (FK)
seat_template_id (FK)
row_label
seat_number
seat_type
price
status (available, locked, booked)
locked_by_user_id
lock_expiry_time
```

---

# 7.9 Bookings Table

```sql
bookings
---------
id
user_id (FK)
show_id (FK)
total_amount
booking_status (pending, confirmed, failed, expired)
created_at
```

---

# 7.10 Booking Seats Mapping

```sql
booking_seats
--------------
id
booking_id (FK)
show_seat_id (FK)
price
```

---

# 7.11 Tickets Table

```sql
tickets
--------
id
booking_id (FK)
ticket_code (Unique)
qr_code_url
status (active, used, cancelled)
created_at
```

---

# 7.12 Ticket Scan Logs

```sql
ticket_scans
-------------
id
ticket_id (FK)
scanned_by
scanned_time
status
```

---

## 8. Assumptions

* Each show belongs to one screen
* Each booking can contain multiple seats
* Tickets are generated per booking
* Seat locking handled using expiry timestamp

---

## 9. Edge Cases

* User closes browser after seat lock
* Payment fails after seat lock
* Multiple device booking attempt
* Show cancellation handling

---

## 10. Future Enhancements

* Payment gateway integration
* Notification system (SMS / Email)
* Food ordering
* Dynamic pricing
* Loyalty rewards
* Seat recommendation AI

---

## 11. Tech Suggestions (Optional)

* Backend: Node.js / Python
* DB: PostgreSQL
* Cache / Locking: Redis
* Queue: RabbitMQ / Kafka
* QR Generation: Standard QR library

---

END OF DOCUMENT
