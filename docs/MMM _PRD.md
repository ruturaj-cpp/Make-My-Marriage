# MAKE MY MARRIAGE
## Product Requirements Document (PRD)

**Version:** 1.1  
**Status:** Draft – MVP Requirements  
**Product Type:** Wedding Management Platform  
**Initial Market:** Multiple cities across Maharashtra, India  
**Languages:** English, Marathi and Hindi  
**Business Model:** Freemium  
**Platform:** Responsive Web Application

---

# 1. Product Overview

## 1.1 Product Vision

Make My Marriage is an all-in-one wedding management platform designed to simplify the planning, coordination, management and celebration of Indian weddings.

The platform connects brides, grooms, families, professional wedding planners, guests and wedding vendors through a centralized digital platform.

It aims to bring wedding events, venues, guests, vendors, budgets, invitations, notifications and wedding memories together in one place.

## 1.2 Problem Statement

Managing Indian weddings involves several challenges:

1. Communicating event details to numerous guests.
2. Managing different cultural events and rituals.
3. Coordinating multiple venues and vendors.
4. Tracking guest attendance and RSVPs.
5. Managing wedding budgets.
6. Communicating last-minute schedule changes.
7. Collecting photographs and videos from multiple guests.
8. Coordinating responsibilities between families and wedding planners.

These activities are often managed through WhatsApp, phone calls, spreadsheets and disconnected applications.

Make My Marriage aims to solve these problems through a centralized wedding management platform.

## 1.3 Product Objectives

- Simplify complete wedding management.
- Generate personalized digital wedding invitations.
- Centralize wedding events, timings and venues.
- Simplify guest management and RSVP tracking.
- Connect customers with wedding venues and vendors.
- Provide wedding countdowns and notifications.
- Centralize wedding photographs and videos.
- Support collaboration between families and wedding planners.
- Support English, Marathi and Hindi.
- Provide free and premium wedding management experiences.

# 2. Target Audience

## Primary Users

### A. Bride and Groom
Couples who want to organize and manage their wedding through a centralized platform.

### B. Family Members
Family members who assist with wedding planning, guest coordination, events and expenses.

### C. Professional Wedding Planners
Wedding planners who manage multiple weddings and coordinate different activities for their clients.

## Secondary Users

### D. Wedding Guests
Guests who need access to wedding invitations, event schedules, venues and photographs.

### E. Wedding Vendors
Businesses providing catering, photography, decoration and other wedding-related services.

### F. Platform Administrators
The internal team responsible for managing users, listings, vendors, subscriptions and platform content.

# 3. Business Model

## 3.1 Freemium Model

Make My Marriage will offer two service levels.

### Free Plan

Designed for families who want to manage their weddings independently.

Proposed inclusions:

- Wedding workspace.
- Basic wedding dashboard.
- Event and ritual management.
- Standard digital invitation.
- Basic guest management.
- RSVP functionality.
- Basic venue and vendor discovery.
- Standard wedding themes.
- Basic countdown and reminders.
- Limited wedding gallery.
- Basic budget tracking.

### Premium Plan

Designed for families and planners requiring advanced capabilities.

Proposed inclusions:

- Premium invitation templates.
- Advanced invitation customization.
- Higher guest limits.
- Advanced RSVP reporting.
- Additional family and planner collaborators.
- Advanced budget reporting.
- Increased photo and video storage.
- Advanced notifications.
- Additional gallery controls.
- Premium themes and customization.

### Subscription Requirements

- Users should be able to view available plans.
- Users should be able to upgrade from Free to Premium.
- Premium entitlements should be enforced by the backend.
- Subscription status should be available in the wedding dashboard.
- Users should be able to view subscription history.
- Platform administrators should be able to manage plans and limits.

Pricing, billing frequency and exact feature limits will be finalized after infrastructure and operating costs are evaluated.

# 4. Geographical and Language Scope

## 4.1 Initial Geographical Scope

The first launch will cover multiple cities across Maharashtra.

Proposed cities:

- Mumbai.
- Pune.
- Nashik.
- Nagpur.
- Thane.
- Chhatrapati Sambhajinagar.
- Kolhapur.
- Additional Maharashtra cities as listings become available.

The system must support expansion to additional Indian states.

## 4.2 Language Support

The MVP must support:

1. English.
2. Marathi.
3. Hindi.

Functional requirements:

- Language selector.
- Language preference in user profiles.
- Translated navigation.
- Translated dashboard labels.
- Translated system messages.
- Multilingual invitation templates.
- Unicode support.
- Localized date and time formats.

User-generated content should retain its original language unless the user explicitly requests translation.

# 5. User Roles and Access Management

The platform must implement role-based access control.

| Role | Access |
|---|---|
| Bride | Wedding management |
| Groom | Wedding management |
| Family Member | Permission-based access |
| Wedding Planner | Assigned wedding management |
| Guest | Authorized wedding information |
| Vendor | Own business profile and enquiries |
| Platform Admin | Platform-wide administration |

## 5.1 Wedding Workspace

Every wedding must have an independent workspace.

Multiple authorized users can collaborate within the same workspace.

Example:

- Rahul creates a wedding.
- Priya joins the wedding.
- Rahul's father joins as a family member.
- Priya's sister joins as a family member.
- A wedding planner joins as a planner.

The couple should control invitations and access permissions.

## 5.2 Planner Account Structure

A professional wedding planner must be able to manage multiple wedding workspaces through one account.

Requirements:

- Create multiple client wedding workspaces.
- Switch between weddings.
- View assigned weddings.
- View upcoming events across assigned weddings.
- Manage client access.
- Assign team members.
- Maintain separate guest lists.
- Maintain separate budgets.
- Manage vendors for individual weddings.
- Prevent cross-wedding data exposure.

## 5.3 Permission Management

Permissions should include:

- View wedding details.
- Create and edit events.
- Manage guests.
- Manage invitations.
- Manage vendors.
- Manage budget.
- Manage gallery.
- Manage notifications.
- Manage workspace settings.

The couple should have control over assigning and revoking access.

# 6. Functional Requirements – MVP

## Module 1: User Registration and Authentication

Objective: Allow users to register, authenticate and create wedding workspaces.

Requirements:

- Email or mobile-based registration.
- Secure login and logout.
- Password recovery.
- User profile management.
- Language selection.
- Wedding creation.
- Invitation-based workspace joining.
- Support for multiple wedding memberships.

Wedding creation fields:

- Bride's name.
- Groom's name.
- Wedding date.
- Wedding city.
- Estimated budget.
- Cultural or regional traditions.
- Management preference.

Management preferences:

- Self-managed wedding.
- Planner-assisted wedding.

Acceptance criteria:

- Users can register and log in.
- Users can create wedding workspaces.
- Authorized users can join existing workspaces.
- Unauthorized users cannot access private management pages.

## Module 2: Wedding Dashboard

Objective: Provide a centralized overview of wedding activities.

Dashboard information:

- Bride and groom details.
- Wedding countdown.
- Upcoming events.
- Total guest count.
- RSVP statistics.
- Selected venues.
- Vendor enquiry status.
- Estimated wedding budget.
- Recent announcements.
- Recent gallery uploads.

Acceptance criteria:

The dashboard must display information relevant to the selected wedding and the logged-in user's permissions.

## Module 3: Wedding Event and Ritual Management

Objective: Allow users to create, manage and organize multiple wedding events.

Requirements:

- Create events.
- Edit events.
- Delete events.
- Add event descriptions.
- Assign venues.
- Add event timings.
- Assign guest groups.
- Add dress codes.
- Add event-specific themes.
- Add instructions.

Event information:

| Field | Description |
|---|---|
| Event ID | Unique identifier |
| Event Name | Haldi, Mehendi, Sangeet, etc. |
| Event Date | Scheduled date |
| Start Time | Starting time |
| End Time | Ending time |
| Venue | Selected venue |
| Location | Address and map location |
| Description | Event information |
| Dress Code | Optional |
| Guest Groups | Invited guests |
| Theme | Event theme |

The platform must support multiple events on the same day and different venues for different events.

Acceptance criteria:

- Users can create multiple events.
- Events can be edited and deleted.
- Events can have separate venues and schedules.
- Event updates appear on the wedding invitation.
- Affected guests can receive important event updates.

## Module 4: Digital Wedding Invitation

Objective: Generate a personalized wedding website for every wedding.

Requirements:

- Generate a unique wedding URL.
- Display bride and groom details.
- Display photographs.
- Display invitation messages.
- Display wedding events.
- Display timings.
- Display venue information.
- Provide map directions.
- Display countdown.
- Provide RSVP.
- Display contact information.
- Support WhatsApp sharing.
- Support multilingual invitation templates.

Example URL:

makemymarriage.com/wedding/rahul-priya

Invitation customization:

- Select templates.
- Select colours.
- Add photographs.
- Customize invitation messages.
- Select language.
- Preview before publishing.

Acceptance criteria:

- Every wedding has a unique invitation URL.
- Guests can access public invitation information without registration.
- Invitation pages are responsive.
- Published event updates appear on the invitation.

## Module 5: Guest Management and RSVP

Objective: Simplify guest coordination and attendance tracking.

Requirements:

- Add guests manually.
- Import guests through CSV/Excel.
- Create guest groups.
- Edit and delete guests.
- Assign guests to specific events.
- Track invitation status.
- Track RSVP status.
- Track event-wise attendance.
- Export guest lists.

Guest groups:

- Bride's family.
- Groom's family.
- Friends.
- Office colleagues.
- Relatives.
- VIP guests.

RSVP statuses:

- Pending.
- Accepted.
- Declined.

Additional requirements:

- No mandatory guest account registration.
- Unique secure guest invitation links.
- Household-level invitations.
- Event-specific RSVP.
- Attendance summaries.

Acceptance criteria:

The couple should be able to view the invited and expected attendance for every event.

## Module 6: Venue Discovery and Enquiries

Objective: Help users discover and enquire about wedding venues.

Requirements:

- Select city.
- Search venues.
- Filter by budget.
- Filter by capacity.
- Filter by venue type.
- View photographs.
- View facilities.
- View venue addresses.
- View accommodation availability.
- Compare venues.
- Send enquiries.

Venue categories:

- Hotels.
- Resorts.
- Banquet halls.
- Wedding lawns.
- Farmhouses.
- Destination wedding venues.

Venue profiles:

- Venue name.
- Location.
- Description.
- Photographs.
- Capacity.
- Price range.
- Facilities.
- Catering availability.
- Accommodation information.
- Contact information.

Enquiry details:

- Customer name.
- Contact information.
- Wedding date.
- Expected guest count.
- Estimated budget.
- Additional requirements.

Acceptance criteria:

Users can discover venues and submit enquiries through the platform.

Direct online booking and payment are excluded from the MVP.

## Module 7: Wedding Themes and Customization

Objective: Provide wedding design inspiration according to regional traditions.

Requirements:

- Browse themes.
- Browse event-specific themes.
- Select colours.
- Preview invitation designs.
- Apply themes to individual events.
- Customize available design elements.

Initial cultural categories:

- Maharashtrian.
- Punjabi.
- Gujarati.
- Bengali.
- South Indian.
- Rajasthani.
- Other regional traditions.

Example:

| Event | Theme |
|---|---|
| Haldi | Yellow and marigold |
| Mehendi | Green and floral |
| Sangeet | Glamorous |
| Wedding | Traditional |
| Reception | Royal and elegant |

Themes must be customizable and should not restrict users to a particular cultural category.

## Module 8: Vendor Discovery and Enquiries

Objective: Connect customers with wedding service providers.

Vendor categories:

- Catering.
- Photography.
- Videography.
- Decoration.
- Makeup artists.
- Mehendi artists.
- DJs and entertainment.
- Wedding planners.

Vendor profiles:

- Business name.
- Business description.
- Location.
- Contact information.
- Service categories.
- Portfolio.
- Photographs.
- Price range.
- Verification status.

Requirements:

- Browse vendors.
- Search vendors.
- Filter by category.
- Filter by city.
- View profiles.
- Save shortlisted vendors.
- Submit enquiries.
- Track enquiry status.

Enquiry statuses:

- Submitted.
- Viewed.
- Responded.
- Closed.

Acceptance criteria:

Customers can submit enquiries and vendors can manage enquiries associated with their businesses.

Direct payments and bookings are excluded from the MVP.

## Module 9: Notifications and Reminders

Objective: Ensure guests and organizers receive timely information.

Notification categories:

1. Wedding countdown.
2. Event reminders.
3. Important announcements.
4. Venue changes.
5. Timing changes.
6. Event cancellations.

Notification channels:

Initial:

- In-app notifications.
- Email notifications.

Future:

- WhatsApp Business API.
- SMS.
- Push notifications.

Requirements:

- Configurable reminder schedules.
- Relevant guest targeting.
- Notification history.
- Updated event information.
- Localized notification content.

Acceptance criteria:

Authorized users can publish updates, and affected guests receive notifications through enabled channels.

## Module 10: Wedding Photo and Video Gallery

Objective: Provide a centralized location for wedding photographs and videos.

Requirements:

- Create event-wise albums.
- Upload photographs.
- Upload videos.
- Generate QR codes.
- Allow authorized guest uploads.
- View photographs and videos.
- Download authorized media.
- Manage media permissions.
- Delete unwanted uploads.
- Support professional photographer uploads.

Gallery organization:

- Haldi.
- Mehendi.
- Sangeet.
- Wedding Ceremony.
- Reception.
- Guest Uploads.

### Gallery Privacy Settings

The couple can select:

**Public:** Anyone with the published gallery URL can view.

**Private:** Only authorized users can view.

**Restricted Link:** People with a valid access link can view.

Additional requirements:

- Viewing and uploading permissions must be separate.
- Gallery settings can be changed by the couple.
- Access can be revoked.
- Public viewing does not automatically allow public uploading.
- Private media must not be exposed through unrestricted storage URLs.
- Media can be reported and removed.
- Storage and file-size limits must be configurable.

Acceptance criteria:

Users can access and upload media according to the selected gallery permissions.

## Module 11: Wedding Budget Management

Objective: Help families and planners track wedding expenses.

Requirements:

- Set estimated budget.
- Create expense categories.
- Add estimated expenses.
- Record actual expenses.
- Associate expenses with vendors.
- Edit and delete expenses.
- View remaining budget.
- View category-wise spending.

Initial categories:

- Venue.
- Catering.
- Decoration.
- Photography.
- Videography.
- Accommodation.
- Transportation.
- Other expenses.

Dashboard information:

- Estimated budget.
- Actual expenses.
- Remaining budget.
- Category-wise spending.
- Vendor-wise expenses.

Acceptance criteria:

Authorized users can record expenses and view updated budget information.

## Module 12: Admin and Vendor Management

Objective: Provide administrative control over the platform.

Admin requirements:

- Manage users.
- Manage wedding workspaces.
- Approve vendors.
- Manage venue listings.
- Manage vendor categories.
- Manage cultural categories.
- Manage invitation templates.
- Manage wedding themes.
- Manage subscriptions.
- Manage plans and usage limits.
- Review reports.
- Monitor storage usage.
- Handle content reports.

Vendor requirements:

- Register.
- Create business profile.
- Add services.
- Upload portfolio.
- Update pricing.
- Receive enquiries.
- Respond to enquiries.
- Update enquiry status.

## Module 13: Subscription and Plan Management

Objective: Support the freemium business model.

Requirements:

- Display Free and Premium plans.
- Display plan features.
- Display usage limits.
- Allow plan upgrades.
- Track subscription status.
- Track subscription history.
- Manage premium entitlements.
- Handle subscription expiration.
- Allow administrators to manage plans.

Premium access must be checked on the backend, not only through frontend visibility.

Exact prices, limits and payment integrations will be finalized separately.

# 7. Non-Functional Requirements

## Performance

- Responsive page loading.
- Optimized images.
- Efficient database queries.
- Pagination for large lists.
- Background processing for media uploads.

## Security

- Secure authentication.
- Role-based access control.
- HTTPS.
- Secure password storage.
- Protected guest links.
- Secure media access.
- Input validation.
- Protection against common web vulnerabilities.

## Scalability

The architecture should support multiple weddings, users, planners, vendors, events, guests and media uploads.

## Usability

- Mobile-first interface.
- Simple navigation.
- Multilingual support.
- Easy invitation sharing.
- Clear dashboards.
- Responsive layouts.

## Privacy

- Couple-controlled wedding privacy.
- Restricted access to private wedding data.
- Separate viewing and uploading permissions.
- Secure guest information.
- Configurable media retention and deletion policies.

# 8. Website Structure

## Public Website

- Home.
- About.
- How It Works.
- Explore Venues.
- Explore Vendors.
- Pricing.
- Login.
- Register.
- Create Your Wedding.

## Couple Dashboard

- Overview.
- Wedding Details.
- Events and Rituals.
- Guest Management.
- Invitations.
- Venues.
- Vendors.
- Themes.
- Budget.
- Notifications.
- Photos and Videos.
- Settings and Permissions.
- Subscription.

## Planner Dashboard

- Overview.
- My Weddings.
- Client Management.
- Upcoming Events.
- Vendor Enquiries.
- Team Members.
- Account Settings.

## Guest Wedding Website

- Invitation.
- Couple Information.
- Wedding Schedule.
- Event Locations.
- RSVP.
- Gallery.
- Important Information.

## Vendor Portal

- Business Profile.
- Services.
- Portfolio.
- Enquiries.
- Enquiry Status.
- Account Settings.

## Admin Dashboard

- Users.
- Weddings.
- Venues.
- Vendors.
- Themes.
- Invitation Templates.
- Subscriptions.
- Reports.
- Platform Settings.

# 9. High-Level Database Entities

The database should include:

1. Users.
2. User Profiles.
3. Weddings.
4. Wedding Members.
5. Roles and Permissions.
6. Planner Profiles.
7. Planner Teams.
8. Events.
9. Venues.
10. Venue Enquiries.
11. Guests.
12. Guest Groups.
13. Event Invitations.
14. RSVPs.
15. Invitation Templates.
16. Wedding Themes.
17. Vendors.
18. Vendor Categories.
19. Vendor Services.
20. Vendor Enquiries.
21. Notifications.
22. Budget Categories.
23. Expenses.
24. Albums.
25. Media Files.
26. Guest Upload Links.
27. Subscription Plans.
28. User Subscriptions.
29. Subscription Entitlements.
30. Platform Reports.

Important relationships:

- One planner can manage multiple weddings.
- One wedding can have multiple authorized users.
- One wedding can have multiple events.
- One event can have multiple invited guests.
- One wedding can have multiple venues and vendor enquiries.
- One wedding can have multiple albums.
- One user can participate in multiple wedding workspaces.

# 10. Key User Journeys

## Self-Managed Wedding

1. Register.
2. Create wedding workspace.
3. Enter wedding information.
4. Select city and budget.
5. Add events.
6. Explore venues.
7. Send vendor enquiries.
8. Add guests.
9. Customize invitation.
10. Publish wedding website.
11. Share invitation.
12. Manage updates.
13. Collect wedding memories.

## Planner-Assisted Wedding

1. Planner registers.
2. Creates client wedding workspace.
3. Adds couple information.
4. Invites the couple.
5. Couple joins workspace.
6. Planner and family collaborate.
7. Planner manages events and vendors.
8. Family manages assigned activities.
9. Guests access the invitation.
10. All authorized users coordinate through the workspace.

## Guest Journey

1. Receive invitation.
2. Open wedding link.
3. View couple information.
4. Check events and timings.
5. View locations.
6. Submit RSVP.
7. Receive relevant notifications.
8. Upload photographs.
9. View authorized gallery content.

## Vendor Journey

1. Register.
2. Create business profile.
3. Add services.
4. Upload portfolio.
5. Complete verification.
6. Receive enquiries.
7. Respond to enquiries.
8. Manage enquiry status.

# 11. Success Metrics

## User Adoption

- Registered users.
- Created wedding workspaces.
- Active wedding workspaces.
- Active planner accounts.

## Engagement

- Invitations generated.
- Invitations shared.
- RSVP completion rate.
- Events created.
- Active wedding users.

## Marketplace

- Approved vendors.
- Listed venues.
- Enquiries submitted.
- Vendor response rate.

## Gallery

- Photographs uploaded.
- Videos uploaded.
- Active wedding galleries.

## Business

- Free users.
- Premium subscribers.
- Free-to-premium conversion.
- Subscription retention.
- Average platform storage cost.

# 12. MVP Scope and Exclusions

## Included

- Authentication.
- Wedding creation.
- Multi-user workspaces.
- Multi-wedding planner accounts.
- Wedding dashboard.
- Event management.
- Digital invitations.
- Guest management.
- RSVP.
- Venue discovery.
- Vendor discovery.
- Enquiries.
- Wedding themes.
- Notifications.
- Gallery.
- Budget tracking.
- English, Marathi and Hindi.
- Public and private gallery options.
- Basic subscription management.

## Excluded from Initial MVP

- Direct venue booking.
- Direct vendor payments.
- Automated vendor settlements.
- Advanced AI recommendations.
- Facial-recognition photo discovery.
- Complete hotel booking integration.
- Transportation booking.
- Advanced accounting.
- Full WhatsApp automation.
- Native Android and iOS applications.

# 13. Product Roadmap

### Phase 1 – Foundation
Authentication, multilingual support, wedding workspaces, permissions and planner accounts.

### Phase 2 – Core Wedding Management
Dashboard, events, invitations, guest management and RSVP.

### Phase 3 – Marketplace
Venue listings, vendor listings, search and enquiries.

### Phase 4 – Guest Experience
Themes, countdown, notifications, gallery and QR uploads.

### Phase 5 – Business Features
Freemium plans, subscription management and usage limits.

### Phase 6 – Testing and Launch
Functional testing, security testing, performance testing, multilingual testing and initial Maharashtra launch.

# 14. Open Decisions for Future Finalization

1. Exact Free and Premium pricing.
2. Guest and collaborator limits.
3. Photo and video storage limits.
4. Subscription billing frequency.
5. Payment gateway.
6. Vendor verification process.
7. Media retention period.
8. Guest link security and expiration.
9. Notification provider.
10. Final launch city and listing coverage.
11. Data deletion and account closure policies.
12. Customer support process.

# 15. Final Product Definition

Make My Marriage is a centralized wedding management platform connecting couples, families, professional planners, guests and wedding vendors.

It will provide digital invitations, wedding event management, guest coordination, venue and vendor discovery, notifications, budget management and centralized wedding memories.

The product will launch across multiple Maharashtra cities, support English, Marathi and Hindi, and follow a freemium business model.

**Product Tagline:**

One Wedding. Every Event. Every Guest. Everything in One Place.