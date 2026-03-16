# Sahayak AI — Subscription Quotation & Business Analysis (Draft for Internal Review)

**Prepared by:** Vasudev AI
**Date:** October 6, 2025
**Version:** 1.0
**Status:** Internal Draft for Discussion

---

### 1. Project Overview

**Vision:** To revolutionize the Indian education landscape by empowering every teacher and student with intelligent, accessible, and hyper-local AI tools.

**Purpose:** Sahayak AI is a multi-grade, multi-lingual AI-powered teaching assistant designed to automate administrative burdens and enhance the teaching-learning experience. By handling tasks like lesson planning, content creation, and assessment, Sahayak AI frees educators to focus on what matters most: teaching and mentorship. For students, it acts as a personalized learning companion, making education more engaging and effective.

**Impact:** The platform aims to reduce teacher burnout, improve educational outcomes, bridge the urban-rural content divide, and foster a more dynamic, personalized learning environment across India.

---

### 2. Feature Modules

Sahayak AI is built on a suite of powerful, modular AI tools:

| Module                   | Description                                                                                             | Target User(s)        |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------- |
| **Lesson Planner**       | Generates comprehensive weekly lesson plans from a topic, grade, and objectives.                        | Teacher               |
| **Quiz Generator**       | Creates customized quizzes (MCQ, Short/Long Answer) from source text or topics.                         | Teacher, Student      |
| **Rubric Generator**     | Develops detailed, objective grading rubrics for any assignment.                                        | Teacher               |
| **Paper Digitizer**      | Converts scanned or photographed question papers into editable digital text using OCR.                  | Teacher               |
| **Visual Aids**          | Generates simple drawings, charts, and diagrams (SVG) to explain concepts visually.                     | Teacher, Student      |
| **3D Visuals**           | Creates interactive 3D models (e.g., solar system, human heart) for immersive learning.                 | Teacher, Student      |
| **Hyper-Local Content**  | Produces stories, examples, and explanations in regional languages using local context.                 | Teacher, Student      |
| **Knowledge Base**       | Provides age-appropriate, simple answers with analogies for complex student questions.                  | Teacher, Student      |
| **Story Generator**      | Crafts creative stories to make learning a topic more engaging and memorable.                           | Teacher, Student      |
| **Math Helper**          | Solves mathematical problems from an uploaded image and provides step-by-step explanations.             | Teacher, Student      |
| **Debate Topic Generator**| Creates engaging debate topics with for-and-against points to foster critical thinking.                 | Teacher, Student      |
| **Parent Communication** | Drafts professional, multilingual emails to parents for various scenarios (e.g., PTM, progress reports).| Teacher               |
| **Workspace & Library**  | A central hub for users to save, organize, and manage all generated assets and digital resources.       | Teacher, Student      |
| **AI-Powered Evaluation**| Automatically grades quizzes and provides constructive feedback on answers.                             | Teacher               |

---

### 3. Subscription Plan Comparison Table

*All prices are in INR and are estimates for analysis.*

| Feature                     | Basic (Freemium)                 | Pro (For Individuals)            | Enterprise (For Institutions)     |
| --------------------------- | -------------------------------- | -------------------------------- | --------------------------------- |
| **Monthly Price**           | ₹0                               | ₹499                             | Custom (e.g., ₹25,000 / 50 users) |
| **Yearly Price**            | ₹0                               | ₹4,999 (16% Off)                 | Custom (e.g., ₹2,50,000 / 50 users) |
| ---                         | ---                              | ---                              | ---                               |
| **Content Generation**      | 10 generations / month           | Unlimited                        | Unlimited                         |
| **Premium AI Tools**        | 5 credits / month                | 100 credits / month              | Unlimited                         |
| *(3D, Digitize, Evaluate)*  |                                  |                                  |                                   |
| **Workspace Storage**       | 50 assets                        | 1,000 assets                     | Unlimited                         |
| **Parent Communication**    | 3 drafts / month                 | Unlimited                        | Unlimited                         |
| **AI-Powered Evaluation**   | 1 quiz / month                   | 20 quizzes / month               | Unlimited                         |
| **Support**                 | Community                        | Email & Chat                     | Dedicated Account Manager         |
| ---                         | ---                              | ---                              | ---                               |
| **Overage Charges (Credits)**| Not Applicable                   | ₹5 per credit                    | Not Applicable                    |
| ---                         | ---                              | ---                              | ---                               |
| **Est. Monthly Cost/User**  | ~₹15 (API + Infra)               | ~₹120 (API + Infra + Support)    | ~₹100 (Bulk API + Dedicated Support)|
| **Est. Profit Margin**      | - (Acquisition Cost)             | **~75%**                         | **~80%** (Varies with scale)      |

---

### 4. Cost & Profitability Analysis

The primary cost drivers for Sahayak AI are LLM API calls and infrastructure hosting.

**Main Cost Drivers:**
1.  **LLM API Costs:** Most feature modules trigger API calls to models like Gemini. Premium tools (e.g., image/3D generation, OCR) are more expensive, which is why they are credit-based in the Pro plan.
2.  **Infrastructure & Hosting:** Firebase (Firestore, Functions, Hosting) costs will scale with user growth and data storage.
3.  **Maintenance & Development:** Salaries for the engineering team to maintain and improve the platform.
4.  **Support & Onboarding:** Costs associated with customer support, especially for Enterprise clients who get a dedicated manager.

**Example Cost vs. Revenue Chart (Text-based for 1000 Users)**

-   **Scenario:** 700 Basic, 250 Pro, 1 Enterprise (50 users)
-   **Revenue:** (700 * ₹0) + (250 * ₹499) + (50 * ₹500) = ₹0 + ₹1,24,750 + ₹25,000 = **₹1,49,750 / month**
-   **Costs:** (700 * ₹15) + (250 * ₹120) + (50 * ₹100) = ₹10,500 + ₹30,000 + ₹5,000 = **₹45,500 / month**

```
Revenue: |++++++++++++++++++++++++++++++++++++++++++++++| (₹1,49,750)
Costs:   |+++++++++++++|                                  (₹45,500)
Profit:                |+++++++++++++++++++++++++++++++| (₹1,04,250)

Est. Gross Margin: ~70%
```
*This is a simplified model. It excludes marketing, R&D, and administrative overheads but demonstrates the core profitability of the service.*

---

### 5. Monetization & Revenue Streams

Beyond direct subscriptions, Sahayak AI has multiple potential revenue streams:

1.  **White-Label Licensing:** License the platform to large educational chains or EdTech companies to integrate into their own offerings under their branding.
2.  **Government & NGO Contracts:** Partner with state governments or NGOs (like Pratham, Akshara Foundation) to deploy Sahayak AI in public schools, funded through large-scale contracts. This aligns with national education policy goals.
3.  **Usage-Based Credits:** Pro users can purchase additional credits if they exhaust their monthly quota, creating a direct revenue link to high usage.
4.  **Analytics as a Service:** Offer anonymized, aggregated data insights to institutional clients for curriculum planning and identifying learning gaps at a macro level.
5.  **Professional Development & Training:** Charge fees for certified training workshops (online or offline) for teachers on how to effectively integrate AI into their pedagogy using Sahayak AI.

---

### 6. Future Scaling Strategy

The initial reliance on free or low-cost APIs is a standard bootstrapping method. A sustainable transition is critical.

**Phased Approach:**
1.  **Phase 1 (Current):** Utilize free tiers and cost-effective models (e.g., Gemini Flash) for the Basic plan. Monitor API usage and costs closely to establish a baseline.
2.  **Phase 2 (Growth):** As the user base for the Pro plan grows, negotiate volume discounts with API providers (e.g., Google). The revenue from Pro and Enterprise plans should comfortably cover and exceed these costs.
3.  **Phase 3 (Scale):**
    *   **Model Optimization:** Explore fine-tuning smaller, open-source models for specific, high-volume tasks (like rubric generation) to reduce reliance on expensive, general-purpose APIs.
    *   **Tiered API Usage:** Implement logic to route requests to different models based on the user's subscription tier. Enterprise users could get access to the most powerful (and expensive) models, while Basic users are served by more economical ones.
    *   **Caching:** Implement an intelligent caching layer for frequently requested, non-personalized content (e.g., a visual aid for "photosynthesis") to reduce redundant API calls.

This strategy ensures that costs are managed in line with revenue growth, preventing the API bill from outpacing income.

---

### 7. Feedback & Suggestions (Risks and Opportunities)

-   **API Cost Control (Risk):** Uncontrolled usage, especially by free-tier users, could lead to unsustainable API bills.
    -   **Mitigation:** The current plan's credit system and limits are a good first step. Implement strict monitoring and alerts for unusual spikes in usage.
-   **Data Privacy & Trust (Opportunity):** In the Indian context, data privacy is paramount. By using a secure platform like Firebase and being transparent about data usage (especially with student data), Sahayak AI can build significant trust and create a strong competitive advantage.
-   **Local Language Adoption (Opportunity):** The "Hyper-Local Content" feature is a key differentiator. Expanding the range and quality of regional languages will be crucial for capturing the market beyond Tier-1 cities.
-   **Teacher Training & Onboarding (Risk/Opportunity):** Many teachers may not be tech-savvy. A poor onboarding experience could lead to high churn.
    -   **Mitigation:** Invest in simple, video-based tutorials and a robust help section. For Enterprise clients, mandatory training sessions are key.
-   **Rural Internet Challenges (Risk):** Intermittent connectivity is a reality in many parts of India.
    -   **Mitigation:** The choice of Firestore with its offline capabilities is excellent. Further lean into PWA (Progressive Web App) features to allow users to generate content when online and access it reliably when offline.
