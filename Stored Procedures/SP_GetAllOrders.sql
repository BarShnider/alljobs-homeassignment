USE [Northwind]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllOrders]    Script Date: 30/11/2024 17:40:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Bar Shnider>
-- Create date: <24/11/2024>
-- Description:	<Get all the orders from the table>
-- =============================================
ALTER PROCEDURE [dbo].[SP_GetAllOrders]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

	SELECT * from orders
END
