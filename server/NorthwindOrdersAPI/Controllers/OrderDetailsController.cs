using Microsoft.AspNetCore.Mvc;
using NorthwindOrdersAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindOrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly ILogger<OrderDetailsController> _logger;

        public OrderDetailsController(ILogger<OrderDetailsController> logger)
        {
            _logger = logger;
        }


        [HttpGet]
        [Route("GetOrderDetailsByOrderId/{orderId}")]
        public IActionResult GetOrderDetailsByOrderId(int orderId)
        {
            try
            {
                _logger.LogInformation("Fetching order details for OrderID {OrderID}.", orderId);
                return Ok(OrderDetail.GetOrderDetailsByOrderId(orderId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching order details for OrderID {OrderID}.", orderId);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        [HttpPut("EditOrderDetail")]
        public IActionResult EditOrderDetail([FromBody] OrderDetail orderDetail)
        {
            try
            {
                _logger.LogInformation("Editing order detail with ID {OrderDetailID}.", orderDetail.OrderDetailID);
                orderDetail.EditOrderDetail();
                return Ok($"Order Detail with ID {orderDetail.OrderDetailID} was successfully updated.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error editing order detail with ID {OrderDetailID}.", orderDetail.OrderDetailID);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }


        [HttpDelete("DeleteOrderDetail/{orderDetailId}")]
        public IActionResult DeleteOrderDetail(int orderDetailId)
        {
            try
            {
                _logger.LogInformation("Deleting order detail with ID {OrderDetailID}.", orderDetailId);
                OrderDetail.DeleteOrderDetail(orderDetailId);
                return Ok($"Order Detail with ID {orderDetailId} was successfully deleted.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order detail with ID {OrderDetailID}.", orderDetailId);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

    }
}
