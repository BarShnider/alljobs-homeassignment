USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetOrdersListWithTotalPrice]    Script Date: 30/11/2024 17:42:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Bar Shnider>
-- Create date: <24/11/2024>
-- Description:	<Gets The orders list with employee name, costumer name, shipper name, order data and the toal price for the order>
-- =============================================
ALTER PROCEDURE [dbo].[SP_GetOrdersListWithTotalPrice]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

SELECT 
	o.OrderId,
	e.EmployeeID,
    e.FirstName + ' ' + e.LastName AS EmployeeName,  -- Employee full name
    c.CustomerID,
	c.CustomerName AS CustomerName,                 -- Customer name
    c.ContactName,
	s.ShipperID,
	s.ShipperName,                                  -- Ship name
    o.OrderDate,                                    -- Order date
    SUM(od.Quantity * p.Price) AS OrderTotalPrice   -- Order total price
FROM Orders o
INNER JOIN Employees e ON o.EmployeeID = e.EmployeeID         -- Join with Employees table
INNER JOIN Customers c ON o.CustomerID = c.CustomerID         -- Join with Customers table
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID          -- Join with OrderDetails table
INNER JOIN Products p ON od.ProductID = p.ProductID           -- Join with Products table
INNER JOIN Shippers s ON s.ShipperID = o.ShipperID            -- Join with Shippers table
GROUP BY 
	o.OrderID,
	e.EmployeeID,
    e.FirstName, 
    e.LastName,
	c.CustomerID,
    c.CustomerName, 
	c.ContactName,
	s.ShipperID,
    s.ShipperName, 
    o.OrderDate
ORDER BY o.OrderDate;

END

