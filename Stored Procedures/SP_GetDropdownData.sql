USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetDropdownData]    Script Date: 30/11/2024 17:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_GetDropdownData]
AS
BEGIN
    -- Retrieve Customer data
    SELECT CustomerID, CustomerName
    FROM Customers
    ORDER BY CustomerName;

    -- Retrieve Employee data
    SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) AS EmployeeName, FirstName, LastName
    FROM Employees
    ORDER BY EmployeeName;

    -- Retrieve Shipper data
    SELECT ShipperID, ShipperName
    FROM Shippers
    ORDER BY ShipperName;

    -- Retrieve Product data
    SELECT ProductID, ProductName, Price
    FROM Products
    ORDER BY ProductName;
END;
