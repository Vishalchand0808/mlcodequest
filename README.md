# MLCodeQuest - A Platform for AI & Data Science Coding Challenges

MLCodeQuest is a feature-rich, full-stack web application designed for the modern data professional. Moving beyond traditional DSA-focused platforms, MLCodeQuest provides a dedicated space for users to practice and solve coding challenges in Machine Learning, Deep Learning, Data Science, and AI. It allows users to sign up, tackle complex problems in multiple languages, and receive instant feedback on their solutions. The project includes a complete admin panel for seamless content management.

**Live Demo:** [**mlcodequest.vercel.app**](https://mlcodequest.vercel.app/)

---

## Key Features

* **Specialized Problem Set:** A curated collection of problems focused on AI, ML, and Data Science, moving beyond typical algorithm challenges.
* **User Authentication:** Secure user sign-up and login functionality using Firebase Authentication.
* **Problem Solving Interface:** A clean and intuitive UI for browsing problems and viewing detailed descriptions rendered from Markdown.
* **Multi-Language Code Editor:** An in-browser code editor supporting Python, JavaScript, and C++, powered by CodeMirror.
* **Code Execution & Judging:** A robust backend that uses the Piston API to securely compile, run, and validate user-submitted code against multiple test cases.
* **Submission History:** Users can view a history of all their past submissions for each problem, tracked in a Firestore database.
* **Role-Based Admin Panel:** A protected admin dashboard that allows authorized users to add new problems, including descriptions, difficulty, multi-language starter code, and test cases.
* **Dynamic Content Management:** Problem ordering is handled automatically on the backend, ensuring a scalable and maintainable problem set.

---

## Tech Stack

This project was built with a modern, full-stack architecture, leveraging powerful and scalable technologies.

#### **Frontend**

* **Framework:** React (with Vite)
* **Language:** JavaScript (ES6+)
* **Styling:** Tailwind CSS (with the Typography plugin)
* **Code Editor:** CodeMirror
* **Markdown:** `react-markdown`

#### **Backend**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Code Execution:** Piston API

#### **Database & Services**

* **Authentication:** Firebase Authentication
* **Database:** Cloud Firestore (NoSQL)
* **Deployment:**
    * **Frontend:** Vercel
    * **Backend:** Render

---

## Screenshots

*(Here you can add screenshots of your application. Good examples would be:)*
* *The main problem list page.*
* *The problem detail page, showing the Markdown rendering and the code editor.*
* *The admin panel form for adding a new problem.*

`![Problem List]([<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/9623a6a5-6df2-4a8f-9a8b-82dd71172a91" />
])`
`![Problem Detail]([<img width="1894" height="807" alt="image" src="https://github.com/user-attachments/assets/ae25ff29-1419-43f5-acda-55e681d80568" />
])`
`![Admin Panel]([<img width="1234" height="741" alt="image" src="https://github.com/user-attachments/assets/c07e8849-7476-46cb-a71c-b92972c9b475" />
])`

---

## Local Development Setup

To run this project on your local machine, follow these steps:

#### **Prerequisites**

* Node.js (v18 or later)
* Git
* A Firebase project with Authentication and Firestore enabled.

#### **1. Clone the Repository**

```bash
git clone [https://github.com/](https://github.com/)[YOUR_GITHUB_USERNAME]/mlcodequest.git
cd mlcodequest
````

#### **2. Backend Setup**

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file (not needed for the public Piston API)

# Create a serviceAccountKey.json file from your Firebase project settings.

# Start the backend server
node server.js
# The server will be running on http://localhost:5000
```

#### **3. Frontend Setup**

```bash
# Navigate to the frontend folder from the root directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file and add your Firebase and backend configuration:
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
VITE_BACKEND_URL=http://localhost:5000

# Start the frontend development server
npm run dev
# The application will be running on http://localhost:5173
```
