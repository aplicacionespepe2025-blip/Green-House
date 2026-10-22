# Security Specification - Vivero La Familia Flora

## 1. Data Invariants

1. **Plant Catalog (`/plants/{plantId}`)**:
   - Must be publicly readable by any user/visitor so they can browse the nursery inventory.
   - Mutations (create, update, delete) must be restricted to verified administrators (`aplicaciones.pepe2025@gmail.com`).
   - Plant prices must be non-negative numbers, name and category cannot be empty strings, and size limits must be respected.
   - Deletion and editing must protect against arbitrary key injection.

2. **Reviews (`/reviews/{reviewId}`)**:
   - Publicly readable to display customer testimonials.
   - Creation requires valid rating between 1 and 5, sanitized text length `<= 800` characters, non-empty author name.
   - Deletion/editing limited to administrative moderation or the original review creator.

3. **Inquiries (`/inquiries/{inquiryId}`)**:
   - Can be submitted by any visitor (with valid name, email format, and message `<= 1000` chars).
   - Reading list/get and status modifications restricted to nursery administrators to safeguard customer PII (email, phone).

4. **User Garden & Plant History (`/users/{userId}/garden/{userPlantId}`)**:
   - Accessible only by the authenticated owner whose `request.auth.uid == userId`.
   - Cannot read or write another user's garden records or reminders.

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Catalog Poisoning by Anonymous User)**: Attempt to create `/plants/unauthorized_item` without auth token -> Result: `PERMISSION_DENIED`.
2. **Payload 2 (Stock Manipulation by Unverified User)**: Attempt to update `inStock: false` using an unverified account -> Result: `PERMISSION_DENIED`.
3. **Payload 3 (Negative Price Injection)**: Attempt to write a plant with `price: -45` by admin -> Result: `PERMISSION_DENIED`.
4. **Payload 4 (Massive Description Denial of Wallet)**: Attempt to write a plant with 2MB string description -> Result: `PERMISSION_DENIED`.
5. **Payload 5 (Inquiry PII Snoop)**: Non-admin user querying collection `/inquiries` -> Result: `PERMISSION_DENIED`.
6. **Payload 6 (Cross-User Garden Reading)**: User A attempting `get` on `/users/UserB/garden/my_cactus` -> Result: `PERMISSION_DENIED`.
7. **Payload 7 (Cross-User Garden Tampering)**: User A attempting `create` on `/users/UserB/garden/fake_entry` -> Result: `PERMISSION_DENIED`.
8. **Payload 8 (Invalid Star Rating)**: Review submission with `rating: 7` or `rating: -1` -> Result: `PERMISSION_DENIED`.
9. **Payload 9 (Empty Name Review Attack)**: Review submission with `userName: ""` -> Result: `PERMISSION_DENIED`.
10. **Payload 10 (Admin Role Spoofing)**: Normal authenticated user forging token claims or attempting admin writes -> Result: `PERMISSION_DENIED`.
11. **Payload 11 (Oversized ID Path Injection)**: Attempting to target document with 300 character malformed ID `!@#$%...` -> Result: `PERMISSION_DENIED`.
12. **Payload 12 (Shadow Field Injection in Plant)**: Adding undocumented `isAdmin: true` into a plant payload -> Result: `PERMISSION_DENIED`.
