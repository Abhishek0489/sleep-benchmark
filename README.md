# sleep-benchmark

# AI-Powered Sleep & Health Analysis Platform

![Project Screenshot](https://via.placeholder.com/800x400.png?text=Your+App+Screenshot+Here)

A full-stack web application designed to provide users with a dual analysis of their health by combining a predictive machine learning model with a generative AI. Users can submit their health metrics to receive a prediction for potential sleep disorders and a personalized, AI-generated analysis of their overall well-being.

**Live Demo Link:** [Your Deployed App URL Here]

---

## ## Key Features

* **Dual-AI System:** Combines a **Scikit-learn** predictive model (for sleep disorder classification) with a **Google Gemini** generative model (for qualitative health analysis).
* **Secure User Authentication:** Full signup, login, and logout functionality handled by **Supabase**.
* **Dynamic Frontend:** A responsive user interface with server-side rendered pages using **EJS** for a personalized experience.
* **Dual-Backend Architecture:** A robust system featuring a **Node.js/Express** server for web logic and a separate **Python/Flask** microservice for ML inference.
* **State Management:** Securely persists user data between requests using server-side **Express sessions**.

---

## ## Architecture Diagram

This project uses a decoupled, microservice-oriented architecture to separate concerns and ensure scalability.

![Architecture Diagram](https://via.placeholder.com/800x400.png?text=Your+Architecture+Diagram+Here)

---

## ## Technology Stack

| Category                  | Technologies                                                 |
| ------------------------- | ------------------------------------------------------------ |
| **Frontend** | HTML, CSS, JavaScript, EJS (Templating), Vite, Tailwind CSS  |
| **Backend (Web Server)** | Node.js, Express.js                                          |
| **Backend (ML Service)** | Python, Flask                                                |
| **AI & Machine Learning** | Scikit-learn, Pandas, Google Gemini API                      |
| **Authentication** | Supabase                                                     |
| **Key Libraries** | Axios, Express-session, dotenv, markdown-it, joblib, cors    |

---

## ## Local Setup & Installation

To run this project locally, you will need to run the three main parts (Frontend, Node.js Server, Python Server) separately.

### ### Prerequisites
* Node.js and npm
* Python and pip
* A GitHub account and Git installed

### ### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)[Your-Username]/[your-repo-name].git
cd [your-repo-name]
