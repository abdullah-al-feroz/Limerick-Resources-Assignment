using Limerick.ResourceAssignment.Api.Helpers;
using Limerick.ResourceAssignment.Api.Model;

namespace Limerick.ResourceAssignment.Api.Interfaces
{
    public interface ISaleRepository : IGenericRepository<Sale>
    {
        Task<PagedList<Sale>> GetPagedSales(PaginationParams paginationParams);
    }
}
