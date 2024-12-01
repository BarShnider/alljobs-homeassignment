USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_EditOrderWithDetails]    Script Date: 30/11/2024 17:40:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_EditOrderWithDetails]
    @OrderID INT,
    @CustomerID INT,
    @EmployeeID INT,
    @ShipperID INT,
    @OrderDate DATE,
    @RequiredDate DATE = NULL,
    @OrderDetails OrderDetailsType READONLY  -- Table-valued parameter
AS
BEGIN
    BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;

        -- Update the main order
        UPDATE Orders
        SET CustomerID = @CustomerID,
            EmployeeID = @EmployeeID,
            ShipperID = @ShipperID,
            OrderDate = @OrderDate,
            RequiredDate = @RequiredDate
        WHERE OrderID = @OrderID;

        -- Delete existing details for the order
        DELETE FROM OrderDetails WHERE OrderID = @OrderID;

        -- Insert updated details
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
        SELECT @OrderID, ProductID, Quantity
        FROM @OrderDetails;

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback transaction on error
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
