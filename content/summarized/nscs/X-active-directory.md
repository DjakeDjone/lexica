# Windows Active Directory

## Overview

### The Problem

Let's imagine the situation of an office with 100 PCs without AD.
If one user forgets his pwd, the admin would have to change it on every pc.

With an AD, the user account is managed of the **Domain Controller** which can be a central Server with a DB of all Informations like users, pwds, etc.)
To guarantee failure security, this DCs are often redundant.

If the Network scales larger, the AD can be grouped in **Domains** to improve performance, reduce traffic and simplify management.
