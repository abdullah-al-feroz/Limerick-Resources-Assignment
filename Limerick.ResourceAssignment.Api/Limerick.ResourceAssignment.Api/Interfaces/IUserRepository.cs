using Limerick.ResourceAssignment.Api.Model;

namespace Limerick.ResourceAssignment.Api.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
        Task<bool> UserExists(string username);
    }
}
