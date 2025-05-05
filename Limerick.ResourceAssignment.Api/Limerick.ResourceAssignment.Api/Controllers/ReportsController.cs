using Limerick.ResourceAssignment.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Limerick.ResourceAssignment.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReportsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("current-stock")]
        public async Task<IActionResult> GetCurrentStock()
        {
            var report = await _unitOfWork.Products.GetCurrentStockReport();
            return Ok(report);
        }

        [HttpGet("stock-summary")]
        public async Task<IActionResult> GetStockSummary([FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] string? name)
        {
            if (from > to)
                return BadRequest("Invalid date range");

            var report = await _unitOfWork.Products.GetStockReport(from, to, name="");
            return Ok(report);
        }
    }
}
