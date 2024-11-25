namespace NorthwindOrdersAPI.Models
{
    public class OrderDetail
    {
        public int OrderDetailID { get; set; }
        public int ProductID { get; set; }

        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => UnitPrice * Quantity;

        public static List<OrderDetail> GetOrderDetailsByOrderId(int orderId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetOrderDetailsByOrderId(orderId);
        }

        public void EditOrderDetail()
        {
            DBservices dbs = new DBservices();
            dbs.EditOrderDetail(this);
        }


        public static void DeleteOrderDetail(int orderDetailId)
        {
            DBservices dbs = new DBservices();
            dbs.DeleteOrderDetail(orderDetailId);
        }

    }
}
