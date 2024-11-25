namespace NorthwindOrdersAPI.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public DateTime BirthDate { get; set; }
        public string Photo { get; set; }
        public string Notes { get; set; }
    }
}
