using Limerick.ResourceAssignment.Api.Data;
using Limerick.ResourceAssignment.Api.Interfaces;
using Limerick.ResourceAssignment.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Limerick.ResourceAssignment.Api.Repository
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }
    }
}
