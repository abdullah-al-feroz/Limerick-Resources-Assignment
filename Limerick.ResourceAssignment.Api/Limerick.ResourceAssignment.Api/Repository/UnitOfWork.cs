using Limerick.ResourceAssignment.Api.Data;
using Limerick.ResourceAssignment.Api.Interfaces;

namespace Limerick.ResourceAssignment.Api.Repository
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Products = new ProductRepository(_context);
            Sales = new SaleRepository(_context);
            Users = new UserRepository(_context);
        }

        public IProductRepository Products { get; private set; }
        public ISaleRepository Sales { get; private set; }
        public IUserRepository Users { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
