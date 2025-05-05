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
                    p.Price,
                    p.StockQty
                })
                .ToListAsync<object>();
        }

        public async Task<IEnumerable<object>> GetStockReport(DateTime from, DateTime to, string name)
        {
            var salesQuery = _context.Sales
                .Include(s => s.Product)
                .Where(s => s.SaleDate >= from && s.SaleDate <= to);

            if (!string.IsNullOrWhiteSpace(name))
            {
                salesQuery = salesQuery.Where(s => s.Product.Name.Contains(name));
            }

            var report = salesQuery
                .GroupBy(s => s.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    Name = g.First().Product.Name,
                    Price = g.First().Product.Price,
                    SoldQuantity = g.Sum(s => s.QuantitySold)
                })
                .ToList();

            return report.Cast<object>();
        }
    }
}
