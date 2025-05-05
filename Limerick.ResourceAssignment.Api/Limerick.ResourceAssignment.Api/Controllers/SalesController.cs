using AutoMapper;
using Limerick.ResourceAssignment.Api.DTOs;
using Limerick.ResourceAssignment.Api.Helpers;
using Limerick.ResourceAssignment.Api.Interfaces;
using Limerick.ResourceAssignment.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Limerick.ResourceAssignment.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SalesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> RecordSale(SaleDto dto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(dto.ProductId);
            if (product == null) return NotFound("Product not found");

            if (dto.QuantitySold <= 0 || dto.QuantitySold > product.StockQty)
                return BadRequest("Invalid quantity sold");

            var sale = new Sale
            {
                ProductId = dto.ProductId,
                QuantitySold = dto.QuantitySold,
                TotalPrice = dto.QuantitySold * product.Price,
                SaleDate = DateTime.UtcNow
            };

            product.StockQty -= dto.QuantitySold;

            await _unitOfWork.Sales.AddAsync(sale);
            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();

            return Ok(sale);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams paginationParams)
        {
            var sales = await _unitOfWork.Sales.GetPagedSales(paginationParams);
            Response.AddPaginationHeader(sales.CurrentPage, sales.PageSize, sales.TotalCount, sales.TotalPages);
            return Ok(sales);
        }
    }
}
