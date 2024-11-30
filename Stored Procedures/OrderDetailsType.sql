USE [Northwind]
GO

/****** Object:  UserDefinedTableType [dbo].[OrderDetailsType]    Script Date: 30/11/2024 17:44:16 ******/
CREATE TYPE [dbo].[OrderDetailsType] AS TABLE(
	[ProductID] [int] NULL,
	[Quantity] [int] NULL
)
GO

