# Limousine Platform Backend: Progress Tracker

This document tracks the development progress of the core business logic, building upon the existing project foundation.

**Status Legend:**
*   `[ ]` Pending
*   `[🔄]` In Progress
*   `[✅]` Completed
*   `[🚫]` Blocked
*   `[⏭️]` Skipped

---

### [✅] Module 1: Project Setup and Database Schema

**Objective:** Initialize the backend project and define the core data structures in the database.

*   `[✅]` **task 1.1:** Initialize a new Node.js/Express.js project with TypeScript.
*   `[✅]` **task 1.2:** Install and configure Mongoose to connect to a MongoDB database.
*   `[✅]` **task 1.3:** Create the `Customer` schema (`models/Customer.ts`) with `name` and `email` fields.
*   `[✅]` **task 1.4:** Create the `Driver` schema (`models/Driver.ts`) with `name`, `vehicleDetails`, and `status` fields.
*   `[✅]` **task 1.5:** Create the `Booking` schema (`models/Booking.ts`) with all required fields (`customerId`, `driverId`, `locations`, `rideTime`, `finalPrice`, `status`) and references.

---

### [✅] Module 2: Customer Management

**Objective:** Implement functionalities for customer registration and admin management.

*   `[✅]` **task 2.1:** Implement the `Customer Signup` functionality for customers to register themselves.
*   `[✅]` **task 2.2:** Implement the `Fetch All Customers` functionality for the admin.
*   `[✅]` **task 2.3:** Implement the `Edit Customer` functionality for the admin to update a customer's profile.
*   `[✅]` **task 2.4:** Implement the `Delete Customer` functionality for the admin to remove a customer profile.

---

### [✅] Module 3: Driver Management (Admin-Only)

**Objective:** Implement admin controls for adding and managing drivers.

*   `[✅]` **task 3.1:** Implement the `Add Driver` functionality for the admin.
*   `[✅]` **task 3.2:** Implement the `Fetch All Drivers` functionality for the admin.
*   `[✅]` **task 3.3:** Implement the `Edit Driver` functionality for the admin to update a driver's profile.
*   `[✅]` **task 3.4:** Implement the `Delete Driver` functionality for the admin to remove a driver.

---

### [✅] Module 4: Core Booking Flow (Customer & Admin)

**Objective:** Build the main booking submission and assignment logic.

*   `[✅]` **task 4.1:** Implement the `Submit Ride Request` functionality for a logged-in customer.
*   `[✅]` **task 4.2:** Implement the `Fetch Bookings` functionality for the admin, with filtering by `status` (especially 'Pending').
*   `[✅]` **task 4.3:** Implement the `Assign Driver and Set Price` functionality for the admin, changing the booking status to `Awaiting-Acceptance`.
*   `[✅]` **task 4.4:** Implement the `Accept Ride Quote` functionality for the customer, changing the booking status to `Assigned`.
*   `[✅]`, **task 4.5:** Implement the `Cancel Booking` functionality for the customer, changing the booking status to `Cancelled`.

---

### [✅] Module 5: Ride Execution Flow (Driver)

**Objective:** Enable drivers to manage and execute their assigned rides.

*   `[✅]` **task 5.1:** Implement the `Fetch Assigned Rides` functionality for a specific driver.
*   `[✅]` **task 5.2:** Implement the `Update Ride Status` functionality for a driver to set the status to `En-Route`.
*   `[✅]` **task 5.3:** Enhance the `Update Ride Status` functionality for a driver to set the status to `Completed`.

---

### [ ] Module 6: Authentication & Authorization

**Objective:** Secure the platform with role-based access control.

*   `[✅]` **task 6.1:** Add a `password` field (to be hashed) to the `Customer` and `Driver` schemas.
*   `[✅]` **task 6.2:** Implement separate `Customer Login` and `Driver Login` functionalities in their respective controllers that return JSON Web Tokens (JWT) on success.
*   `[ ]` **task 6.3:** Create a JWT validation middleware to authenticate and attach user data to incoming requests.
*   `[ ]` **task 6.4:** Create role-based authorization middleware (e.g., `isAdmin`, `isDriver`) to protect specific functionalities.
*   `[ ]` **task 6.5:** Apply authentication and authorization middleware to all relevant functionalities across the application.

---

### [ ] Module 7: Real-Time Chat (WebSockets)

**Objective:** Implement a real-time chat system for communication between all parties.

*   `[ ]` **task 7.1:** Create the `Message` schema (`models/Message.ts`) to store chat history linked to a booking.
*   `[ ]` **task 7.2:** Integrate Socket.IO with the Express server and implement JWT authentication for socket connections.
*   `[ ]` **task 7.3:** Implement logic for clients to automatically join/leave booking-specific chat rooms (e.g., `chat_ride_123`).
*   `[ ]` **task 7.4:** Implement the `Chat` functionality (listen for incoming messages, persist them, and broadcast to the correct room).

---

### [ ] Module 8: Push Notifications (FCM)

**Objective:** Integrate Firebase Cloud Messaging to send push notifications for key events.

*   `[ ]` **task 8.1:** Add an `fcmToken` field to the `Customer` and `Driver` schemas to store device tokens.
*   `[ ]` **task 8.2:** Implement a functionality for client apps to register or update their FCM token on the backend.
*   `[ ]` **task 8.3:** Install and configure the Firebase Admin SDK on the server.
*   `[ ]` **task 8.4:** Create a dedicated notification service for sending messages via FCM.
*   `[ ]` **task 8.5:** Integrate the notification service into the business logic (e.g., send notifications on 'Ride Assigned', 'Quote Ready', etc.).

---

### [ ] Module 9: Payment Processing (Stripe)

**Objective:** Integrate a payment gateway to handle ride payments and refunds.

*   `[ ]` **task 9.1:** Add a `paymentStatus` field to the `Booking` schema (e.g., `Unpaid`, `Paid`, `Refunded`).
*   `[ ]` **task 9.2:** Install the Stripe SDK and configure API keys securely.
*   `[ ]` **task 9.3:** Implement the functionality to create a Stripe `PaymentIntent` when a ride is marked as `Completed`.
*   `[ ]` **task 9.4:** Create a public webhook endpoint to securely listen for events from Stripe.
*   `[ ]` **task 9.5:** Implement webhook logic to handle the `payment_intent.succeeded` event and update the booking's `paymentStatus` to `Paid`.
*   `[ ]` **task 9.6:** Implement an admin-only `Issue Refund` functionality that uses the Stripe API to process refunds.

