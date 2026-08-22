# 💊 MedSpot — Real-Time Local Pharmacy & Medicine Availability Finder

MedSpot is a full-stack web application designed to eliminate the frustration of running from store to store during medical emergencies. It connects patients searching for specific medicines directly with local pharmacies in real time, displaying exact distances using geolocation and allowing store owners to manage live inventory on the fly.

---

## 🚀 Key Features

* **Real-Time Stock & Distance Calculation:** Patients can select any medicine and instantly see nearby local pharmacies sorted by distance, calculated dynamically via browser geolocation and MySQL spatial functions.
* **Pharmacy Owner Admin Dashboard:** Store owners can log into their portal to instantly toggle medicine inventory status (**In Stock** vs. **Out of Stock**) in real time.
* **"Others" Custom Medicine Request Workflow:** If a patient needs an unlisted medicine, they can type it manually under the "Others" option. This dispatches a live request to the Testing pharmacy.
* **Live Status Sync:** Pharmacy owners can review incoming custom requests and click **Confirm** or **Deny**. The patient dashboard updates instantly to reflect the pharmacy's response.
* **Automatic Clean Slate:** Custom request lists automatically truncate and clear themselves out whenever the development server restarts, ensuring a pristine demo environment for presentations.

---

## 🛠️ Tech Stack

* **Frontend & Backend:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Database:** MySQL (`mysql2` promise pool)
* **APIs & Geolocation:** Native browser Geolocation API & MySQL Spatial `ST_Distance_Sphere`

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/medspot.git](https://github.com/your-username/medspot.git)
cd medspot