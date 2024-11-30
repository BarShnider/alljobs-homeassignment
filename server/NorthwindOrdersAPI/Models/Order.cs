namespace NorthwindOrdersAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ContactName { get; set; }
        public int ShipperId { get; set; }
        public string? ShipperName { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? RequiredDate { get; set; }

        public decimal OrderTotalPrice { get; set; }
        public List<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();



        public static List<Order> GetOrdersListWithTotalPrice()
        {
            DBservices dbs = new DBservices();
            return dbs.GetOrdersListWithTotalPrice();
        }

        public static Order GetOrderDetailsWithTotalPrice(int orderID)
        {
            DBservices dbs = new DBservices();
            return dbs.GetOrderDetailsWithTotalPrice(orderID);
        }

        public static void InsertOrderWithDetails(Order order)
        {
            DBservices dbs = new DBservices();
            dbs.InsertOrderWithDetails(order);
        }

        public static void DeleteOrderByID(int orderId)
        {
            DBservices dbs = new DBservices();
            dbs.DeleteOrderByID(orderId);
        }

        public static void EditOrder(Order order)
        {
            DBservices dbs = new DBservices();
            dbs.EditOrder(order);
        }
    }
}

