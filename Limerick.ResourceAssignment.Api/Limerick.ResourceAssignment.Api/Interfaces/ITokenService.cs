using Limerick.ResourceAssignment.Api.Model;

namespace Limerick.ResourceAssignment.Api.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
