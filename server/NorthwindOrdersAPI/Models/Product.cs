namespace NorthwindOrdersAPI.Models
{
    public class Product
    {
        public int ProductID { get; set; } // Primary Key
        public string ProductName { get; set; }
        public int Unit { get; set; }
        public decimal Price { get; set; }
    }
}
