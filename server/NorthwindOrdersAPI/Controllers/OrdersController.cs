using Microsoft.AspNetCore.Mvc;
using NorthwindOrdersAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindOrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("GetOrdersListWithTotalPrice")]
        public IActionResult GetOrdersListWithTotalPrice()
        {
            try
            {
                _logger.LogInformation("Fetching the list of orders with total prices.");
                return Ok(Order.GetOrdersListWithTotalPrice());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching orders list with total prices.");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        [HttpGet]
        [Route("GetOrderDetailsWithTotalPrice/{orderID}")]
        public IActionResult GetOrderDetailsWithTotalPrice(int orderID)
        {
            try
            {
                _logger.LogInformation("Fetching details for order with ID {OrderID}.", orderID);

                // Fetch the order details
                var orderDetails = Order.GetOrderDetailsWithTotalPrice(orderID);

                // Check if the order exists
                if (orderDetails == null)
                {
                    _logger.LogWarning("Order with ID {OrderID} not found.", orderID);
                    return NotFound($"Order with ID {orderID} was not found.");
                }

                // Return the order details
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching details for order with ID {OrderID}.", orderID);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }


        [HttpPost]
        [Route("InsertOrderWithDetails")]
        public IActionResult InsertOrderWithDetails([FromBody] Order order)
        {
            try
            {
                _logger.LogInformation("Inserting a new order with details: {Order}.", order);
                Order.InsertOrderWithDetails(order);
                return Ok("Order and its details inserted successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting a new order with details: {Order}.", order);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }


        [HttpPut("EditOrder")]
        public IActionResult EditOrder([FromBody] Order order)
        {
            try
            {
                _logger.LogInformation("Editing order with ID {OrderID}.", order.OrderId);
                Order.EditOrder(order);
                return Ok($"Order with ID {order.OrderId} was successfully updated.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error editing order with ID {OrderID}.", order.OrderId);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }


        [HttpDelete]
        [Route("DeleteOrderById/{orderId}")]
        public IActionResult DeleteOrderByID(int orderId)
        {
            try
            {
                _logger.LogInformation("Deleting order with ID {OrderID}.", orderId);
                Order.DeleteOrderByID(orderId);
                return Ok("Order and its details removed successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order with ID {OrderID}.", orderId);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }
    }
}
