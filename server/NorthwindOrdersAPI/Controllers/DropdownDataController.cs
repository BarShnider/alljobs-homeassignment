using Microsoft.AspNetCore.Mvc;
using NorthwindOrdersAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindOrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropdownDataController : ControllerBase
    {

        private readonly ILogger<DropdownDataController> _logger;

        public DropdownDataController(ILogger<DropdownDataController> logger)
        {
            _logger = logger;
        }



        [HttpGet("GetDropdownData")]
        public IActionResult GetDropdownData()
        {
            try
            {
                _logger.LogInformation("Fetching dropdown data for customers, employees, shippers, and products.");
                var dropdownData = DropdownData.GetDropdownData();
                _logger.LogInformation("Successfully fetched dropdown data.");
                return Ok(dropdownData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching dropdown data.");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }



    }
}
