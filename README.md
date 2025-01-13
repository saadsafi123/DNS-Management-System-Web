# DNS Management System

## Introduction
The DNS Management System is a web-based application designed to provide users with an easy interface for managing DNS records. Users can create, read, update, and delete DNS records through the platform. The application utilizes Node.js, Express.js, MongoDB, and Bootstrap for its development.

## Purpose
The primary goal of this project is to develop a fully functional DNS Management System that enables users to:
1. Add DNS records.
2. View existing DNS records.
3. Update DNS records.
4. Delete DNS records.

This system aims to simplify DNS record management while ensuring data integrity and providing an intuitive user interface.

## Features
- Add new DNS records with DNS name, IP address, and class.
- View all stored DNS records in a table format.
- Update DNS or IP address for existing records.
- Delete DNS records from the system.
- User-friendly interface with validation and error handling.

## Technologies Used
- **Backend**: 
  - Node.js (Runtime Environment)
  - Express.js (Web Framework)
  - MongoDB (Database) with Mongoose (ODM)
  
- **Frontend**: 
  - HTML5 (Structure)
  - CSS3 (Styling)
  - Bootstrap 5.3.3 and Tailwind CSS (UI Framework)
  - EJS (Embedded JavaScript Templating Engine)
  
- **Tools**: 
  - Visual Studio Code (Code Editor)
  - Git & GitHub (Version Control)
  
- **Server Deployment**: 
  - Localhost (Testing Environment)
  
---

## Installation

### Prerequisites
- Install [Node.js](https://nodejs.org/) (LTS version recommended)
- Install [MongoDB](https://www.mongodb.com/try/download/community) locally or use a cloud instance.
  
---

### Steps to Setup Locally

1. Clone the repository to your local machine.
   git clone https://github.com/your-group-repo/dns-management-system.git

2. Navigate to the project folder.
   cd dns-management-system

3. Install required dependencies using npm.
   npm install

4. Start the MongoDB service if it’s installed locally.
   mongod

5. Start the application.
   node app.js

6. Open your browser and navigate to http://localhost:3000 to start using the system.

---

## Usage
- **Adding Records**: Go to the "Add DNS" page, enter the DNS, IP address, and class, then submit the form to add a new DNS record.
- **Viewing Records**: The "View All Records" page displays all stored DNS records in a table format.
- **Updating Records**: You can update DNS or IP address of any existing record from the "View All Records" page.
- **Deleting Records**: Records can be deleted directly from the "View All Records" page by clicking the delete button next to each record.

---

### Group Members
- Member 1: Saad Safi
- Member 2: M Aitazaz Ahsan
- Member 3: Ehtisham Ahmed
- Member 4: Saqib Khushal

---

## Conclusion
The DNS Management System provides a comprehensive solution for managing DNS records via a user-friendly web interface. The system is designed to ensure data integrity while allowing users to efficiently perform CRUD operations on DNS records.
