using Limerick.ResourceAssignment.Api.Data;
using Limerick.ResourceAssignment.Api.Helpers;
using Limerick.ResourceAssignment.Api.Interfaces;
using Limerick.ResourceAssignment.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Limerick.ResourceAssignment.Api.Repository
{
    public class SaleRepository : GenericRepository<Sale>, ISaleRepository
    {
        private readonly AppDbContext _context;

        public SaleRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<PagedList<Sale>>  GetPagedSales(PaginationParams paginationParams)
        {
            var query = _context.Sales
                .Include(s => s.Product)
                .Where(p => (string.IsNullOrEmpty(paginationParams.Name) ||
                     p.Product.Name.ToLower().Contains(paginationParams.Name) ||
                     p.Product.SKU.ToLower().Contains(paginationParams.Name)))
                .OrderByDescending(s => s.SaleDate)
                .AsQueryable();

            return await PagedList<Sale>.CreateAsync(query, paginationParams.PageNumber, paginationParams.PageSize);
        }
    }
}
