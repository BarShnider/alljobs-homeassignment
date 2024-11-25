using Microsoft.AspNetCore.Mvc;
using NorthwindOrdersAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindOrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        // GET: api/<OrdersController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("GetOrdersListWithTotalPrice")]
        public List<Order> GetOrdersListWithTotalPrice()
        {
            return Order.GetOrdersListWithTotalPrice();
        }

        // GET api/<OrdersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<OrdersController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        [HttpPost]
        [Route("InsertOrderWithDetails")]
        public IActionResult InsertOrderWithDetails([FromBody] Order order)
        {
            try
            {
                Order.InsertOrderWithDetails(order);
                return Ok("Order and its details inserted successfully!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT api/<OrdersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpPut("EditOrder")]
        public IActionResult EditOrder([FromBody] Order order)
        {
            try
            {
                order.EditOrder();
                return Ok($"Order with ID {order.OrderId} was successfully updated.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // DELETE api/<OrdersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpDelete]
        [Route("DeleteOrderById/{orderId}")]
        public IActionResult DeleteOrderByID(int orderId)
        {
            try
            {
                Order.DeleteOrderByID(orderId);
                return Ok("Order and its details removed successfully!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
