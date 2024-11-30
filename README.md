# Northwind Orders CRUD Application

## Project Setup Instructions

### Prerequisites
- Node.js
- Docker
- .NET Core 6 
- Attached MSSQL Docker Image

### Database Setup

1. Download the .tar file for the MSSQL Docker image from the following link: [https://drive.google.com/file/d/1gw11RKwdzwer22h-LH0IjoYJ1rvDoUbn/view?usp=sharing](https://drive.google.com/file/d/1gw11RKwdzwer22h-LH0IjoYJ1rvDoUbn/view?usp=sharing)

2. Load the MSSQL Docker image for the Northwind database:
   ```sh
   docker load -i northwind-mssql-image.tar
   ```
3. Run the Docker container:
   ```sh
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Bar12345!" -p 1433:1433 --name northwind-mssql -d northwind-mssql-image
   ```

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/BarShnider/alljobs-homeassignment
   cd alljobs-homeassignment
   ```
2. Build and run the .NET Core project:
   ```sh
   dotnet build
   dotnet run
   ```

### Frontend Setup
1. Install dependencies:
   ```sh
   cd client
   npm install or npm i
   ```
2. Start the React application:
   ```sh
   npm run dev
   ```

## Instructions to Run the Project
1. Make sure the database container is running (`docker ps` should list the `northwind-mssql` container).
2. Start the backend server using the .NET Core command mentioned above.
3. Navigate to the `client` directory and start the React application.
4. Open the browser at `http://localhost:3000/orders` to see the Orders page.

## Assumptions, Notes, and Design Decisions
- MSSQL is hosted in a Docker container, which assumes that Docker is installed and running on the local machine.
- Basic input validation was handled on both the client-side and server-side.
- Pagination was implemented on the frontend
- The log file is stored as a text file on the server. I considered providing access via the API, but if the server goes down, the log file would be inaccessible, so I decided to keep it as a text file organized by date.
- Form data persistence was implemented only for the "Create Order" form, as it felt appropriate for that context but not for the "Edit Order" form.
- There was no mention of "Required Date" in the table, so I decided to make it optional for the user. Additionally, I ensured that the required date cannot be earlier than the order date.

## Feature Completion
- **Order List Page**: ✔
- **Create New Order Page**: ✔
- **Edit Order Page**: ✔
- **View Order Details Page**: ✔
- **Delete Order Functionality**: ✔

## Bonus Features
- **Dark Mode Theme**: ✔ (100% complete)
  - Implemented using CSS variables and a theme toggle component.
- **Export to CSV**: ✔ (100% complete)
  - CSV export functionality to the orders table with all the relevant details.
- **Form Data Persistence**: ✔ (100% complete)
  - Saving the progress on the "Add New Order" with an option to clear the progress.

## AI Tools Usage: Yes 
- **AI Tools Used**:
**ChatGPT4**
  - **Code Review and Suggestions**: AI tools were leveraged to provide suggestions for optimizing code, including improving readability, applying best practices, and enhancing responsiveness in CSS. The insights gathered were used to refine the quality of the code.
   - The structure for error handling on the backend API, including logging mechanisms was influenced by suggestions provided by AI tools, which helped ensure robustness in error scenarios.
AI assistance was used as a supportive tool, and all generated code was carefully reviewed, modified, and understood to ensure that it aligns with the project requirements and follows best practices.
