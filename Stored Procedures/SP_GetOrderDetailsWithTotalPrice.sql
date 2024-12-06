USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetOrderDetailsWithTotalPrice]    Script Date: 30/11/2024 17:41:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_GetOrderDetailsWithTotalPrice]
    @OrderID INT -- Parameter to filter by a specific order
AS
BEGIN
    SET NOCOUNT ON;

    -- Retrieve the order information
    SELECT 
        O.OrderID AS OrderId,
        E.EmployeeID AS EmployeeId,
        CONCAT(E.FirstName, ' ', E.LastName) AS EmployeeName,
        C.CustomerID AS CustomerId,
        C.CustomerName AS CustomerName,
        C.ContactName AS ContactName,
        S.ShipperID AS ShipperId,
        S.ShipperName AS ShipperName,
        O.OrderDate AS OrderDate,
        O.RequiredDate AS RequiredDate
    FROM Orders O
    INNER JOIN Customers C ON O.CustomerID = C.CustomerID
    INNER JOIN Employees E ON O.EmployeeID = E.EmployeeID
    INNER JOIN Shippers S ON O.ShipperID = S.ShipperID
    WHERE O.OrderID = @OrderID;

    -- Retrieve the order details (products list)
    SELECT 
        OD.OrderDetailID AS OrderDetailID,
        OD.ProductID AS ProductID,
        P.ProductName AS ProductName,
        OD.Quantity AS Quantity,
        P.Price AS UnitPrice,
        (OD.Quantity * P.Price) AS TotalPrice
    FROM OrderDetails OD
    INNER JOIN Products P ON OD.ProductID = P.ProductID
    WHERE OD.OrderID = @OrderID;
END;
