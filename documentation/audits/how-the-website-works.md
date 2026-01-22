# HOW THE WEBSITE WORKS - Complete System Audit

**Repository**: kashi-kweyu-portfolio
**Type**: Full-Stack E-Commerce & Portfolio Platform
**Audit Date**: 2026-01-18

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [How Users Browse & Shop](#2-how-users-browse--shop)
3. [How Authentication Works](#3-how-authentication-works)
4. [How Orders & Payments Work](#4-how-orders--payments-work)
5. [How Downloads & Licenses Work](#5-how-downloads--licenses-work)
6. [How the Admin Dashboard Works](#6-how-the-admin-dashboard-works)
7. [How Data Flows Through the System](#7-how-data-flows-through-the-system)
8. [How Security Protects Everything](#8-how-security-protects-everything)
9. [How Content is Managed](#9-how-content-is-managed)
10. [How Files & Folders are Organized](#10-how-files--folders-are-organized)

---

## 1. The Big Picture

### What This Website Is

This is a **portfolio and digital product store** built with Next.js.

[ELI5: Imagine a shop where you can look at someone's work (like an artist's gallery) AND buy digital things (like templates or code). It's like having a museum and a store in the same building.]

### The Main Parts

| Part | What It Does |
|------|--------------|
| **Public Pages** | Anyone can see - homepage, about, projects, products |
| **Shop** | Browse and buy digital products |
| **User Dashboard** | See your purchases and downloads |
| **Admin Dashboard** | Manage everything (only for admins) |
| **API** | The "brain" that handles all requests |
| **Database** | Stores all the information |

[ELI5: Think of the website like a restaurant. The **public pages** are the dining room anyone can walk into. The **shop** is the menu. The **user dashboard** is your table where your food arrives. The **admin dashboard** is the kitchen where staff work. The **API** is the waiter taking orders between you and the kitchen. The **database** is the refrigerator storing all ingredients.]

### Technology Stack

```
Frontend:  Next.js 14 + React + TypeScript
Styling:   Tailwind CSS + DaisyUI
Backend:   Next.js API Routes
Database:  PostgreSQL + Prisma ORM
Auth:      NextAuth.js (login system)
```

[ELI5: These are the tools used to build the website. **Next.js** is like LEGO blocks for websites. **React** makes things interactive. **PostgreSQL** is a super organized filing cabinet for data. **Prisma** is a translator that helps the code talk to the database.]

---

## 2. How Users Browse & Shop

### 2.1 Browsing Products

**What happens when you visit `/products`:**

```
1. Browser asks for the page
2. Server fetches all published products from database
3. Products displayed in a grid with:
   - Thumbnail image
   - Name and description
   - Price (USD or UGX)
   - Category badge
4. User can filter by category
5. User can click to see details
```

[ELI5: It's like walking into a toy store. You see all the toys on shelves (the grid). Each toy has a picture, name, and price tag. You can go to different aisles (categories) like "Action Figures" or "Board Games". When you find something cool, you pick it up to look closer (click for details).]

**Database table used:** `DigitalProduct`

**Key fields:**
| Field | Purpose |
|-------|---------|
| `name` | Product title |
| `slug` | URL-friendly name (my-cool-template) |
| `description` | What the product does |
| `price` | Cost in USD |
| `ugxPrice` | Cost in Ugandan Shillings |
| `category` | Type: TEMPLATE, THEME, UI_KIT, TOOL, etc. |
| `published` | Is it visible? (true/false) |
| `featured` | Show on homepage? |

---

### 2.2 Adding to Cart

**What happens when you click "Add to Cart":**

```
1. User must be logged in
2. System checks: Does product exist? Is it published?
3. System checks: What license type? (Personal/Commercial/Team)
4. Creates or finds user's cart
5. Adds item to cart (or updates quantity if already there)
6. Returns updated cart count
```

[ELI5: It's like putting toys in a shopping basket. But first, you need to tell the store who you are (login). Then the worker checks if the toy is actually for sale. They ask "Is this for you or for your business?" (license type). Then they put it in YOUR basket, not someone else's.]

**Code location:** `lib/cart.ts`

**Key functions:**
| Function | What It Does |
|----------|--------------|
| `getOrCreateCart(userId)` | Find your basket or make a new one |
| `addToCart(userId, productId, licenseType)` | Put something in the basket |
| `removeFromCart(userId, itemId)` | Take something out |
| `clearCart(userId)` | Empty the whole basket |
| `calculateCartTotal(userId, currency)` | Add up all the prices |

---

### 2.3 The Wishlist

**What happens when you click the heart icon:**

```
1. Must be logged in
2. Product gets saved to your wishlist
3. You can view all wishlist items later
4. Click again to remove from wishlist
```

[ELI5: It's like making a "birthday list" of toys you want. You don't have to buy them now, but you're saving them to remember later. If you change your mind, you can cross them off the list.]

**Database table:** `WishlistItem`

**Code location:** `lib/wishlist.ts`

---

### 2.4 Currency Support

The website supports two currencies:
- **USD** (US Dollars) - Default
- **UGX** (Ugandan Shillings) - Local currency

[ELI5: Some people pay with American money, some pay with Ugandan money. The store shows prices in whichever money you prefer, like how some toy stores show prices in both dollars and euros.]

**How it works:**
1. Products have both `usdPrice` and `ugxPrice` stored
2. User's preference saved in browser (localStorage)
3. Prices converted using exchange rates in `lib/currency.ts`

---

## 3. How Authentication Works

### 3.1 Signing Up

**What happens when you create an account:**

```
1. User enters: email, name, password
2. System validates:
   - Email format correct?
   - Password at least 8 characters?
   - Email not already used?
3. Password gets "hashed" (scrambled for safety)
4. New User record created in database
5. User can now log in
```

[ELI5: It's like joining a secret club. You tell them your name and make up a secret password. They check if someone else already has that name. Then they put your password through a special scrambler so even if bad guys see it, they can't read it. Now you're a member!]

**Code location:** `/api/auth/signup/route.ts`

**Password hashing:**
```typescript
// Your password: "mypassword123"
// After hashing: "$2b$10$X7z8Y9q2..." (unreadable jumble)
```

[ELI5: Hashing is like putting your password through a paper shredder. Even if someone finds the shredded pieces, they can't put it back together to read your password.]

---

### 3.2 Logging In

**What happens when you log in:**

```
1. User enters email + password
2. System finds user by email
3. System compares password with stored hash
4. If match:
   - Create a "token" (digital ticket)
   - Store token in browser cookie
   - User is now "logged in"
5. If no match:
   - Show error, don't let them in
```

[ELI5: It's like showing your club membership card. You say your name, whisper the secret password, and if it's right, they give you a special wristband (token). That wristband lets you into all the club rooms. If you say the wrong password, no wristband for you!]

**Session storage:** JWT (JSON Web Token) in a secure cookie

**Cookie name:** `__Secure-next-auth.session-token`

---

### 3.3 Staying Logged In

**How the system remembers you:**

```
1. Every page request includes your cookie
2. Server reads the token from cookie
3. Token contains: user ID, email, role
4. Server knows who you are without asking again
```

[ELI5: Your wristband has invisible writing only the club can read. Every time you walk into a room, they scan your wristband and know exactly who you are and what rooms you're allowed in.]

**Token expiry:**
- Regular users: 30 days
- "Remember me" unchecked: 1 day
- Admin users: Maximum 8 hours

[ELI5: Wristbands expire! Regular members get wristbands that last a month. If you said "don't remember me," it only lasts one day. Admins (the bosses) get wristbands that expire in 8 hours because they have special powers.]

---

### 3.4 Two-Factor Authentication (2FA)

**What is 2FA:**

Two-Factor Authentication means you need TWO things to log in:
1. Something you KNOW (password)
2. Something you HAVE (phone with authenticator app)

[ELI5: Imagine your club has a really important treasure room. To get in, you need BOTH your password AND a special code from a magic watch that changes every 30 seconds. Even if someone steals your password, they can't get in without your magic watch!]

**How it works:**

```
1. Admin enables 2FA in settings
2. System generates a secret key
3. QR code shown on screen
4. User scans QR with phone app (Google Authenticator)
5. App now shows 6-digit codes that change every 30 seconds
6. When logging in, user enters password + current code
7. System checks if code is correct for this moment in time
```

**Code location:** `/api/auth/2fa/*`

**Apps that work:** Google Authenticator, Authy, Microsoft Authenticator

---

### 3.5 Trusted Devices

**What happens after 2FA:**

```
1. After entering correct 2FA code
2. System asks: "Trust this device for 7 days?"
3. If yes, creates a special "trust cookie"
4. Next time on this device: skip 2FA prompt
5. After 7 days or different device: ask for 2FA again
```

[ELI5: After showing your password AND magic code, the club can give you a "VIP pass" for your specific chair at home. For 7 days, when you come from that chair, they recognize you and don't ask for the magic code. But if you sit in a different chair, they check again!]

**Trust cookie contains:**
- User ID
- Device fingerprint (hashed)
- IP address (hashed)
- Expiry time

---

### 3.6 Password Reset

**What happens when you forget your password:**

```
1. User clicks "Forgot Password"
2. User enters their email
3. System generates a special reset link
4. Email sent with the link (valid for 1 hour)
5. User clicks link, enters new password
6. Old password replaced with new one
7. Reset link marked as "used" (can't use again)
```

[ELI5: If you forget the club password, you can ask for a new one. They send a special letter to your address (email) with a magic ticket. The ticket only works once and expires in an hour. You use it to pick a brand new password.]

**Database table:** `PasswordResetToken`

---

## 4. How Orders & Payments Work

### 4.1 Checkout Flow

**What happens when you checkout:**

```
1. User goes to /checkout
2. System shows cart summary:
   - All items with prices
   - Subtotal
   - Tax (if any)
   - Total
3. System checks for discounts (student discount?)
4. User accepts terms & conditions
5. User clicks "Place Order"
6. System creates Order record
7. System creates OrderItem for each cart item
8. Cart gets cleared
9. User sees "Order Placed" confirmation
```

[ELI5: It's like going to the toy store register. They scan all your toys (cart summary), add up the prices (subtotal), check if you have any coupons (discounts), and ask you to agree to the store rules (terms). Then you pay, they give you a receipt (order confirmation), and your basket becomes empty again!]

**Database tables:**
- `Order` - The main receipt
- `OrderItem` - Each toy on the receipt

---

### 4.2 Order Status Lifecycle

```
PENDING → PROCESSING → COMPLETED
              ↓
         CANCELLED
              ↓
          REFUNDED
```

| Status | Meaning |
|--------|---------|
| `PENDING` | Order placed, waiting for payment |
| `PROCESSING` | Payment received, preparing delivery |
| `COMPLETED` | Everything done, licenses issued |
| `CANCELLED` | Order was cancelled |
| `REFUNDED` | Money returned to customer |

[ELI5: Your order goes through stages like a pizza delivery. First it's WAITING (pending). Then they START MAKING IT (processing). Then it's DELIVERED (completed). Sometimes orders get CANCELLED if something goes wrong, or REFUNDED if you want your money back.]

---

### 4.3 Payment (Currently Demo Mode)

**Current Status:** Manual payment confirmation only

[ELI5: Right now, the store doesn't have a real cash register connected. It's like playing "store" where you pretend to pay. An adult (admin) has to manually say "yes, they paid" before you get your stuff.]

**How it currently works:**
1. Order created with `paymentStatus: PENDING`
2. Admin manually confirms payment
3. Admin calls `/api/payment/manual/confirm`
4. Payment status changes to `COMPLETED`
5. Order can now be fulfilled

**What's needed for real payments:**
- Stripe integration (credit cards)
- Flutterwave integration (mobile money for Uganda)
- Payment webhooks

---

### 4.4 Student Discounts

**How students get 50% off:**

```
1. Student goes to verification page
2. Submits:
   - School name
   - School email
   - ID photo
   - Age (if under 18, needs guardian email)
3. Admin reviews submission
4. If approved:
   - Discount becomes active
   - Valid for 1 year
   - 50% off all purchases!
5. At checkout, discount automatically applied
```

[ELI5: If you're a student, you can prove it by showing your school stuff. A grown-up checks if it's real. If it is, you get a special "half-price pass" that works for a whole year! Every time you buy something, it's half price automatically.]

**Database table:** `StudentVerification`

**Discount types:**
| Type | Who Gets It | Amount |
|------|-------------|--------|
| `STUDENT` | Verified students 18+ | 50% off |
| `YOUTH_13_18` | Students 13-17 | 50% off |
| `PROMOTIONAL` | Special promotions | Varies |
| `NONE` | Everyone else | No discount |

---

## 5. How Downloads & Licenses Work

### 5.1 What is a License?

A license is your **permission slip** to use a digital product.

[ELI5: When you buy a toy at a store, you own that toy. But digital products are different - you can copy them easily. So instead of selling the "thing," they sell a "permission slip" (license) that says you're allowed to use it.]

**License Types:**

| Type | What You Can Do | Max Users |
|------|-----------------|-----------|
| **PERSONAL** | Use for yourself only | 1 person |
| **COMMERCIAL** | Use for business/clients | 1 person |
| **TEAM** | Share with your team | Up to 5 people |

[ELI5: A PERSONAL license is like a toy just for you. A COMMERCIAL license is like a tool you can use to build things for other people. A TEAM license is like a board game the whole family can play together.]

---

### 5.2 How Licenses Get Created

**After payment is confirmed:**

```
1. Admin triggers "Fulfill Order"
2. For each item in the order:
   a. Generate unique license key (LIC-XXXX-XXXX-XXXX)
   b. Create License record in database
   c. Link license to OrderItem
3. Mark order as COMPLETED
4. User can now download!
```

[ELI5: After you pay for a toy, they put a special sticker with a unique code on it. That code proves it's YOUR toy. They write down in their book "this code belongs to this kid."]

**License key format:** `LIC-` + 12 random characters

**Example:** `LIC-A3B7-C9D2-E5F1`

---

### 5.3 Downloading Products

**What happens when you click Download:**

```
1. System checks: Are you logged in?
2. System checks: Do you have an active license?
3. System checks: Is your account suspended?
4. System checks: Have you downloaded too many times?
5. If all good:
   a. Create download token (valid 5 minutes)
   b. Log the download attempt
   c. Serve the file
6. Mark download as successful
```

[ELI5: When you try to take your toy home, the store checks: "Are you a member? Is this your toy? Are you in trouble? Have you taken too many toys today?" If everything is okay, they give you a special time-limited pass to grab your toy. You have 5 minutes to get it!]

**Download limits:**
- **3 downloads** per product per **14 days**
- After that, you need to wait or request a reset

[ELI5: You can download your toy 3 times in two weeks. This stops people from downloading a million times and sharing with everyone (which isn't allowed).]

---

### 5.4 Abuse Detection

**The system watches for suspicious behavior:**

| Suspicious Activity | Points Added |
|---------------------|--------------|
| More than 10 downloads in 24 hours | +30 |
| More than 5 downloads in 24 hours | +15 |
| More than 5 different locations (IPs) | +40 |
| More than 3 different locations | +20 |
| More than 3 devices (personal license) | +30 |
| More than 50% failed downloads | +20 |

**What happens at different scores:**
- **50+ points:** Admin gets notified to check
- **70+ points:** Account automatically suspended

[ELI5: The store has a security guard who watches for weird stuff. If someone downloads from 10 different places in one day, that's suspicious - maybe they're sharing their account! The guard keeps a "suspicion score." A little weird stuff is okay, but too much suspicious behavior and they freeze your account until a manager can look into it.]

**Code location:** `lib/suspension.ts`

---

### 5.5 Team License Seats

**How team licenses work:**

```
1. User buys TEAM license (up to 5 users)
2. License owner can "assign seats" to team members
3. Each team member gets an email
4. Team members can download using that license
5. Owner can revoke seats anytime
```

[ELI5: A TEAM license is like buying a Netflix family plan. You're the boss, and you can invite up to 4 friends to watch too. You decide who's on the list, and you can kick someone off if needed.]

**Database table:** `LicenseSeatAssignment`

**Limits:**
- Maximum 5 seats per team license
- Each email can only have one seat per license

---

## 6. How the Admin Dashboard Works

### 6.1 Who Can Access Admin?

**Required roles:** ADMIN, OWNER, MODERATOR, or EDITOR

**Additional requirements:**
- Must have 2FA enabled
- Must verify 2FA recently (or have trusted device)
- Session times out after 45 minutes of inactivity

[ELI5: The admin area is like the "employees only" door at a store. You need to be a worker (have the right role), wear your special badge (2FA), and the door locks automatically if you stand still too long (idle timeout).]

---

### 6.2 Admin Sections

| Section | What Admins Do There |
|---------|----------------------|
| **Dashboard** | See overview stats and recent activity |
| **Users** | Manage user accounts, suspend bad actors |
| **Products** | Create/edit digital products |
| **Orders** | View orders, fulfill them, handle refunds |
| **Projects** | Manage portfolio projects |
| **Content** | Edit website text and pages |
| **Settings** | Configure site options |
| **Security** | View audit logs, security settings |
| **Student Verification** | Approve/reject student discount requests |
| **Requests** | Handle service/project requests |

[ELI5: The admin dashboard is like a control room with different screens. One screen shows all the customers (Users). Another shows all the products on the shelves (Products). Another shows all the receipts (Orders). Each screen lets you control different parts of the store.]

---

### 6.3 Audit Logs

**Everything important gets recorded:**

```
- Who did it (user ID)
- What they did (action type)
- What it affected (resource + ID)
- When it happened (timestamp)
- Where they were (IP address, hashed)
- What browser they used
```

[ELI5: Imagine security cameras that write down everything that happens. "At 3:45pm, Bob from the Blue Computer looked at Order #123." If something goes wrong later, we can look back and see exactly what happened.]

**Example audit events:**
- `USER_LOGIN` - Someone logged in
- `LICENSE_ISSUED` - A license was created
- `DOWNLOAD_SUCCEEDED` - Someone downloaded a file
- `ACCOUNT_SUSPENDED` - An account was frozen
- `SETTINGS_CHANGED` - Admin changed settings

---

### 6.4 Step-Up Authentication

**Extra security for sensitive actions:**

For very important admin pages, even logged-in admins must re-verify:
- `/admin/users` - Managing user accounts
- `/admin/settings` - Changing site settings
- `/admin/security` - Security configuration
- `/admin/orders` - Order management

[ELI5: Some rooms in the building are extra special. Even if you have a badge to get in the building, for the vault you have to show your badge AGAIN. This way, if someone steals your badge while you're getting coffee, they still can't get into the vault.]

**How it works:**
1. Admin visits sensitive page
2. System checks: "Did you verify 2FA in the last 15 minutes?"
3. If no, redirect to `/admin/verify-2fa`
4. Admin enters 2FA code
5. System grants "step-up" access for 15 minutes

---

## 7. How Data Flows Through the System

### 7.1 The Request Journey

```
┌─────────────┐
│   Browser   │ ← User clicks button
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Next.js     │ ← Server receives request
│ Middleware  │ ← Checks auth, CSRF, rate limits
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Route   │ ← Business logic runs
│ Handler     │ ← Validates input, processes request
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Prisma     │ ← Talks to database
│   ORM       │ ← Translates code to SQL
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │ ← Stores/retrieves data
│  Database   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Response   │ ← Data sent back to browser
│   JSON      │
└─────────────┘
```

[ELI5: It's like passing a note in class. You write something (browser), give it to the first friend (middleware) who checks if it's okay, pass it to the teacher (API route) who reads it and decides what to do, the teacher looks in the filing cabinet (database) for the answer, and writes a response note that gets passed back to you.]

---

### 7.2 Database Relationships

**How data connects together:**

```
User (You)
 ├── Cart (Your shopping basket)
 │    └── CartItems (Things in basket)
 │         └── Product (What the thing is)
 │
 ├── Orders (Your receipts)
 │    └── OrderItems (Things you bought)
 │         ├── Product (What you bought)
 │         └── License (Your permission slip)
 │
 ├── Licenses (All your permission slips)
 │    └── Downloads (Times you downloaded)
 │
 ├── Wishlist (Things you want later)
 │
 └── StudentVerification (Student discount application)
```

[ELI5: Think of it like a family tree, but for data. YOU are at the top. Under you are your BASKET, your RECEIPTS, your PERMISSION SLIPS, and your WISH LIST. Each of those has more stuff under them. The Receipt has the things you bought, and each thing has its own permission slip.]

---

### 7.3 The Prisma ORM

**What Prisma does:**

Instead of writing complicated database commands:
```sql
SELECT * FROM users WHERE email = 'bob@email.com';
```

You write friendly code:
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'bob@email.com' }
});
```

[ELI5: Prisma is like a translator. You speak English (JavaScript), the database speaks its own language (SQL). Prisma translates between them so you don't have to learn database-speak!]

---

## 8. How Security Protects Everything

### 8.1 Authentication Security

**Passwords are NEVER stored as plain text:**

```
What you type:     "mypassword123"
What gets stored:  "$2b$10$X7z8Y9q2W1e3R4t5Y6u7I8..."
```

[ELI5: Imagine writing your password on paper, then putting it through a paper shredder that makes the same pattern every time. When you log in, we shred your password again and check if the shredded pieces match. Even if bad guys steal the shredded version, they can't un-shred it!]

**This is called "hashing" using bcrypt algorithm.**

---

### 8.2 Rate Limiting

**Stops people from trying too many times:**

| Action | Limit |
|--------|-------|
| Sign up | 5 attempts per 15 minutes |
| Download | 5 attempts per 10 minutes |
| Student verification | 5 attempts per 10 minutes |

[ELI5: It's like a bouncer at a club. If you keep trying to get in with wrong passwords, eventually the bouncer says "Okay, take a 15 minute break and come back later." This stops bad guys from trying millions of passwords.]

**Code location:** `lib/rate-limit.ts`

---

### 8.3 CSRF Protection

**What is CSRF?**

CSRF (Cross-Site Request Forgery) is when a bad website tricks your browser into doing something on another site while you're logged in.

[ELI5: Imagine you're logged into your bank. A bad website could trick your browser into saying "Send all money to Bad Guy!" without you knowing. CSRF protection makes sure requests actually came from OUR website, not a trick.]

**How we protect against it:**
1. Check the `origin` header - where did this request come from?
2. Check the `referer` header - what page sent this?
3. If they don't match our website, reject the request!

---

### 8.4 Session Security

**Sessions use secure cookies:**

| Setting | What It Does |
|---------|--------------|
| `httpOnly` | JavaScript can't read the cookie (prevents XSS attacks) |
| `secure` | Only sent over HTTPS (encrypted connection) |
| `sameSite: lax` | Won't be sent to other websites |

[ELI5: Your wristband (session cookie) has special protections. It's invisible to troublemakers (httpOnly). It only works in the secure building (secure). And it won't accidentally work at other buildings (sameSite).]

---

### 8.5 IP Hashing

**We track locations, but privately:**

```
Your real IP:    "192.168.1.100"
What we store:   "a3b7c9d2e5f1..."
```

[ELI5: We need to know if someone is logging in from many different places (suspicious!). But we don't want to know your ACTUAL address. So we scramble it. We can still tell "Hey, this scrambled address is different from yesterday!" without knowing where you actually are.]

---

### 8.6 Account Suspension System

**When accounts get frozen:**

**Manual suspension** (Admin does it):
- Admin sees suspicious activity
- Admin clicks "Suspend User"
- Admin writes reason
- User can't log in until admin unsuspends

**Automatic suspension** (System does it):
- Abuse score reaches 70+
- System freezes account
- All licenses become inactive
- Admin must investigate

[ELI5: If someone breaks the rules, they get a "time out." Sometimes a grown-up (admin) puts them in time out. Sometimes the security system automatically does it if it sees really bad behavior. Either way, they can't play until a grown-up says it's okay.]

---

## 9. How Content is Managed

### 9.1 Static Pages

**Pages that don't change much:**

| Page | Database Table |
|------|----------------|
| Terms of Service | `ContentPage` (type: TERMS) |
| Privacy Policy | `ContentPage` (type: PRIVACY_POLICY) |
| About Page | `ContentPage` (type: ABOUT) |

[ELI5: Some pages are like signs on the wall - they say the same thing every day. The "Rules" sign (Terms), the "Privacy" sign, the "About Us" sign. Admins can change what these signs say through the admin dashboard.]

---

### 9.2 Dynamic Content

**Content that changes based on data:**

| Content | Source |
|---------|--------|
| Product listings | `DigitalProduct` table |
| Portfolio projects | `Project` table |
| Service requests | `ProjectRequest` table |
| User dashboards | User's own data |

[ELI5: Some parts of the website change all the time. The product page shows different products as they're added. Your dashboard shows YOUR purchases. This content comes from the database and is different for everyone.]

---

### 9.3 JSON Content Files

**Some content stored as JSON:**

```
public/content/
├── landing.json     (Homepage content)
├── services.json    (Services page)
├── about.json       (About page sections)
└── request-form.json (Form configuration)
```

[ELI5: Some content is stored in special recipe files (JSON). The homepage knows what to show by reading its recipe file. Admins can edit these recipes to change what appears.]

---

### 9.4 Portfolio Projects

**How projects work:**

```
Project has:
├── title, slug, description
├── category (Web Dev, Mobile, UI/UX, etc.)
├── tags and tech stack
├── images and thumbnail
├── links (GitHub, Live Demo, etc.)
├── featured flag (show on homepage?)
└── published flag (visible to public?)
```

[ELI5: Portfolio projects are like trophies in a display case. Each trophy has a name, a picture, some info about what it's for, and links to learn more. Some trophies are in the main display (featured), and some are hidden in storage (unpublished).]

---

## 10. How Files & Folders are Organized

### 10.1 Main Folder Structure

```
my-portfolio/
├── app/              ← All the pages and API routes
├── components/       ← Reusable UI pieces
├── lib/              ← Business logic and helpers
├── prisma/           ← Database stuff
├── public/           ← Static files (images, etc.)
└── project-documentation/  ← Docs like this one!
```

[ELI5: The project is organized like a house. The **app** folder is all the rooms people can visit. The **components** folder has furniture that can go in any room. The **lib** folder is the toolbox with tools for building things. The **prisma** folder is the blueprint of the house. The **public** folder has decorations anyone can see.]

---

### 10.2 The App Folder

```
app/
├── layout.tsx        ← The "frame" around every page
├── page.tsx          ← The homepage
├── (auth)/           ← Login/signup pages
│   ├── login/
│   └── signup/
├── (main)/           ← Public pages
│   ├── products/
│   ├── projects/
│   ├── cart/
│   └── checkout/
├── admin/            ← Admin-only pages
│   ├── users/
│   ├── orders/
│   └── settings/
└── api/              ← Backend endpoints
    ├── auth/
    ├── cart/
    └── orders/
```

[ELI5: The **app** folder is the building directory. **(auth)** is the lobby where you sign in. **(main)** is the public area anyone can explore. **admin** is the "staff only" section. **api** is the service window where you make requests.]

---

### 10.3 The Lib Folder

```
lib/
├── auth.ts           ← Login/session helpers
├── cart.ts           ← Shopping cart functions
├── license.ts        ← License management
├── downloads.ts      ← Download handling
├── suspension.ts     ← Account suspension
├── email.ts          ← Sending emails
├── prisma.ts         ← Database connection
└── rate-limit.ts     ← Request limiting
```

[ELI5: The **lib** folder is like a toolbox. Each file is a different tool. Need to check if someone is logged in? Use the **auth** tool. Need to add something to the cart? Use the **cart** tool. Every tool does one specific job.]

---

### 10.4 The Components Folder

```
components/
├── ui/               ← Basic building blocks
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── features/         ← Specific features
│   ├── cart/
│   ├── shop/
│   └── admin/
├── layout/           ← Page structure
│   ├── Header.tsx
│   └── Footer.tsx
└── shared/           ← Used everywhere
    └── CookieNotice.tsx
```

[ELI5: The **components** folder has LEGO pieces. **ui** has basic blocks like buttons and cards. **features** has pre-built things like a shopping cart. **layout** has the big pieces like the header and footer. **shared** has pieces used on almost every page.]

---

### 10.5 The Prisma Folder

```
prisma/
├── schema.prisma     ← The database blueprint (1000+ lines!)
├── migrations/       ← History of database changes
└── seed.ts           ← Initial data to populate
```

[ELI5: The **prisma** folder is the architect's office. **schema.prisma** is the blueprint showing every table and how they connect. **migrations** is the history of every change made to the building. **seed.ts** puts in the initial furniture when the building is new.]

---

## Summary

### How Everything Connects

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                │
│  (Browse, Shop, Download, Manage Account)                    │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Public  │  │  User   │  │  Admin  │  │   API   │         │
│  │ Pages   │  │Dashboard│  │Dashboard│  │ Routes  │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                            │
│  ┌─────┐ ┌──────┐ ┌────────┐ ┌──────────┐ ┌────────┐        │
│  │Auth │ │ Cart │ │License │ │ Download │ │Security│        │
│  └─────┘ └──────┘ └────────┘ └──────────┘ └────────┘        │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│  ┌─────┐ ┌────────┐ ┌───────┐ ┌─────────┐ ┌──────────┐      │
│  │Users│ │Products│ │Orders │ │Licenses │ │ Downloads│      │
│  └─────┘ └────────┘ └───────┘ └─────────┘ └──────────┘      │
└──────────────────────────────────────────────────────────────┘
```

[ELI5: The whole website is like a tall building. At the top are the USERS looking in windows (pages). In the middle is the BRAIN (business logic) that decides what to do. At the bottom is the MEMORY (database) that remembers everything. When you do something, it goes down through the building, gets processed, and comes back up with an answer!]

---

*Generated: 2026-01-18*
