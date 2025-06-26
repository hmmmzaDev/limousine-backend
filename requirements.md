# Backend Requirements: Limousine Platform (Core Business Logic)

## 1. Project Goal

This document outlines the backend requirements for the foundational business logic of a limousine booking platform. The immediate goal is to create a functional skeleton that handles the entire lifecycle of a booking—from request to completion—by coordinating actions between the customer, the admin, and the driver.

## 2. Core Focus for Initial Implementation

For this initial phase, we will focus exclusively on the core transactional flow. The system will operate correctly but without the complexities of real-time updates, payment processing, or robust security.

**Functionality to be built now:**
*   Allowing customers to sign up on their own.
*   Allowing the admin to add, edit, and delete driver profiles.
*   Allowing the admin to manage customer profiles.
*   Allowing customers to submit ride requests.
*   Allowing the admin to view, price, and assign requests.
*   Allowing customers to accept or cancel the admin's proposed price.
*   Allowing drivers to see their assigned rides and update their status.

**Functionality to be deferred (covered in Section 6):**
*   Customer/Driver Authentication and secure access control.
*   Real-Time Features (chat and live location tracking).
*   Payment Gateway Integration.

## 3. Core System Functionalities

### 3.1. Customer Onboarding

*   **Functionality: Customer Signup**
    *   **Description:** Allows a new customer to register for an account.
    *   **Required Data:** Customer's name and email.
    *   **Result:** The newly created customer's profile data.

### 3.2. Booking Flow

*   **Functionality: Submit a New Ride Request**
    *   **Description:** Allows a customer to submit a ride request. The initial status of this request is set to `'Pending'`.
    *   **Required Data:** The customer's ID, pickup location, dropoff location, and the desired date/time for the ride.
    *   **Result:** The new booking data with its `'Pending'` status.

*   **Functionality: Accept Ride Quote**
    *   **Description:** Allows the customer to formally accept the price quoted by the admin. This transitions the booking's status from `'Awaiting-Acceptance'` to `'Assigned'`.
    *   **Required Data:** The booking's ID.
    *   **Result:** The updated booking data with the `'Assigned'` status.

*   **Functionality: Cancel a Booking**
    *   **Description:** Allows a customer to cancel a booking. This can occur when they reject the admin's price or at any point before the ride begins. The status is updated to `'Cancelled'`.
    *   **Required Data:** The booking's ID.
    *   **Result:** The updated booking data with the `'Cancelled'` status.

### 3.3. Ride Execution Flow

*   **Functionality: Fetch Driver's Assigned Rides**
    *   **Description:** Retrieves all rides currently assigned to a specific driver.
    *   **Required Data:** The driver's ID.
    *   **Result:** An array of booking objects assigned to that driver.

*   **Functionality: Update Ride Status**
    *   **Description:** Allows a driver to update the status of an ongoing ride. The system must enforce the correct sequence of statuses (e.g., a ride must be `'Assigned'` before it can become `'En-Route'`).
    *   **Required Data:** The booking's ID and the new status (e.g., `'En-Route'`, `'Completed'`).
    *   **Result:** The updated booking data.

### 3.4. Admin Management

*   **Functionality: Fetch Bookings**
    *   **Description:** Allows the admin to retrieve a list of bookings. The system must support filtering this list by status (e.g., show only `'Pending'` bookings).
    *   **Required Data:** An optional status filter.
    *   **Result:** An array of booking objects that match the filter.

*   **Functionality: Assign a Driver and Set Price**
    *   **Description:** Allows the admin to assign a driver to a pending ride request and set the final price. This action transitions the booking's status from `'Pending'` to `'Awaiting-Acceptance'`.
    *   **Required Data:** The booking's ID, the assigned driver's ID, and the final price.
    *   **Result:** The updated booking data reflecting the new price, assigned driver, and new status.

*   **Functionality: Manage Customer Profiles**
    *   **Description:** Allows an admin to view, edit, or delete customer profiles.
    *   **Required Data:** For edits/deletes, the customer's ID. For edits, the new data.
    *   **Result:** Confirmation of the action.

*   **Functionality: Manage Driver Profiles**
    *   **Description:** Allows an admin to add, view, edit, or delete driver profiles.
    *   **Required Data:** For adds/edits, the driver's details. For deletes, the driver's ID.
    *   **Result:** The created/updated driver object or a confirmation of deletion.

## 4. Database Schema Design (MongoDB/Mongoose Example)

```javascript
// Customer Schema
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true }
});

// Driver Schema
const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleDetails: {
    model: String,
    licensePlate: String
  },
  status: {
    type: String,
    enum: ['available', 'on_trip', 'offline'],
    default: 'available'
  }
});

// Booking Schema
const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },

  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  rideTime: { type: Date, required: true },

  finalPrice: { type: Number, default: null },

  status: {
    type: String,
    enum: [
      'Pending',             // Customer has submitted, waiting for admin
      'Awaiting-Acceptance', // Admin has set a price, waiting for customer
      'Assigned',            // Customer has accepted, waiting for driver
      'En-Route',            // Driver is on the way
      'Completed',           // Ride finished
      'Cancelled'            // Ride cancelled by customer
    ],
    default: 'Pending'
  }
}, { timestamps: true });
```

## 5. Key Technical Considerations for Core Logic

*   **State Machine:** The `status` field on the `Booking` model is the most critical piece of this system. All business logic must enforce valid state transitions.
*   **Data Validation:** All incoming data must be rigorously validated to ensure all required fields are present and correctly formatted before processing.
*   **Idempotency:** Operations like accepting a quote should be idempotent where possible, meaning repeated calls do not produce different results or errors.

---

## 6. Future Implementation Scope

The following features are essential for a production-ready application and will be built upon the core logic established above.

*   **Phase 2: Authentication & Authorization**
    *   **Functionality:** Implement a secure login mechanism for customers and drivers. Add logic to protect system functionalities, ensuring they can only be accessed by authenticated and authorized parties (e.g., admin-only functions).

*   **Phase 3: Real-Time Communication**
    *   **Functionality:**
        *   **Notifications:** Push real-time notifications to the relevant parties when key events occur (e.g., new booking, ride assignment).
        *   **Chat:** Implement a messaging system for communication between the customer, driver, and admin within the context of a specific booking.
        *   **Live Location Tracking:** Enable the driver's application to broadcast location data, which can then be used to display a live map for the customer and admin.

*   **Phase 4: Payment Processing**
    *   **Functionality:**
        *   Integrate a payment gateway like Stripe.
        *   Automate the creation of payment requests when a ride is marked as `'Completed'`.
        *   Create a webhook handler to listen for events from the payment gateway to confirm successful payments.
        *   Build an admin-level function to process refunds.
