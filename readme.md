# **💊 Cura — Real-Time Local Pharmacy & Medicine Availability Finder**

MedSpot is a full-stack web application designed to eliminate the frustration of running from store to store during medical emergencies. It connects patients searching for specific medicines directly with local pharmacies in real time, displaying exact distances using geolocation and allowing store owners to manage live inventory on the fly.

## **🚀 Key Features**

* **Real-Time Stock & Distance Calculation:** Patients can select any medicine and instantly see nearby local pharmacies sorted by distance, calculated dynamically via browser geolocation and MySQL spatial functions.  
* **Pharmacy Owner Admin Dashboard:** Store owners can log into their portal to instantly toggle medicine inventory status (**In Stock** vs. **Out of Stock**) in real time.  
* **"Others" Custom Medicine Request Workflow:** If a patient needs an unlisted medicine, they can type it manually under the "Others" option. This dispatches a live request to the Testing pharmacy.  
* **Live Status Sync:** Pharmacy owners can review incoming custom requests and click **Confirm** or **Deny**. The patient dashboard updates instantly to reflect the pharmacy's response.  
* **Automatic Clean Slate:** Custom request lists automatically truncate and clear themselves out whenever the development server restarts, ensuring a pristine demo environment for presentations.

## **🛠️ Tech Stack**

* **Frontend & Backend:** Next.js (App Router)  
* **Styling:** Tailwind CSS  
* **Database:** MySQL (mysql2 promise pool)  
* **APIs & Geolocation:** Native browser Geolocation API & MySQL Spatial ST\_Distance\_Sphere

## **📦 Core Dependencies**

While npm install handles everything automatically, here are the major packages powering MedSpot:

* [**Next.js**](https://nextjs.org/) (next)  
* [**MySQL2**](https://www.npmjs.com/package/mysql2) (mysql2)  
* [**Tailwind CSS**](https://tailwindcss.com/) (tailwindcss)

## **⚙️ Setup & Installation**

Follow these steps to run the MedSpot project locally on your machine.

### **1\. Clone the Repository**

git clone https://github.com/your-username/medspot.git  
cd medspot

### **2\. Install Dependencies**

npm install

### **3\. Setup Local MySQL Database**

To run this project, you must have a local SQL server running on your machine.

1. Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) and [MySQL Workbench](https://dev.mysql.com/downloads/workbench/).  
2. Open **MySQL Workbench**, connect to your local server, and open a new SQL Query tab.  
3. Copy the entire SQL script below, paste it into the query window, and click the **Execute** button to build the database and insert the sample data:

CREATE DATABASE IF NOT EXISTS medspot\_db;  
USE medspot\_db;

\-- Recreate tables with unique constraints to prevent duplicates  
CREATE TABLE pharmacies (  
  id INT AUTO\_INCREMENT PRIMARY KEY,  
  name VARCHAR(255) NOT NULL,  
  lat DECIMAL(10, 8\) NOT NULL,  
  lng DECIMAL(11, 8\) NOT NULL,  
  phone VARCHAR(50)  
);

CREATE TABLE medicines (  
  id INT AUTO\_INCREMENT PRIMARY KEY,  
  name VARCHAR(255) NOT NULL  
);

CREATE TABLE inventory (  
  id INT AUTO\_INCREMENT PRIMARY KEY,  
  pharmacy\_id INT,  
  medicine\_id INT,  
  status VARCHAR(50) DEFAULT 'In Stock',  
  FOREIGN KEY (pharmacy\_id) REFERENCES pharmacies(id),  
  FOREIGN KEY (medicine\_id) REFERENCES medicines(id),  
  UNIQUE KEY unique\_store\_medicine (pharmacy\_id, medicine\_id)  
);

CREATE TABLE IF NOT EXISTS medicine\_requests (  
  id INT AUTO\_INCREMENT PRIMARY KEY,  
  pharmacy\_id INT DEFAULT 4,  
  custom\_medicine\_name VARCHAR(255) NOT NULL,  
  status VARCHAR(50) DEFAULT 'Pending',  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  FOREIGN KEY (pharmacy\_id) REFERENCES pharmacies(id)  
);

\-- Insert Sample Pharmacies (Near VIT Bhopal / Regional area)  
INSERT INTO pharmacies (id, name, lat, lng, phone) VALUES   
(1, 'Shriram Medical Store', 23.0800, 76.8500, '+91 96911 71557'),  
(2, 'Laxmi Medical Store', 23.0850, 76.8550, '+91 91234 56789'),  
(3, 'Dr Morpean', 23.0700, 76.8400, '+91 99887 76655'),  
(4, 'Testing', 23.0900, 76.8600, '+91 93333 22211');

\-- Insert Sample Medicines  
INSERT INTO medicines (id, name) VALUES   
(1, 'Paracetamol 500mg'),  
(2, 'Ibuprofen 400mg'),  
(3, 'Amoxicillin 250mg'),  
(4, 'Cetirizine 10mg');

\-- Insert Initial Inventory  
INSERT INTO inventory (pharmacy\_id, medicine\_id, status) VALUES   
(1, 1, 'In Stock'), (1, 2, 'In Stock'), (1, 3, 'In Stock'), (1, 4, 'In Stock'),  
(2, 1, 'In Stock'), (2, 2, 'In Stock'), (2, 3, 'In Stock'), (2, 4, 'In Stock'),  
(3, 1, 'In Stock'), (3, 2, 'In Stock'), (3, 3, 'In Stock'), (3, 4, 'In Stock'),  
(4, 1, 'In Stock'), (4, 2, 'In Stock'), (4, 3, 'Out of Stock'), (4, 4, 'Out of Stock');

### **4\. Setup Environment Variables**

Create a file named .env in the root directory of the project and add your MySQL database credentials:

DB\_HOST=localhost  
DB\_USER=root  
DB\_PASSWORD=your\_mysql\_password\_here  
DB\_DATABASE=medspot\_db  
DB\_PORT=3306

> \[\!WARNING\]

> Never commit your real .env file with your database password to GitHub\!

### **5\. Run the Development Server**

npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application\!

## **🖥️ Usage Guide**

* **Patient View:** Navigate to /patient to select medicines, check live store distances, and submit manual requests via the "Others" option.  
* **Admin View:** Navigate to /admin to manage inventory stock toggles and review/confirm/deny incoming custom patient requests.