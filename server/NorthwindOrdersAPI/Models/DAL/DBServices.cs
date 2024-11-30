using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using NorthwindOrdersAPI.Models;
using System.Globalization;


public class DBservices
{

    public DBservices()
    {

    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        if (paramDic != null)
            foreach (KeyValuePair<string, object> param in paramDic)
            {
                cmd.Parameters.AddWithValue(param.Key, param.Value);

            }


        return cmd;
    }

    //---------------------------------------------------------------------------------
    // Get a list of all the ordes, with the total price of each order
    //---------------------------------------------------------------------------------
    public List<Order> GetOrdersListWithTotalPrice()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
            
        cmd = CreateCommandWithStoredProcedure("SP_GetOrdersListWithTotalPrice", con, null);             // create the command


        List<Order> ordersList = new List<Order>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Order o = new Order();
                o.OrderId = Convert.ToInt32(dataReader["OrderId"]);
                o.EmployeeName = dataReader["EmployeeName"].ToString();
                o.CustomerName = dataReader["CustomerName"].ToString();
                o.ContactName = dataReader["ContactName"].ToString();
                o.ShipperName = dataReader["ShipperName"].ToString();
                o.ShipperId = Convert.ToInt32(dataReader["ShipperId"]);
                o.CustomerId = Convert.ToInt32(dataReader["CustomerId"]);
                o.EmployeeId = Convert.ToInt32(dataReader["EmployeeId"]);
                o.OrderDate = Convert.ToDateTime(dataReader["OrderDate"]);
                o.OrderTotalPrice = Convert.ToDecimal(dataReader["OrderTotalPrice"]);








                ordersList.Add(o);
            }
            return ordersList;
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //---------------------------------------------------------------------------------
    // gets the information of an order, including the order details by id
    //---------------------------------------------------------------------------------
    public List<OrderDetail> GetOrderDetailsByOrderId(int orderId)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // Create the connection
        }
        catch (Exception ex)
        {
             
            throw ex;
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@OrderID", orderId);


        cmd = CreateCommandWithStoredProcedure("SP_GetOrderDetailsByOrderID", con, paramDic); // Create the command

        List<OrderDetail> orderDetailsList = new List<OrderDetail>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                // Map database fields to the OrderDetail object
                OrderDetail orderDetail = new OrderDetail
                {
                    OrderDetailID = Convert.ToInt32(dataReader["OrderDetailID"]),
                    ProductName = dataReader["ProductName"].ToString(),
                    Quantity = Convert.ToInt32(dataReader["Quantity"]),
                    UnitPrice = Convert.ToDecimal(dataReader["UnitPrice"])
                };

                orderDetailsList.Add(orderDetail);
            }

            return orderDetailsList;
        }
        catch (Exception ex)
        {
             
            throw ex;
        }
        finally
        {
            if (con != null)
            {
                // Close the DB connection
                con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Inserst and order with its products (Order Details).
    //---------------------------------------------------------------------------------
    public void InsertOrderWithDetails(Order order)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB");
        }
        catch (Exception ex)
        {
            throw ex;
        }

        try
        {
            // Prepare a DataTable to pass the order details as a table-valued parameter
            DataTable orderDetailsTable = new DataTable();
            orderDetailsTable.Columns.Add("ProductID", typeof(int));
            orderDetailsTable.Columns.Add("Quantity", typeof(int));

            foreach (var detail in order.OrderDetails)
            {
                orderDetailsTable.Rows.Add(detail.ProductID, detail.Quantity);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
            {
                { "@CustomerID", order.CustomerId },
                { "@EmployeeID", order.EmployeeId },
                { "@ShipperID", order.ShipperId },
                { "@OrderDate", order.OrderDate },
                { "@RequiredDate", order.RequiredDate ?? (object)DBNull.Value },
                { "@OrderDetails", orderDetailsTable }
            };

            cmd = CreateCommandWithStoredProcedure("SP_InsertOrderWithDetails", con, paramDic);
            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Deletes an order by id, deletes also the order details on the order details table.
    //---------------------------------------------------------------------------------
    public int DeleteOrderByID(int OrderID)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@OrderID", OrderID);

        cmd = CreateCommandWithStoredProcedure("SP_DeleteOrderById", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }



    //---------------------------------------------------------------------------------
    // Gets the data for the dropdowns in the form for updating/creating order.
    //---------------------------------------------------------------------------------
    public DropdownData GetDropdownData()
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // Create the connection
        }
        catch (Exception ex)
        {
            throw ex;
        }

        DropdownData dropdownData = new DropdownData
        {
            Customers = new List<Customer>(),
            Employees = new List<Employee>(),
            Shippers = new List<Shipper>(),
            Products = new List<Product>()
        };

        try
        {
            cmd = CreateCommandWithStoredProcedure("SP_GetDropdownData", con, null); // Create the command

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            // Read Customers
            while (dataReader.Read())
            {
                dropdownData.Customers.Add(new Customer
                {
                    CustomerID = Convert.ToInt32(dataReader["CustomerID"]),
                    CustomerName = dataReader["CustomerName"].ToString()
                });
            }

            // Move to next result set
            if (dataReader.NextResult())
            {
                // Read Employees
                while (dataReader.Read())
                {
                    dropdownData.Employees.Add(new Employee
                    {
                        EmployeeID = Convert.ToInt32(dataReader["EmployeeID"]),
                        FirstName = dataReader["FirstName"].ToString(),
                        LastName = dataReader["LastName"].ToString()

                    });
                }
            }

            // Move to next result set
            if (dataReader.NextResult())
            {
                // Read Shippers
                while (dataReader.Read())
                {
                    dropdownData.Shippers.Add(new Shipper
                    {
                        ShipperID = Convert.ToInt32(dataReader["ShipperID"]),
                        ShipperName = dataReader["ShipperName"].ToString()
                    });
                }
            }

            // Move to next result set
            if (dataReader.NextResult())
            {
                // Read Products
                while (dataReader.Read())
                {
                    dropdownData.Products.Add(new Product
                    {
                        ProductID = Convert.ToInt32(dataReader["ProductID"]),
                        ProductName = dataReader["ProductName"].ToString(),
                        Price = Convert.ToDecimal(dataReader["Price"])
                    });
                }
            }

            return dropdownData;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Get order info (information and products list) with the total price of the order.
    //---------------------------------------------------------------------------------
    public Order GetOrderDetailsWithTotalPrice(int orderID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // Create the connection
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@OrderID", orderID);
        cmd = CreateCommandWithStoredProcedure("SP_GetOrderDetailsWithTotalPrice", con, paramDic); // Create the command

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            Order o = null;

            // Read the first result set (order information)
            if (dataReader.Read())
            {
                o = new Order
                {
                    OrderId = Convert.ToInt32(dataReader["OrderId"]),
                    EmployeeId = Convert.ToInt32(dataReader["EmployeeId"]),
                    EmployeeName = dataReader["EmployeeName"].ToString(),
                    CustomerId = Convert.ToInt32(dataReader["CustomerId"]),
                    CustomerName = dataReader["CustomerName"].ToString(),
                    ContactName = dataReader["ContactName"].ToString(),
                    ShipperId = Convert.ToInt32(dataReader["ShipperId"]),
                    ShipperName = dataReader["ShipperName"].ToString(),
                    OrderDate = Convert.ToDateTime(dataReader["OrderDate"]),
                    RequiredDate = dataReader["RequiredDate"] == DBNull.Value
                        ? (DateTime?)null
                        : Convert.ToDateTime(dataReader["RequiredDate"]),
                    OrderDetails = new List<OrderDetail>()
                };
            }

            // Move to the second result set (order details)
            if (dataReader.NextResult())
            {
                while (dataReader.Read())
                {
                    // Populate order details (products list)
                    var detail = new OrderDetail
                    {
                        OrderDetailID = Convert.ToInt32(dataReader["OrderDetailID"]),
                        ProductID = Convert.ToInt32(dataReader["ProductID"]),
                        ProductName = dataReader["ProductName"].ToString(),
                        Quantity = Convert.ToInt32(dataReader["Quantity"]),
                        UnitPrice = Convert.ToDecimal(dataReader["UnitPrice"]),
                    };
                    o.OrderDetails.Add(detail);
                }
            }

            return o;
        }
        catch (Exception ex)
        {
             
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // Close the DB connection
                con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Edit an order (information and products list)
    //---------------------------------------------------------------------------------
    public void EditOrder(Order order)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB");
        }
        catch (Exception ex)
        {
            throw ex;
        }

        try
        {
            // Prepare a DataTable for order details
            DataTable orderDetailsTable = new DataTable();
            orderDetailsTable.Columns.Add("ProductID", typeof(int));
            orderDetailsTable.Columns.Add("Quantity", typeof(int));

            foreach (var detail in order.OrderDetails)
            {
                orderDetailsTable.Rows.Add(detail.ProductID, detail.Quantity);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
        {
            { "@OrderID", order.OrderId },
            { "@CustomerID", order.CustomerId },
            { "@EmployeeID", order.EmployeeId },
            { "@ShipperID", order.ShipperId },
            { "@OrderDate", order.OrderDate },
            { "@RequiredDate",  order.RequiredDate ?? (object)DBNull.Value },
            { "@OrderDetails", orderDetailsTable }
        };

            cmd = CreateCommandWithStoredProcedure("SP_EditOrderWithDetails", con, paramDic);
            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }



}