namespace NorthwindOrdersAPI.Models
{
    public class DropdownData
    {
        public List<Customer> Customers { get; set; }
        public List<Employee> Employees { get; set; }
        public List<Shipper> Shippers { get; set; }
        public List<Product> Products { get; set; }

        public static DropdownData GetDropdownData()
        {
            DBservices dbs = new DBservices();
            return dbs.GetDropdownData();
        }

    }

    
}
