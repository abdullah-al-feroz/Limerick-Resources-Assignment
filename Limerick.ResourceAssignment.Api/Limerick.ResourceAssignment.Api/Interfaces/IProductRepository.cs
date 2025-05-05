using Limerick.ResourceAssignment.Api.Helpers;
using Limerick.ResourceAssignment.Api.Model;

namespace Limerick.ResourceAssignment.Api.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<IEnumerable<object>> GetCurrentStockReport();
        Task<PagedList<Product>> GetPagedProducts(PaginationParams paginationParams);

        Task<IEnumerable<object>> GetStockReport(DateTime from, DateTime to, string name);
    }
}
