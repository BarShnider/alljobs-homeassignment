using Microsoft.AspNetCore.Mvc;
using NorthwindOrdersAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindOrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        // GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("GetOrderDetailsByOrderId/{orderId}")]
        public List<OrderDetail> GetOrderDetailsByOrderId(int orderId)
        {
            return OrderDetail.GetOrderDetailsByOrderId(orderId);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ValuesController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpPut("EditOrderDetail")]
        public IActionResult EditOrderDetail([FromBody] OrderDetail orderDetail)
        {
            try
            {
                orderDetail.EditOrderDetail();
                return Ok($"Order Detail with ID {orderDetail.OrderDetailID} was successfully updated.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpDelete("DeleteOrderDetail/{orderDetailId}")]
        public IActionResult DeleteOrderDetail(int orderDetailId)
        {
            try
            {
                OrderDetail.DeleteOrderDetail(orderDetailId);
                return Ok($"Order Detail with ID {orderDetailId} was successfully deleted.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
