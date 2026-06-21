# Security Specification: Ore & Co. Firestore Database

This document drafts the data invariants, test payloads, and test suite definitions for validation before enforcing security rules on the Firestore database collections: `bookings` and `quotes`.

## 1. Data Invariants

### Booking Invariants
- `userId` must equal the caller's auth UID.
- `serviceType` must be one of `Deep Sanctuary`, `Essential Polish`, `Post-Event Restore`, `Moving Transition`.
- `sqft` must be a non-empty string.
- `bookingDate` and `arrivalWindow` must be non-empty strings.
- `status` must be either `pending`, `confirmed`, `completed`, or `cancelled`.
- `amount` must be a valid positive number.
- `createdAt` must strictly equal `request.time`.

### Quote Invariants
- `name` and `email` must be valid, non-empty, and limited in length (< 200 chars).
- `serviceType` must be a valid category string.
- `details` must be a reasonable length string.
- `createdAt` must equal `request.time`.
- `status` must be `unread`, `contacted`, or `archived`.

---

## 2. The "Dirty Dozen" Exploit Payloads

We define 12 malicious payloads testing limits and validation bypasses:

1. **Self-Elevated Status**: Creating a booking marked directly as `confirmed` or `completed` instead of `pending`.
2. **Junk Field Pollution**: Creating a booking with random shadow properties (`{ "isAdmin": true }`).
3. **Identity Spoofing**: Booking with a third-party `userId` to charge or assign tasks to another user.
4. **Massive Payload Injection**: Placing a 10MB structured string in the `details` field to run up Firestore billings.
5. **Backdated Timestamp**: Setting `createdAt` to a historical or future date on create instead of relying on the server timeline.
6. **Negative Amount Hack**: Submitting a booking with a negative cost or free price.
7. **Junk ID Poisoning**: Trying to submit project-level collections using excessively long special character document IDs.
8. **Malicious Role Update**: Writing directly to update administrative arrays via user profile manipulation.
9. **State Step Skipping**: Moving quote status from `unread` directly to `archived` without proper workflow interaction.
10. **Array Injection overflow**: Attempting to push 10,000 tags/members to circumvent list limitations.
11. **PII Exposure Sweep**: Attempting a blanket query/list on quotes/bookings without an identity differentiator (`userId`).
12. **Null/Missing Required Keys**: Posting an incomplete JSON structure missing mandatory validation variables.

---

## 3. Security Rules Draft Proposal

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Catch-All Global Default-Deny Security Guard
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper Primitives
    function isSignedIn() {
      return request.auth != null;
    }

    function isVerifiedUser() {
      return isSignedIn() && request.auth.token.email_verified == true;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    // Bookings collection validation & rules
    match /bookings/{bookingId} {
      allow read, list: if isSignedIn() && (existing().userId == request.auth.uid);
      allow create: if isVerifiedUser() 
                    && isValidId(bookingId)
                    && isValidBooking(incoming())
                    && incoming().userId == request.auth.uid
                    && incoming().createdAt == request.time
                    && incoming().status == 'pending';
                    
      allow update: if isVerifiedUser()
                    && isValidId(bookingId)
                    && isValidBooking(incoming())
                    && existing().userId == request.auth.uid
                    && incoming().userId == existing().userId
                    && incoming().createdAt == existing().createdAt
                    && (
                      // User is allowed to cancel their reservation
                      (incoming().status == 'cancelled' && incoming().diff(existing()).affectedKeys().hasOnly(['status']))
                    );
    }

    // Quotes collection validation & rules
    match /quotes/{quoteId} {
      allow read: if isSignedIn() && (existing().userId == request.auth.uid);
      allow create: if isValidId(quoteId) 
                    && isValidQuote(incoming())
                    && incoming().createdAt == request.time
                    && incoming().status == 'unread'
                    && (!isSignedIn() || incoming().userId == request.auth.uid);
    }

    // Standalone Validation Blueprints
    function isValidBooking(data) {
      return data.keys().hasAll(['userId', 'serviceType', 'name', 'email', 'address', 'sqft', 'bookingDate', 'arrivalWindow', 'amount', 'createdAt', 'status'])
             && data.keys().size() == 11
             && data.userId is string && data.userId.size() <= 128
             && data.serviceType is string && data.serviceType.size() <= 100
             && data.name is string && data.name.size() <= 200
             && data.email is string && data.email.size() <= 200
             && data.address is string && data.address.size() <= 500
             && data.sqft is string && data.sqft.size() <= 50
             && data.bookingDate is string && data.bookingDate.size() <= 50
             && data.arrivalWindow is string && data.arrivalWindow.size() <= 50
             && data.amount is number && data.amount >= 0
             && data.status in ['pending', 'confirmed', 'completed', 'cancelled'];
    }

    function isValidQuote(data) {
      return data.keys().hasAll(['name', 'email', 'serviceType', 'details', 'createdAt', 'status'])
             && (data.keys().size() == 6 || (data.keys().size() == 7 && data.keys().hasAll(['userId'])))
             && data.name is string && data.name.size() <= 200
             && data.email is string && data.email.size() <= 200
             && data.serviceType is string && data.serviceType.size() <= 100
             && data.details is string && data.details.size() <= 5000
             && data.status in ['unread', 'contacted', 'archived'];
    }
  }
}
```
