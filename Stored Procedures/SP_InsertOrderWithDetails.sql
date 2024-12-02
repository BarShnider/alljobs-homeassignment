USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_InsertOrderWithDetails]    Script Date: 30/11/2024 17:42:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_InsertOrderWithDetails]
    @CustomerID INT,
    @EmployeeID INT,
    @ShipperID INT,
    @OrderDate DATE,
    @RequiredDate DATE = NULL,
    @OrderDetails OrderDetailsType READONLY  -- Pass the order details as a table-valued parameter
AS
BEGIN
    BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;

        -- Insert into Orders table
        INSERT INTO Orders (CustomerID, EmployeeID, ShipperID, OrderDate, RequiredDate)
        VALUES (@CustomerID, @EmployeeID, @ShipperID, @OrderDate, @RequiredDate);

        -- Get the newly generated OrderID
        DECLARE @NewOrderID INT;
        SET @NewOrderID = SCOPE_IDENTITY();

        -- Insert into OrderDetails table using the OrderDetailsType parameter
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
        SELECT @NewOrderID, ProductID, Quantity
        FROM @OrderDetails;

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;
        -- Raise the error to the client
        THROW;
    END CATCH
END;
