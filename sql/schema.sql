-- Source: SQL Server — customer orders schema
CREATE TABLE dbo.Customers (
  CustomerId INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  FullName NVARCHAR(120) NOT NULL,
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Orders (
  OrderId INT IDENTITY(1,1) PRIMARY KEY,
  CustomerId INT NOT NULL REFERENCES dbo.Customers(CustomerId),
  Total DECIMAL(10,2) NOT NULL,
  Status NVARCHAR(20) NOT NULL DEFAULT N'placed' CHECK (Status IN (N'placed', N'shipped', N'delivered')),
  PlacedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Report: lifetime value per customer
CREATE VIEW dbo.CustomerLifetimeValue AS
SELECT c.CustomerId, c.Email, ISNULL(SUM(o.Total), 0) AS LifetimeValue, COUNT(o.OrderId) AS OrderCount
FROM dbo.Customers c LEFT JOIN dbo.Orders o ON o.CustomerId = c.CustomerId
GROUP BY c.CustomerId, c.Email;
GO
