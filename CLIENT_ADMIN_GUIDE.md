# WORKS — Admin Guide

A plain-English guide for running your website day to day. No technical
knowledge required.

---

## 1. What this website does

Customers browse your parts catalogue, view details on each part, and
either send you an inquiry through the website or contact you on WhatsApp.
There is no online payment, no customer accounts, and no shopping cart by
design — customers reach out, and you handle the sale directly.

---

## 2. How to access the admin panel

Go to: `https://your-website-address.com/admin/login`

(Replace with your actual website address once it's live.)

The admin panel is not linked anywhere on the public site — you always go
there directly by typing this address.

---

## 3. Logging in

Enter the email and password given to you by your developer/deployment
engineer. If you ever forget your password, they can reset it for you
without affecting any of your products (see §10 — this does **not**
require re-entering all your parts).

*Your actual login password is not written anywhere in this guide, for
your security.*

---

## 4. The Dashboard

When you log in, you land on the Dashboard. It shows:
- **Total Parts** — how many parts are in your catalogue right now
- **Featured Parts** — how many are marked to show on the homepage
- **In Stock** — how many are currently marked available
- **Categories** — how many categories you have

This is just a quick overview — it doesn't require any action from you.

---

## 5. Managing Parts

Click **Parts** in the top menu.

### Add a new part
1. Click **+ Add New Part**.
2. Fill in the part name, price, and category.
3. Choose the condition (Used / Refurbished / New) and availability
   (In Stock / Reserved / Sold).
4. Optionally fill in vehicle make, model, and compatible years.
5. Write a short summary (shows on the part's card) and a full description.
6. Drag and drop photos into the upload box, or click it to choose files
   from your computer. The first photo becomes the main photo automatically
   — you can change which one is "main" by hovering over a photo and
   clicking **Set as main**.
7. Click **Save Part**. It appears on the live website immediately.

### Edit a part
Click **Edit** next to any part in the list, change whatever you need, and
click **Save Part**.

### Change or add photos
Open the part for editing. In the Photos section, drag new photos in, or
hover over an existing photo to delete it or reorder it with the arrows.

### Hide a part without deleting it
In the Parts list, click the **Visible / Hidden** button next to a part.
Hidden parts stay in your admin panel but disappear from the public site —
useful if something is temporarily unavailable but you don't want to
re-enter it later.

### Delete a part
Click **Delete** next to the part, then **Confirm**. This is permanent.

---

## 6. Managing Categories

Click **Categories** in the top menu.

### Add a category
Type a name (e.g. "Engine Parts") in the box at the top and click
**+ Add Category**.

### Rename a category
Click **Edit** next to it, change the name, and click **Save**.

### Delete a category
Click **Delete**, then **Confirm**. If any parts are currently using that
category, you'll see how many before you confirm — deleting a category
does not delete or change those parts, it just removes the category
itself from the list.

You can also add a brand-new category on the fly while adding or editing a
part — type a new name in the category box on that form and click **Add**.
Either way, new categories appear immediately everywhere on the site.

---

## 7. Managing Reviews

Click **Reviews** in the top menu.

When a customer leaves a review through the Contact page, it appears here
as **pending** — it is **not** shown on the website yet.

- Click **Approve** to make it visible on the homepage.
- Click **Hide** to keep it saved but off the public site.
- Click **Delete** to remove it permanently.

Only approved reviews ever appear to visitors.

---

## 8. Managing Inquiries

When a customer clicks **Contact About This Part** on a product page, they
fill out a short form (their name, email, phone, and message). This is
**emailed directly to your business inbox** — it does not appear anywhere
in the admin panel. Just check your email as usual; replying to that email
will reply straight to the customer.

---

## 9. Content Checklist — What You Need to Provide

- [ ] Real names, prices, descriptions, and categories for every part
- [ ] Real photos for every part (the ones on the site now are placeholders)
- [ ] Your business phone number, email, and address (confirm these are
      correct on the Contact page)
- [ ] Your logo, if you'd like it swapped in (talk to your developer)

---

## 10. Common Problems

**"I forgot my password."**
Contact your developer/deployment engineer — they can reset it safely
without touching any of your parts or content.

**"I uploaded a photo but it's not showing."**
Make sure you clicked **Save Part** after uploading — photos aren't saved
until the whole form is submitted.

**"A customer says they can't send an inquiry."**
This usually means the business email system needs to be set up on the
hosting side. Contact your deployment engineer.

**"I can't log in."**
Double-check you're using the exact admin URL (`/admin/login`) and the
correct email/password. If it still fails, contact your developer.

---

## 11. Who Handles What

| Task | Who |
|---|---|
| Adding/editing/removing parts, categories, reviews | **You** (via the admin panel) |


You never need to touch any code to run the day-to-day website.
