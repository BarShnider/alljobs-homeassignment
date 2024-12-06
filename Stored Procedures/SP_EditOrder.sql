USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_EditOrder]    Script Date: 30/11/2024 17:40:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_EditOrder]
    @OrderID INT,
    @CustomerID INT,
    @EmployeeID INT,
    @ShipperID INT,
    @OrderDate DATE,
    @RequiredDate DATE
AS
BEGIN
    BEGIN TRY
        -- Update the Orders table
        UPDATE Orders
        SET 
            CustomerID = @CustomerID,
            EmployeeID = @EmployeeID,
            ShipperID = @ShipperID,
            OrderDate = @OrderDate,
            RequiredDate = @RequiredDate
        WHERE 
            OrderID = @OrderID;
    END TRY
    BEGIN CATCH
        -- Raise the error to the client
        THROW;
    END CATCH
END;
