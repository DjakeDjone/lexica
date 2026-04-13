---
title: How a Local Web Agency in Austria Built a Lead-Gen Machine for €79/Month
description: Most web agencies sell you a website. UP2 Web Solutions sells you results. I came across UP2 Web Solutions while looking at priceworthy companies in Austria.
---

# How a Local Web Agency in Austria Built a Lead-Gen Machine for €79/Month

Most web agencies sell you a website. UP2 Web Solutions sells you results.

I came across UP2 Web Solutions while looking at indie web projects in the Austrian market. What caught my attention wasn't the design - it was the tooling underneath.

## What They Built

UP2 is a two-person web agency based in St. Pölten, Lower Austria, targeting small and medium businesses - tradespeople, gastronomy, service providers.

Their offer is simple: a professional website starting at €79/month, no upfront costs, live in two weeks.

But the interesting part is what's running behind the scenes.

## The Stack

The site runs on Next.js 15 with the App Router, hosted on Vercel. Supabase handles the database and auth. Resend handles transactional email. QStash handles delayed job scheduling - when a lead submits a form, a personalised offer email goes out automatically one hour later.

Clean, serverless, zero ops.

## The ROI Calculator

The most interesting piece is their ROI calculator. You pick your industry, set your average order value with a slider, and the tool calculates estimated new leads, additional revenue, and break-even point.

The result is gated behind an email - you get a personalised link sent to your inbox with your numbers and a package recommendation. The result page is server-rendered with a blur overlay, unlocked only via the `?unlocked=true` parameter in the email link.

It's a genuinely clever lead-gen mechanic. The blur is CSS-only so crawlers see the content, which helps with indexing. The email capture happens before the result is revealed. And the personalised URL can be shared - meaning a business owner might forward it to a partner, generating a second warm lead.

## The Quote Flow

The contact form collects name, email, phone, and company size. On submit, two things happen in parallel: an immediate Slack-style notification email goes to the founders, and a QStash job is queued with a one-hour delay to send the personalised offer PDF to the lead.

The delay is intentional - it feels less automated, more considered.

## What's Worth Noting for Indie Builders

A few patterns here worth stealing:

- Delayed sends feel human. A quote arriving 47 minutes after form submission feels like a person prepared it, not a script.
- Personalised URLs as a distribution mechanic. Every lead gets a unique `/k/[slug]` page with their company name, recommended package, and pricing. It's shareable and feels custom even if it's templated.
- Email gate before result, not after. Most ROI calculators show the number immediately, then ask for email. UP2 flips it - you see a blur, enter your email, and the full result arrives in your inbox. Conversion rate goes up because the curiosity is already there.

## The SEO Angle

They've built a dedicated landing page at `/webdesign-st-poelten` with LocalBusiness schema, FAQ schema, and BreadcrumbList structured data - all targeting the specific regional search intent. It's a textbook local SEO play that most small agencies skip because it feels like extra work.

The homepage H1 is `Webdesign für Handwerker in St. Pölten` with supporting H2s around the value proposition. Canonical tags are set, sitemap is auto-generated from Supabase, and the `robots.ts` is configured correctly.

## Worth Watching

UP2 is early - they launched recently and are still building their client base. But the technical foundation is more thoughtful than most agencies three times their size.

If you're in Lower Austria and need a website, it's worth a look. If you're a builder, the ROI calculator mechanic alone is worth studying.

up2-web.com
