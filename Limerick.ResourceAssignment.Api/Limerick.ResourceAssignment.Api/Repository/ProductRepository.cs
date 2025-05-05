using Limerick.ResourceAssignment.Api.Data;
using Limerick.ResourceAssignment.Api.Helpers;
using Limerick.ResourceAssignment.Api.Interfaces;
using Limerick.ResourceAssignment.Api.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Limerick.ResourceAssignment.Api.Repository
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<PagedList<Product>> GetPagedProducts(PaginationParams paginationParams)
        {
            var searchTerm = paginationParams.Name?.Trim().ToLower();

            var query = _context.Products
                .Where(p => !p.IsDeleted &&
                    (string.IsNullOrEmpty(searchTerm) ||
                     p.Name.ToLower().Contains(searchTerm) ||
                     p.SKU.ToLower().Contains(searchTerm)))
                .OrderBy(p => p.Name)
                .AsQueryable();

            return await PagedList<Product>.CreateAsync(query, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<IEnumerable<object>> GetCurrentStockReport()
        {    
            return await _context.Products
                .Where(p => !p.IsDeleted)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.SKU,
                    p.Price,
                    p.StockQty
                })
                .ToListAsync<object>();
        }

        public async Task<IEnumerable<object>> GetStockReport(DateTime from, DateTime to, string name)
        {
            var productsQuery = _context.Products
                .Where(p => !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(name))
            {
                productsQuery = productsQuery.Where(p => p.Name.Contains(name));
            }

            var products = await productsQuery.ToListAsync();

            var salesData = await _context.Sales
                .GroupBy(s => s.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    SoldBeforePeriod = g.Where(s => s.SaleDate < from).Sum(s => s.QuantitySold),
                    SoldInPeriod = g.Where(s => s.SaleDate >= from && s.SaleDate <= to).Sum(s => s.QuantitySold)
                })
                .ToListAsync();

            return products.Select(p =>
            {
                var productSales = salesData.FirstOrDefault(s => s.ProductId == p.Id);
                var soldBefore = productSales?.SoldBeforePeriod ?? 0;
                var soldInPeriod = productSales?.SoldInPeriod ?? 0;
                var openingStock = p.StockQty - soldBefore;

                return new
                {
                    ProductId = p.Id,
                    Name = p.Name,
                    Sku = p.SKU,
                    Price = p.Price,
                    OpeningStock = openingStock,
                    SoldQuantity = soldInPeriod,
                    ClosingStock = openingStock - soldInPeriod
                };
            });
        }
    }
}
