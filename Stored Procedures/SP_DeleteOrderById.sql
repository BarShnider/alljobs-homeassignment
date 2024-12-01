USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteOrderById]    Script Date: 30/11/2024 17:39:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_DeleteOrderById]
    @OrderID INT
AS
BEGIN
    BEGIN TRY
        -- Start a transaction to ensure both deletions occur
        BEGIN TRANSACTION;

        -- Delete associated OrderDetails
        DELETE FROM OrderDetails
        WHERE OrderID = @OrderID;

        -- Delete the order
        DELETE FROM Orders
        WHERE OrderID = @OrderID;

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of an error
        ROLLBACK TRANSACTION;

        -- Raise the error to the client
        THROW;
    END CATCH
END;
