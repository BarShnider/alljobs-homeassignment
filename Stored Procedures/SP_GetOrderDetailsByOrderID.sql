USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetOrderDetailsByOrderID]    Script Date: 30/11/2024 17:41:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_GetOrderDetailsByOrderID]
    @OrderID INT
AS
BEGIN
    -- Retrieve product details for the specified OrderID
    SELECT 
		od.OrderDetailID,
        p.ProductName,
        od.Quantity,
        p.Price AS UnitPrice
    FROM 
        OrderDetails od
    INNER JOIN 
        Products p ON od.ProductID = p.ProductID
    WHERE 
        od.OrderID = @OrderID;
END;

